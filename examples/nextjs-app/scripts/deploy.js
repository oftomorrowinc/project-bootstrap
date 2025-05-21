#!/usr/bin/env node

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = question =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });

async function checkFirebaseProject() {
  try {
    const rcData = await fs.readFile('.firebaserc', 'utf8');
    const rcConfig = JSON.parse(rcData);

    if (rcConfig.projects.default === 'your-project-id') {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

async function updateFirebaseProject(projectId) {
  try {
    const rcData = await fs.readFile('.firebaserc', 'utf8');
    const rcConfig = JSON.parse(rcData);

    rcConfig.projects.default = projectId;

    await fs.writeFile('.firebaserc', JSON.stringify(rcConfig, null, 2), 'utf8');
    console.log(`Updated .firebaserc with project ID: ${projectId}`);
    return true;
  } catch (err) {
    console.error('Error updating .firebaserc:', err);
    return false;
  }
}

async function createEnvFile(projectId) {
  try {
    // Check if .env already exists
    try {
      await fs.access('.env');
      console.log('.env file already exists. Skipping creation.');
      return true;
    } catch {
      // File doesn't exist, continue with creation
    }

    const envContent = `# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${projectId}.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${projectId}.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Environment
NODE_ENV=development
`;

    await fs.writeFile('.env', envContent, 'utf8');
    console.log('Created .env file. Please update with your Firebase config values.');
    return true;
  } catch (err) {
    console.error('Error creating .env file:', err);
    return false;
  }
}

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    const childProcess = exec(command);

    childProcess.stdout.on('data', data => {
      process.stdout.write(data);
    });

    childProcess.stderr.on('data', data => {
      process.stderr.write(data);
    });

    childProcess.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  console.log('\n🚀 Next.js Firebase Deployment Helper\n');

  try {
    // Check if firebase project is configured
    const hasFirebaseProject = await checkFirebaseProject();

    if (!hasFirebaseProject) {
      console.log('Firebase project not configured.');

      const initFirebase = await prompt('Do you want to initialize Firebase? (y/n): ');

      if (initFirebase.toLowerCase() === 'y') {
        console.log('\nInitializing Firebase...');
        try {
          await runCommand('firebase login');
          await runCommand('firebase projects:list');

          const projectId = await prompt('\nEnter your Firebase project ID: ');

          if (!projectId) {
            throw new Error('Project ID is required');
          }

          await updateFirebaseProject(projectId);
          await createEnvFile(projectId);

          console.log('\nFirebase initialized successfully!');
        } catch (err) {
          console.error('Error initializing Firebase:', err.message);
          rl.close();
          return;
        }
      } else {
        console.log('Deployment cancelled. Please configure Firebase before deploying.');
        rl.close();
        return;
      }
    }

    // Build and deploy
    console.log('\n📦 Building Next.js app...');
    await runCommand('npm run build');

    console.log('\n🚀 Deploying to Firebase...');
    await runCommand('firebase deploy');

    console.log('\n✅ Deployment completed successfully!');
    console.log('\nYour Next.js app is now available on Firebase App Hosting.');
    console.log('\nView Firebase hosting URL and other resources in the Firebase Console:');
    console.log('https://console.firebase.google.com\n');
  } catch (err) {
    console.error('\n❌ Deployment failed:', err.message);
  } finally {
    rl.close();
  }
}

main();
