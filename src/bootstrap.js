#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { execSync } from 'child_process';
import chalk from 'chalk';
import mustache from 'mustache';
import { program } from 'commander';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const filesDir = path.join(rootDir, 'files');

program
  .name('project-bootstrap')
  .description('Dockerfile-like project bootstrapping tool')
  .version('1.0.0');

// Init command - copies a template to the current directory
program
  .command('init')
  .description('Initialize a new project with a template')
  .argument('[template]', 'Template to use (node-app, etc.)', 'node-app')
  .option('-l, --list', 'List available templates')
  .action(async (templateName, options) => {
    const templatesDir = path.join(rootDir, 'templates');
    
    // List available templates
    if (options.list) {
      console.log(chalk.blue('Available templates:'));
      const templates = fs.readdirSync(templatesDir)
        .filter(file => fs.statSync(path.join(templatesDir, file)).isDirectory());
      
      templates.forEach(template => {
        try {
          const templateConfig = yaml.load(fs.readFileSync(
            path.join(templatesDir, template, 'projectfile.yml'), 'utf8'
          ));
          console.log(`- ${chalk.green(template)}: ${templateConfig.description || ''}`);
        } catch (error) {
          console.log(`- ${chalk.green(template)}: [Error reading template]`);
        }
      });
      return;
    }
    
    // Check if template exists
    const templateDir = path.join(templatesDir, templateName);
    if (!fs.existsSync(templateDir)) {
      console.error(chalk.red(`Error: Template '${templateName}' not found`));
      process.exit(1);
    }
    
    // Copy the template's projectfile.yml to the current directory
    const sourceFile = path.join(templateDir, 'projectfile.yml');
    const destFile = path.join(process.cwd(), 'projectfile.yml');
    
    if (fs.existsSync(destFile)) {
      console.log(chalk.yellow('Warning: projectfile.yml already exists in the current directory'));
      // Could add a prompt to confirm overwrite here
    }
    
    fs.copyFileSync(sourceFile, destFile);
    console.log(chalk.green(`Template '${templateName}' initialized! Copied projectfile.yml to current directory.`));
    console.log(chalk.blue('Next steps:'));
    console.log('1. Update the project name and other changes (if needed) in projectfile.yml');
    console.log('2. Run "npx github:oftomorrowinc/project-bootstrap run" to execute the setup');
  });

// Run command - executes the local projectfile.yml
program
  .command('run')
  .description('Run the local projectfile.yml to bootstrap the project')
  .option('-f, --file <file>', 'Path to projectfile.yml', 'projectfile.yml')
  .action(async (options) => {
    const projectFilePath = path.join(process.cwd(), options.file);
    
    if (!fs.existsSync(projectFilePath)) {
      console.error(chalk.red(`Error: ${options.file} not found in current directory`));
      console.log(chalk.blue('Run "npx project-bootstrap init" to initialize a template first'));
      process.exit(1);
    }
    
    try {
      bootstrapProject(projectFilePath);
    } catch (error) {
      console.error(chalk.red('Error bootstrapping project:'));
      console.error(error);
      process.exit(1);
    }
  });

// Default command (for backwards compatibility)
program
  .action(() => {
    // If no command is specified, check if projectfile.yml exists
    const projectFilePath = path.join(process.cwd(), 'projectfile.yml');
    
    if (fs.existsSync(projectFilePath)) {
      try {
        bootstrapProject(projectFilePath);
      } catch (error) {
        console.error(chalk.red('Error bootstrapping project:'));
        console.error(error);
        process.exit(1);
      }
    } else {
      console.error(chalk.red('Error: projectfile.yml not found in current directory'));
      console.log(chalk.blue('Run "npx project-bootstrap init" to initialize a template first'));
      process.exit(1);
    }
  });

