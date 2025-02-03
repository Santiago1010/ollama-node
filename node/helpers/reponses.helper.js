// ------------------------- INTERNAL DEPENDENCIES ------------------------- //
// Project-specific modules and configurations
const i18n = require('../configurations/i18n'); // Import for internationalization

/**
 * Factory function to create a response object with a message and optional additional data.
 * @param {string} message - The message to include in the response.
 * @param {object} data - Optional additional data to include in the response.
 * @param {object} responseData - Optional response data for internationalization.
 * @returns {object} - A response object containing the message and additional data.
 */
const responseFactory = (
  message = 'default',
  data = null,
  responseData = {},
) => {
  // Initialize response with a message, using i18n for translation if provided
  let response = { message: getResponse(message, responseData) };

  // If additional data is provided, merge it into the response object
  if (data) response = { ...response, ...data };

  return response;
};

/**
 * Helper function to send a success response.
 * @param {object} res - The response object from Express.
 * @param {number} code - The HTTP status code to send (default is 200).
 * @param {string} message - The success message.
 * @param {object} data - Optional data to include in the response.
 * @param {object} responseData - Optional response data for internationalization.
 */
const success = (res, message, code = 200, data = null, responseData = {}) => {
  // Send a success response with the provided message and optional data
  res.status(code).json(responseFactory(message, data, responseData));
};

/**
 * Helper function to send an error response.
 * @param {object} res - The response object from Express.
 * @param {number} code - The HTTP status code to send (default is 500).
 * @param {string} message - The error message.
 * @param {object} data - Optional data to include in the response.
 * @param {object} responseData - Optional response data for internationalization.
 */
const error = (res, message, code = 500, data = null, responseData = {}) => {
  console.clear();
  console.log(message);
  // Send an error response with the provided message and optional data
  res.status(code).json(responseFactory(message, data, responseData));
};

/**
 * Helper function to send a validation error response.
 * @param {object} res - The response object from Express.
 * @param {string} message - The validation error message, with multiple errors separated by a semicolon.
 */
const validationError = (res, errors) => {
  // Split the validation error message into an array and send it as a response
  res.status(400).json({ errors });
};

/**
 * Helper function to create a custom error object with a status code.
 * @param {string} message - The error message (default is 'Error').
 * @param {number} code - The status code for the error (default is 500).
 * @returns {Error} - A custom error object with the provided status code and message.
 */
const customError = (message = 'Error', code = 500) => {
  const error = new Error(message);
  error.statusCode = code;

  return error;
};

// Exporting functions and classes for use in other parts of the application
module.exports = {
  responseFactory,
  success,
  error,
  validationError,
  customError,
};
