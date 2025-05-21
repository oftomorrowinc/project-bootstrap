# Project Bootstrap

A flexible, Dockerfile-inspired project scaffolding tool that helps you quickly set up consistent project structures across your applications.

## Quick Start

```bash
mkdir new-project && cd new-project

# List available templates
npx github:oftomorrowinc/project-bootstrap init --list

# Download `projectfile.yml` template and update the name & anything else you want to change
npx github:oftomorrowinc/project-bootstrap init node-app

# Execute the template to bootstrap your project
npx github:oftomorrowinc/project-bootstrap run
```

## Overview

Project Bootstrap allows you to define your project structure, dependencies, and setup commands in a declarative YAML file, similar to a Dockerfile. You can create and share templates for different types of projects, then initialize and customize these templates for each new project you start.

## Features

- **Declarative Configuration**: Define your entire project setup in a single YAML file
- **Template Library**: Choose from pre-defined project templates or create your own
- **Self-Documenting**: The configuration file becomes part of your project's repo
- **Customizable**: Easily modify the template for your specific project needs
- **Reproducible**: Ensure consistent project setup across your team
- **No Installation Required**: Run directly with npx from GitHub

## Project File Format

The `projectfile.yml` file follows this structure:

```yaml
name: my-project
description: A sample project

# Packages to install
packages:
  dependencies:
    - express@latest
    - pug@latest
  devDependencies:
    - typescript@latest
    - jest@latest

# Directories to create
directories:
  - src
  - public
  - tests

# Files to copy from the template's files directory
files:
  'index.ts': 'src/index.ts'
  'app.ts': 'src/app.ts'
  'tsconfig.json': 'tsconfig.json'

  # Special handling for package.json scripts
  'package.json':
    type: 'module'
    scripts:
      start: 'node dist/index.js'
      dev: 'nodemon src/index.ts'
      test: 'jest'

# Commands to run
commands:
  - npm init -y
  - npm i {{dependencies}}
  - npm i -D {{devDependencies}}
  - git init
```

## Available Templates

- **node-app**: Node.js Express application with TypeScript, Pug, HTMX, dark theme CSS, Firebase integration, Jest and Playwright testing.
- **nextjs-app**: Next.js application with TypeScript, Firebase App Hosting, dark theme support, Tailwind CSS, Firebase integration, Jest and Playwright testing. SSR is disabled by default.

## Template File Structure

Our templates use a flat file structure in the `files` directory to make editing easier, with the `projectfile.yml` handling the placement of files in the correct project structure:

- **files/node-app/**: Contains all files for the Node.js template in a flat structure
- **files/nextjs-app/**: Contains all files for the Next.js template in a flat structure
- **templates/**: Contains the projectfile.yml for each template, which defines how files are organized

This approach makes it easy to:

1. Edit template files directly without navigating deep folder structures
2. Add new files to templates without creating complex directory paths
3. Maintain a clean separation between template definitions and their files

## Using the curl.js Helper

All templates include a curl.js helper script that lets you easily test local APIs without needing to approve curl commands in Claude Code:

```bash
# GET request
npm run curl api/users

# POST with JSON data
npm run curl -X POST -H "Content-Type: application/json" -d '{"name":"John"}' api/users

# Show headers only
npm run curl -I api/users

# See more options
npm run curl --help
```

## Creating Your Own Templates

1. Fork this repository
2. Add your template YAML to `templates/your-template-name/projectfile.yml`
3. Add any template-specific files to the `/files/your-template-name` directory
4. Submit a pull request to share with the community

## Why Use Project Bootstrap?

- **Save Time**: Stop recreating the same project structure and config files
- **Consistency**: Ensure all your projects follow the same structure and patterns
- **Onboarding**: Make it easier for new team members to understand your setup
- **Best Practices**: Encode your team's best practices into shareable templates
- **Evolution**: Evolve your templates over time as your practices improve

## Publishing a Release

1. Increment the version number in package.json
2. Update this Readme with correct version
3. Run `npm run release` to create a tag on Github
4. Visit https://github.com/oftomorrowinc/project-bootstrap/releases/new
5. Choose your new tag, enter a title & description of the updates and click PUblish release

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
