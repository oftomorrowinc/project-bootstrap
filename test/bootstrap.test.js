import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { expect, test, describe, beforeAll } from '@jest/globals';
import yaml from 'js-yaml';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define paths
const templatesDir = path.join(rootDir, 'templates');
const examplesDir = path.join(rootDir, 'examples');
const filesDir = path.join(rootDir, 'files');
const bootstrapScript = path.join(rootDir, 'src', 'bootstrap.js');

// Helper function to run the bootstrapper with a customized projectfile for testing
function runBootstrap(templateDir) {
  try {
    // Modify the projectfile.yml to remove git init command for testing
    const projectfilePath = path.join(templateDir, 'projectfile.yml');
    const projectfileContent = fs.readFileSync(projectfilePath, 'utf8');
    const config = yaml.load(projectfileContent);

    // Remove any git commands from the commands array
    if (config.commands) {
      config.commands = config.commands.filter((cmd) => !cmd.includes('git init'));
    }

    // Write the modified projectfile back
    fs.writeFileSync(projectfilePath, yaml.dump(config), 'utf8');

    // Use the actual bootstrap.js script
    execSync(`node ${bootstrapScript} run`, {
      cwd: templateDir,
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    console.error(`Error running bootstrap in ${templateDir}:`, error.message);
    return false;
  }
}

// Helper function to completely clean a directory including hidden files/folders
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    // Remove all files and subdirectories
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        fs.removeSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    });
  } else {
    fs.mkdirpSync(dir);
  }
}

// Helper function to check if a directory is empty
function isDirectoryEmpty(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files.length === 0;
}

describe('Project Bootstrap', () => {
  // Get all templates
  const templates = fs
    .readdirSync(templatesDir)
    .filter((file) => fs.statSync(path.join(templatesDir, file)).isDirectory());

  // Clear out entire examples directory before all tests
  beforeAll(() => {
    console.log('Cleaning examples directory...');
    if (fs.existsSync(examplesDir)) {
      cleanDirectory(examplesDir);
    } else {
      fs.mkdirpSync(examplesDir);
    }
  });

  // Test each template
  templates.forEach((templateName) => {
    describe(`Template: ${templateName}`, () => {
      const templateDir = path.join(templatesDir, templateName);
      const exampleDir = path.join(examplesDir, templateName);
      const projectfileYml = path.join(templateDir, 'projectfile.yml');

      // Clear and set up the example directory before each test suite
      beforeAll(() => {
        console.log(`Setting up clean example for ${templateName}...`);

        // Clear any existing example including hidden files/folders
        if (fs.existsSync(exampleDir)) {
          cleanDirectory(exampleDir);
        } else {
          fs.mkdirpSync(exampleDir);
        }

        // Copy template's projectfile.yml to example directory
        fs.copyFileSync(projectfileYml, path.join(exampleDir, 'projectfile.yml'));
      });

      test('Example directory is empty before running bootstrap', () => {
        // The directory should only contain the projectfile.yml at this point
        const files = fs.readdirSync(exampleDir);
        expect(files.length).toBe(1);
        expect(files[0]).toBe('projectfile.yml');
      });

      test('Bootstrap runs successfully', () => {
        const success = runBootstrap(exampleDir);
        expect(success).toBe(true);
      });

      test('Creates all directories specified in projectfile.yml', () => {
        const yamlContent = fs.readFileSync(projectfileYml, 'utf8');
        const config = yaml.load(yamlContent);

        if (config.directories) {
          config.directories.forEach((dir) => {
            const dirPath = path.join(exampleDir, dir);
            expect(fs.existsSync(dirPath)).toBe(true);
          });
        }
      });

      test('Validates that all source files exist in /files directory', () => {
        const yamlContent = fs.readFileSync(projectfileYml, 'utf8');
        const config = yaml.load(yamlContent);

        if (config.files) {
          const missingFiles = [];

          Object.entries(config.files).forEach(([filename, dest]) => {
            if (typeof dest === 'string') {
              const sourceFilePath = path.join(filesDir, filename);
              if (!fs.existsSync(sourceFilePath)) {
                missingFiles.push(filename);
              }
            }
          });

          if (missingFiles.length > 0) {
            console.error('Missing files in /files directory:');
            missingFiles.forEach((file) => console.error(`  - ${file}`));
          }

          expect(missingFiles.length).toBe(0);
        }
      });

      test('Creates all files specified in projectfile.yml', () => {
        const yamlContent = fs.readFileSync(projectfileYml, 'utf8');
        const config = yaml.load(yamlContent);

        if (config.files) {
          const missingDestFiles = [];

          Object.entries(config.files).forEach(([filename, dest]) => {
            // Check if file was created at destination
            if (typeof dest === 'string') {
              const destPath = path.join(exampleDir, dest);
              if (!fs.existsSync(destPath)) {
                missingDestFiles.push(`${filename} -> ${dest}`);
              }
            }
          });

          if (missingDestFiles.length > 0) {
            console.error('Files not created at destination:');
            missingDestFiles.forEach((file) => console.error(`  - ${file}`));
          }

          expect(missingDestFiles.length).toBe(0);
        }
      });

      test('package.json contains correct scripts and type', () => {
        const yamlContent = fs.readFileSync(projectfileYml, 'utf8');
        const config = yaml.load(yamlContent);
        const packageJsonPath = path.join(exampleDir, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
          const packageJson = fs.readJsonSync(packageJsonPath);

          // Check if package is defined in projectfile.yml
          if (config.package) {
            // Check type
            if (config.package.type) {
              expect(packageJson.type).toBe(config.package.type);
            }

            // Check scripts
            if (config.package.scripts) {
              Object.entries(config.package.scripts).forEach(([scriptName, scriptCmd]) => {
                expect(packageJson.scripts[scriptName]).toBe(scriptCmd);
              });
            }
          }
        }
      });

      // Test for node-app specific files
      if (templateName === 'node-app') {
        test('curl.js script exists and is executable', () => {
          const curlPath = path.join(exampleDir, 'scripts', 'curl.js');
          if (fs.existsSync(curlPath)) {
            // Check if file has execute permissions
            const stats = fs.statSync(curlPath);
            const execPermission = (stats.mode & 0o111) !== 0; // Check if any execute bit is set
            expect(execPermission).toBe(true);
          } else {
            // If curl.js doesn't exist, fail the test and provide helpful error
            console.error(`curl.js not found at ${curlPath}`);
            console.error(
              'Check that "curl.js" exists in your /files directory and is being copied correctly'
            );
            expect(fs.existsSync(curlPath)).toBe(true);
          }
        });

        test('CLAUDE.md file exists', () => {
          const claudeMdPath = path.join(exampleDir, 'CLAUDE.md');
          if (!fs.existsSync(claudeMdPath)) {
            console.error(`CLAUDE.md not found at ${claudeMdPath}`);
            console.error(
              'Check that "CLAUDE.md" exists in your /files directory and is being copied correctly'
            );
          }
          expect(fs.existsSync(claudeMdPath)).toBe(true);
        });
      }
    });
  });
});