// The actual bootstrapping function
async function bootstrapProject(projectFilePath) {
  const projectDir = path.dirname(projectFilePath);
  const fileContent = fs.readFileSync(projectFilePath, 'utf8');
  const config = yaml.load(fileContent);
  
  console.log(chalk.blue(`Bootstrapping project: ${config.name || 'New Project'}`));
  
  // Create directories
  if (config.directories) {
    for (const dir of config.directories) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirpSync(path.join(projectDir, dir));
    }
  }
  
  // Create files
  if (config.files) {
    for (const [filename, destPath] of Object.entries(config.files)) {
      if (typeof destPath === 'string') {
        // Copy file from files directory to destination
        console.log(`Copying file: ${filename} to ${destPath}`);
        
        // Check the global files directory
        const sourceFilePath = path.join(filesDir, filename);
        const destFilePath = path.join(projectDir, destPath);
        
        // Create destination directory if it doesn't exist
        fs.mkdirpSync(path.dirname(destFilePath));
        
        if (fs.existsSync(sourceFilePath)) {
          // Read the source file
          let content = fs.readFileSync(sourceFilePath, 'utf8');
          
          // Render template with project variables
          content = mustache.render(content, {
            name: config.name || path.basename(projectDir),
            description: config.description || 'A new project'
          });
          
          // Write to destination
          fs.writeFileSync(destFilePath, content);
        } else {
          console.error(chalk.yellow(`Warning: Source file not found: ${sourceFilePath}`));
        }
      } else {
        console.error(chalk.red(`Error: Invalid destination for file ${filename}. Expected string, got ${typeof destPath}`));
      }
    }
  }

  // Handle package.json updates
  if (config.package) {
    await updatePackageJson(projectDir, config);
  }
  
  // Run commands
  if (config.commands) {
    for (const cmd of config.commands) {
      let processedCmd = cmd;
      
      // Handle dependencies and devDependencies placeholders
      if (cmd.includes('{{dependencies}}') && config.packages && config.packages.dependencies) {
        processedCmd = cmd.replace('{{dependencies}}', config.packages.dependencies.join(' '));
      }
      
      if (cmd.includes('{{devDependencies}}') && config.packages && config.packages.devDependencies) {
        processedCmd = cmd.replace('{{devDependencies}}', config.packages.devDependencies.join(' '));
      }
      
      // Add new handling for package.dependencies and package.devDependencies
      if (cmd.includes('{{dependencies}}') && config.package && config.package.dependencies) {
        const dependencies = Object.entries(config.package.dependencies)
          .map(([name, version]) => `${name}@${version}`)
          .join(' ');
        processedCmd = cmd.replace('{{dependencies}}', dependencies);
      }
      
      if (cmd.includes('{{devDependencies}}') && config.package && config.package.devDependencies) {
        const devDependencies = Object.entries(config.package.devDependencies)
          .map(([name, version]) => `${name}@${version}`)
          .join(' ');
        processedCmd = cmd.replace('{{devDependencies}}', devDependencies);
      }
      
      console.log(chalk.yellow(`Running: ${processedCmd}`));
      try {
        execSync(processedCmd, { stdio: 'inherit', cwd: projectDir });
      } catch (error) {
        console.error(chalk.red(`Command failed: ${processedCmd}`));
        console.error(error.message);
        // Continue with other commands
      }
    }
  }
  
  console.log(chalk.green('✅ Project bootstrap complete!'));
}

// Helper function to update package.json with project configuration
async function updatePackageJson(projectDir, config) {
  console.log(`Updating package.json`);
  const packageJsonPath = path.join(projectDir, 'package.json');
  
  // Initialize or read existing package.json
  let packageJson;
  if (fs.existsSync(packageJsonPath)) {
    try {
      packageJson = fs.readJsonSync(packageJsonPath);
    } catch (error) {
      console.error(`Error reading package.json: ${error.message}`);
      packageJson = {
        name: config.name || path.basename(projectDir),
        version: '1.0.0',
        description: config.description || ''
      };
    }
  } else {
    packageJson = {
      name: config.name || path.basename(projectDir),
      version: '1.0.0',
      description: config.description || ''
    };
  }
  
  // Update fields based on config.package
  if (config.package) {
    // Update type
    if (config.package.type) {
      packageJson.type = config.package.type;
    }
    
    // Update main
    if (config.package.main) {
      packageJson.main = config.package.main;
    }
    
    // Update scripts - merge existing with new scripts
    if (config.package.scripts) {
      packageJson.scripts = {
        ...(packageJson.scripts || {}),
        ...config.package.scripts
      };
    }
    
    // Update dependencies - this doesn't install them, just updates package.json
    if (config.package.dependencies) {
      packageJson.dependencies = {
        ...(packageJson.dependencies || {}),
        ...config.package.dependencies
      };
    }
    
    // Update devDependencies - this doesn't install them, just updates package.json
    if (config.package.devDependencies) {
      packageJson.devDependencies = {
        ...(packageJson.devDependencies || {}),
        ...config.package.devDependencies
      };
    }
    
    // Update other fields (like keywords, author, license, etc.)
    for (const [key, value] of Object.entries(config.package)) {
      if (!['type', 'main', 'scripts', 'dependencies', 'devDependencies'].includes(key)) {
        packageJson[key] = value;
      }
    }
  }
  
  // Write updated package.json
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
}

program.parse();