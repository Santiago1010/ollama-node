// --------------------------- NODE DEPENDENCIES --------------------------- //
// Built-in modules from Node.js
import fs from 'node:fs';
import path from 'node:path';

// ------------------------- EXTERNAL DEPENDENCIES ------------------------- //
// Third-party libraries for additional functionality
const moment = require('moment');

// ------------------------- INTERNAL DEPENDENCIES ------------------------- //
// Project-specific modules and configurations
const config = require('../configurations');
const { modes } = require('./constants.helper');

// ----------------- DECLARATION OF VARIABLES AND CONSTANTS ----------------- //
const DEBUG_FILE_PATH = path.resolve(process.cwd(), '.debug');
const { isLocal, mode } = config;

/**
 * Checks if the debug mode is enabled and if it has not expired.
 * If the debug mode is enabled, it will be disabled after 10 minutes.
 * @param {boolean} [dev=false] - If true, enables debug mode for development environments too.
 * @returns {boolean} True if debug mode is enabled, false otherwise.
 */
const checkDebugMode = (allowDevMode = false) => {
  let response = isLocal;

  try {
    const fileContent = fs.readFileSync(DEBUG_FILE_PATH, 'utf-8').split('\n');
    const debugContent = fileContent[0]?.trim(); // First line
    const timestampLine = fileContent[1]?.trim(); // Second line

    if (!response && debugContent === 'true') {
      if (timestampLine) {
        const timestamp = moment(
          timestampLine,
          'YYYY-MM-DD HH:mm:ss',
        ).valueOf(); // Converts the timestamp to milliseconds
        if (!Number.isNaN(timestamp)) {
          const now = moment().valueOf();
          // Checks if the current time is past the limit
          if (now > timestamp) {
            response = false;
            // Removes the timestamp (resets debug mode)
            fs.writeFileSync(DEBUG_FILE_PATH, 'false', 'utf-8');
          } else {
            response = true;
          }
        } else {
          console.warn(
            'The "debug" file contains an invalid timestamp on the second line:',
            timestampLine,
          );
          response = false;
        }
      } else {
        console.warn(
          'The "debug" file does not contain a timestamp on the second line.',
        );
        response = false;
      }
    } else if (!response && debugContent === 'false') {
      response = false;
    }
  } catch (error) {
    console.error('Error reading the "debug" file:', error.message);
  }

  if (!response && allowDevMode && modes[mode] > 4) return true;

  return response;
};

/**
 * Enables or disables debug mode, which allows the API to return more detailed information. Debug mode is disabled by default.
 * If enabled, it will be disabled after 10 minutes.
 * @param {boolean} [enable=true] - Whether to enable or disable debug mode.
 * @returns {string} A message indicating the status of debug mode.
 */
const setDebugMode = (enable = true) => {
  const now = moment();
  const limit = now.add(10, 'minutes'); // Sets the time limit to 10 minutes from now

  try {
    const debugContent = enable ? 'true' : 'false';
    const content = enable
      ? `${debugContent}\n${limit.format('YYYY-MM-DD HH:mm:ss')}` // Saves the time limit as a date and time in 'YYYY-MM-DD HH:mm:ss' format
      : `${debugContent}\n`; // If disabled, removes the timestamp

    fs.writeFileSync(DEBUG_FILE_PATH, content, 'utf-8');
    console.log(`Debug mode set to: ${debugContent}`);
  } catch (error) {
    console.error('Error writing to the "debug" file:', error.message);
  }

  let response = 'Debug mode ';

  if (enable) response += 'enabled' + ' until ' + limit.format('HH:mm:ss');
  if (!enable) response += 'disabled';

  return response + '.';
};

/**
 * Returns a function that logs the given message to the console. If debug mode is not enabled, returns false.
 * @param {string} header - The header to display at the top of the log block.
 * @returns {(message: string) => void} - A function that logs the given message to the console.
 */
const wrapLogging = (header) => {
  if (!checkDebugMode()) return false;

  const lineLength = 70;
  const paddingLength = Math.max(0, lineLength - header.length - 2);
  const padding = '-'.repeat(Math.floor(paddingLength / 2));

  console.log(`\n${padding} ${header.toUpperCase()} ${padding}\n`);

  return (message) => {
    console.log(message);
    if (message.startsWith('Executing')) {
      console.log(`\n${'-'.repeat(lineLength)}\n`);
    }
  };
};

/**
 * Custom logger function for logging messages in debug mode with a title.
 * The title is displayed at the top of the log, and the content is shown below with balanced dashes.
 * @param {...any} args - The log messages to be displayed. The first argument is used as the title.
 */
