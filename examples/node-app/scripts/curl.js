#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import fs from 'fs';

program
  .name('curl')
  .description('A simplified curl replacement for localhost API testing')
  .version('1.0.0')
  .argument('[url]', 'URL to request (defaults to localhost:3000)')
  .option('-X, --request <method>', 'Request method to use', 'GET')
  .option('-d, --data <data>', 'Data to send in the body')
  .option('-H, --header <header...>', 'Headers to include')
  .option('-o, --output <file>', 'Write response to file instead of stdout')
  .option('--json', 'Parse input data as JSON')
  .option('-s, --silent', 'Silent mode')
  .option('-f, --fail', 'Fail silently on server errors')
  .option('-L, --location', 'Follow redirects')
  .option('-I, --head', 'Show document info only')
  .option('-v, --verbose', 'Make the operation more talkative')
  .action(async (url, options) => {
    // Format the URL - add localhost:3000 prefix if only path provided
    let fullUrl = url || 'http://localhost:3000';
    if (!fullUrl.startsWith('http')) {
      fullUrl = `http://localhost:3000/${url?.startsWith('/') ? url.substring(1) : url}`;
    }

    if (options.verbose) {
      console.log(`> ${options.request} ${fullUrl}`);
    }

    try {
      // Process headers
      const headers = {};
      if (options.header) {
        options.header.forEach((h) => {
          const parts = h.split(':');
          if (parts.length > 1) {
            headers[parts[0].trim()] = parts.slice(1).join(':').trim();
          }
        });
      }

      // Process request options
      const axiosConfig = {
        method: options.request,
        url: fullUrl,
        headers,
        validateStatus: options.fail ? (status) => status < 400 : null,
        maxRedirects: options.location ? 5 : 0,
      };

      // Process request data
      if (options.data) {
        let data = options.data;

        // Check if data is a file path
        if (data.startsWith('@') && !options.json) {
          const filePath = data.substring(1);
          data = fs.readFileSync(filePath, 'utf8');
        }

        // Parse as JSON if needed
        if (options.json) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.error('Error parsing JSON data:', e.message);
            process.exit(1);
          }
        }

        axiosConfig.data = data;
      }

      // Handle HEAD requests
      if (options.head) {
        axiosConfig.method = 'HEAD';
      }

      // Make the request
      const response = await axios(axiosConfig);

      // Process response
      if (options.head || options.verbose) {
        console.log('Status:', response.status);
        console.log('Headers:');
        Object.entries(response.headers).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }

      if (!options.head) {
        if (options.output) {
          const outputData =
            typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data, null, 2);
          fs.writeFileSync(options.output, outputData);
          if (!options.silent) {
            console.log(`Response saved to ${options.output}`);
          }
        } else if (!options.silent) {
          console.log(
            typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data, null, 2),
          );
        }
      }
    } catch (error) {
      if (options.fail) {
        process.exit(1);
      }

      if (!options.silent) {
        if (error.response) {
          console.error(`Error: ${error.response.status} ${error.response.statusText}`);
          if (options.verbose) {
            console.error(error.response.data);
          }
        } else {
          console.error(`Error: ${error.message}`);
        }
      }

      process.exit(1);
    }
  });

// Examples section
program.on('--help', () => {
  console.log(`
Examples:
  # GET request to localhost:3000/api/users
  curl api/users

  # POST JSON data
  curl -X POST -H "Content-Type: application/json" -d '{"name":"John"}' api/users

  # POST form data from file
  curl -X POST -d @data.json api/users

  # Follow redirects
  curl -L api/redirect

  # Get response headers only
  curl -I api/users
  `);
});

program.parse();
