// ------------------------- INTERNAL DEPENDENCIES ------------------------- //
// Project-specific modules and configurations
const { cerror } = require('./debug.helper');

/**
 * Una función que suma un array de números.
 *
 * @param {...number} numbers - Los números a sumar.
 * @return {number} La suma total de los números.
 */
const sumNumbers = (...numbers) =>
  numbers.reduce((total, number) => total + number, 0);

/**
 * Redondea un número a un número especificado de decimales.
 *
 * @param {number} num - El número a redondear.
 * @param {number} decimals - El número de decimales a los que redondear.
 * @return {number} - El número redondeado.
 */
const roundToDecimal = (num, decimals) => Number(num.toFixed(decimals));

/**
 * Genera un número aleatorio entre los valores mínimo y máximo especificados (inclusive).
 *
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @return {number} El número generado aleatoriamente.
 */
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Calcula el porcentaje entre dos números.
 *
 * @param {number} smallerNumber - El número más pequeño.
 * @param {number} largerNumber - El número más grande.
 * @return {number} El porcentaje calculado.
 */
const calculatePercentage = (smallerNumber, largerNumber) => {
  if (smallerNumber >= largerNumber) {
    cerror(
      'Calcular porcentaje',
      'El segundo número debe ser mayor que el primero',
    );
    return null;
  }

  const percentage = (smallerNumber / largerNumber) * 100;

  return Number.parseFloat(percentage.toFixed(2));
};

/**
 * Formatea un número a una cadena de moneda utilizando el código de país especificado.
 *
 * @param {number} number - El número a formatear.
 * @param {string} countryCode - El código de país para el formato de moneda.
 * @return {string|null} La cadena de moneda formateada, o null si ocurrió un error.
 */
const formatNumberToCurrency = (number, countryCode) => {
  try {
    const formatter = new Intl.NumberFormat(countryCode, {
      style: 'currency',
      currency: countryCode,
    });

    return formatter.format(number).split(' ')[1];
  } catch (error) {
    cerror(
      'Formatear moneda',
      'Error al formatear el número a moneda: ',
      error,
    );
    return null;
  }
};

/**
 * Checks if a given input can be converted to a valid, finite number.
 *
 * @param {any} input - The value to check.
 * @return {boolean} True if the input can be converted to a valid, finite number, false otherwise.
 */
const isValidNumber = (input) => {
  // Convert the input to a number and check if it is finite
  return !Nimber.isNaN(input) && Nimber.isFinite(Number(input));
};

module.exports = {
  sumNumbers,
  roundToDecimal,
  getRandomNumber,
  calculatePercentage,
  formatNumberToCurrency,
  isValidNumber,
};