const clog = (...args) => {
  if (checkDebugMode()) {
    // Use the first argument as the title if provided, otherwise use 'Log' as the default title
    const title = args[0] && typeof args[0] === 'string' ? args[0] : 'Log';

    // Calculate the length of the title and determine the padding for balanced dashes
    const lineLength = 70;
    const titleLength = title.length;
    const paddingLength = Math.max(0, lineLength - titleLength - 2); // The space for dashes on each side
    const padding = '-'.repeat(Math.floor(paddingLength / 2));

    // Log the header with balanced dashes and the title
    console.log(`\n${padding} ${title.toUpperCase()} ${padding}\n`);

    // Log the actual content of the message
    console.log(...args.slice(1));

    // Add a line of dashes at the end of the log
    console.log(`\n${'-'.repeat(lineLength)}\n`);
  }
};

/**
 * Custom dir logger function for logging dir messages in debug mode with a title.
 * The title is displayed at the top of the log, and the content is shown below with balanced dashes.
 * @param {...any} args - The log messages to be displayed. The first argument is used as the title.
 */
const cdir = (...args) => {
  if (checkDebugMode()) {
    // Use the first argument as the title if provided, otherwise use 'Log' as the default title
    const title = args[0] && typeof args[0] === 'string' ? args[0] : 'Log';

    // Calculate the length of the title and determine the padding for balanced dashes
    const lineLength = 70;
    const titleLength = title.length;
    const paddingLength = Math.max(0, lineLength - titleLength - 2); // The space for dashes on each side
    const padding = '-'.repeat(Math.floor(paddingLength / 2));

    // Log the header with balanced dashes and the title
    console.log(`\n${padding} ${title.toUpperCase()} ${padding}\n`);

    // Log the actual content of the message
    console.dir(...args.slice(1), { depth: null });

    // Add a line of dashes at the end of the log
    console.log(`\n${'-'.repeat(lineLength)}\n`);
  }
};

/**
 * Custom error logger function for logging error messages in debug mode with a title.
 * Similar to `clog`, but specifically designed for error messages.
 * @param {...any} args - The error messages to be displayed. The first argument is used as the title.
 */
const cerror = (...args) => {
  if (checkDebugMode()) {
    // Use the first argument as the title if provided, otherwise use 'Error' as the default title
    const title = args[0] && typeof args[0] === 'string' ? args[0] : 'Error';

    // Calculate the length of the title and determine the padding for balanced dashes
    const lineLength = 70;
    const titleLength = title.length;
    const paddingLength = Math.max(0, lineLength - titleLength - 2); // The space for dashes on each side
    const padding = '-'.repeat(Math.floor(paddingLength / 2));

    // Log the header with balanced dashes and the title
    console.log(`\n${padding} ${title.toUpperCase()} ${padding}\n`);

    // Log the actual error content
    console.error(...args.slice(1));

    // Add a line of dashes at the end of the log
    console.log(`\n${'-'.repeat(lineLength)}\n`);
  }
};

/**
 * Custom console clear function for clearing the console in debug mode with a title.
 * Similar to `console.clear()`, but specifically designed for debug mode with a title.
 * @param {...any} args - The title to be displayed. The first argument is used as the title.
 */
const clear = (...args) => {
  if (checkDebugMode()) {
    console.clear();

    // Use the first argument as the title if provided, otherwise use 'Log' as the default title
    const title = args[0] && typeof args[0] === 'string' ? args[0] : 'Log';

    // Calculate the length of the title and determine the padding for balanced dashes
    const lineLength = 70;
    const titleLength = title.length;
    const paddingLength = Math.max(0, lineLength - titleLength - 2); // The space for dashes on each side
    const padding = '-'.repeat(Math.floor(paddingLength / 2));

    // Log the header with balanced dashes and the title
    console.log(`\n${padding} ${title.toUpperCase()} ${padding}\n`);

    // Log the actual content of the message
    console.log(...args.slice(1));

    // Add a line of dashes at the end of the log
    console.log(`\n${'-'.repeat(lineLength)}\n`);
  }
};

/**
 * Custom console clear and log function for logging dir messages in debug mode with a title.
 * The title is displayed at the top of the log, and the content is shown below with balanced dashes.
 * @param {...any} args - The log messages to be displayed. The first argument is used as the title.
 */
const clir = (...args) => {
  if (checkDebugMode()) {
    console.clear();

    // Use the first argument as the title if provided, otherwise use 'Log' as the default title
    const title = args[0] && typeof args[0] === 'string' ? args[0] : 'Log';

    // Calculate the length of the title and determine the padding for balanced dashes
    const lineLength = 70;
    const titleLength = title.length;
    const paddingLength = Math.max(0, lineLength - titleLength - 2); // The space for dashes on each side
    const padding = '-'.repeat(Math.floor(paddingLength / 2));

    // Log the header with balanced dashes and the title
    console.log(`\n${padding} ${title.toUpperCase()} ${padding}\n`);

    // Log the actual content of the message
    console.dir(...args.slice(1), { depth: null });

    // Add a line of dashes at the end of the log
    console.log(`\n${'-'.repeat(lineLength)}\n`);
  }
};

module.exports = {
  checkDebugMode,
  setDebugMode,
  wrapLogging,
  clog,
  cdir,
  cerror,
  clear,
  clir,
};
