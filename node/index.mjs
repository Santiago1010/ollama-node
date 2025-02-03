// --------------------------- NODE DEPENDENCIES --------------------------- //
import fs from 'node:fs'; // Import file system module
import path from 'node:path'; // Import path module
import http from 'node:http'; // Import HTTP module

// ------------------------- EXTERNAL DEPENDENCIES ------------------------- //
import cors from 'cors'; // Import CORS (Cross-Origin Resource Sharing) middleware to allow cross-origin requests
import express from 'express'; // Import express to set up the server and routing functionality
import moment from 'moment-timezone'; // Import moment-timezone for handling time zone specific date and time
import morgan from 'morgan'; // Import morgan for logging HTTP requests in a customizable format
// import ollama from 'ollama';
import { Ollama } from 'ollama';

// ------------------------- INTERNAL DEPENDENCIES ------------------------- //
import configurations from './configurations/index.mjs'; // Import custom configurations (e.g., server settings, database configurations)
import { extractJSON } from './helpers/strings.helper.js';

// ---------------------------- CONFIGURATIONS ---------------------------- //
const customFormat = ':method :url :statusColor - :response-time ms - :date'; // Custom log format for morgan, includes HTTP method, URL, status color, response time, and date

// Helper function to add color to log status codes based on their value
const colorize = (code, color) => `\x1b[${color}m${code}\x1b[0m`; // Wraps the status code in color codes for terminal output

// Helper function to colorize response time based on its value
const colorizeResponseTime = (time) => {
  // If the response time exceeds 400ms, it will be highlighted with a red background; otherwise, a green background
  const color = time > 400 ? '41' : '42'; // '41' is red, '42' is green for response time
  return `\x1b[${color}m${time}\x1b[0m`; // Apply the background color to the response time value
};

// Set the default timezone to 'America/Bogota' and set locale to 'en' (English) for proper date formatting
moment.tz.setDefault('America/Bogota');
moment.locale('en');

// Custom morgan token for displaying the formatted date in the log
morgan.token('date', () => moment().format('DD/MM/YYYY, HH:mm:ss.SSS')); // Format: day/month/year, hour:minute:second.millisecond

// Custom morgan token for colorizing the status code based on the response status
morgan.token('statusColor', (_, res) => {
  const status = res.statusCode;

  // Assigning different colors based on HTTP status codes
  if (status >= 500) return colorize(status, 31); // Red for server errors (>= 500)
  if (status >= 400) return colorize(status, 33); // Yellow for client errors (>= 400)
  if (status >= 300) return colorize(status, 34); // Blue for redirects (>= 300)
  if (status >= 200) return colorize(status, 32); // Green for successful responses (>= 200)

  return status; // No color for other status codes
});

// Custom morgan token for colorizing the response time in the logs
morgan.token('response-time', (req) => {
  const start = moment(req._startTime); // Capture the start time of the request

  const diffInMilliseconds = moment().diff(start, 'milliseconds'); // Calculate the time difference (response time)

  return colorizeResponseTime(Number.parseFloat(diffInMilliseconds.toFixed(2))); // Colorize the response time value
});

const ollama = new Ollama({ host: 'http://ollama:11434' })

// --------------------------------- SERVER --------------------------------- //
const app = express(); // Initialize an Express app instance

// CORS middleware setup to allow requests from different origins
app.use(cors()); // Enables Cross-Origin Resource Sharing, allowing for requests from different domains
app.options('*', cors());
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

// Setup morgan for logging HTTP requests using the custom format defined earlier
app.use(morgan(customFormat)); // Logging each request with method, URL, status, response time, and formatted date

// --------------------------------- ROUTES --------------------------------- //
// Example GET route that responds with a simple greeting message
app.get('/', (_, res) => {
  res.send('Everything ok!'); // Responds with 'Everything ok!' message
});

// POST route that echoes back the body of the request
app.post('/translate', async (req, res) => {
  const { string, context } = req.body;

  try {
    const promptTemplate = path.resolve('./templates/prompts/translate.md');
    const template = fs.readFileSync(promptTemplate, 'utf-8');

    let prompt = template.replace(/\[\[REPLACE_STRING\]\]/g, string);
    prompt = prompt.replace(/\[\[CONTEXT\]\]/g, context);

    const response = await ollama.chat({
      model: 'deepseek-llm:7b',
      messages: [{ role: 'user', content: prompt }],
    });

    console.log(response?.message);

    const json = response?.message?.content;

    return res.json(JSON.parse(json));
  } catch (error) {
    console.error(error);
  }
});
// -------------------------------------------------------------------------- //

// Create HTTP server and set timeout
const server = http.createServer(app);
server.setTimeout(120000); // 120,000 ms = 120s

// Start the server and listen on the specified port from the configuration settings
app.listen(configurations.port, () => {
  console.log('Server listening on port ' + configurations.port); // Logs the port number the server is listening on
});
