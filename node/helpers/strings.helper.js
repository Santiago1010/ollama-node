export const countOccurrences = (str, subStr) => {
  return str.split(subStr).length - 1;
};

export const formatCapitalize = (str) => {
  const string = str.trim();
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatNames = (name) => {
  let fomat = name.replace(/Null/g, '');
  fomat = fomat.replace(/Undefined/g, '');
  fomat = fomat.replace(/null/g, '');
  fomat = fomat.replace(/undefined/g, '');

  fomat = fomat.replace(/ {2,}/g, ' ');
  fomat = formatCapitalize(fomat);

  return fomat;
};

export const n = (count = 1) => {
  let n = '';

  for (let i = 1; i <= count; i++) {
    n += '\n';
  }

  return n;
};

export const stringToArray = (
  str,
  separator,
  { numberElements = false, uniqueElements = false } = {},
) => {
  let array = null;
  const isArray = Array.isArray(str);

  if (isArray) array = str;

  if (!isArray) array = str.split(separator);

  if (numberElements === true) {
    const newArray = [];

    for (const element of array) {
      const parsed = Number(element);
      newArray.push(Number.isNaN(parsed) ? element : parsed);
    }

    array = newArray;
  }

  if (uniqueElements === true) array = [...new Set(array)];

  return array;
};

export const arrayToString = (array, endString) => {
  let string = '';
  const limit = Number.parseInt(array.length) - 1;

  for (let i = 0; i < array.length; i++) {
    if (i === 0) string += array[i];

    if (i > 0 && i < limit) string += ', ' + array[i];

    if (i === limit) string += ' ' + endString + ' ' + array[i];
  }

  return string;
};

export const t = (count = 1) => {
  let t = '';

  for (let i = 1; i <= count; i++) {
    t += '\t';
  }

  return t;
};

export const toCamelCase = (string) => {
  let camel = string.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ_-]/g, '');
  camel = camel.replace(/[-_]/g, ' ');
  camel = camel.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let formattedString = '';
  const stringsArray = camel.split(' ');

  for (let i = 0; i < stringsArray.length; i++) {
    formattedString +=
      i === 0
        ? stringsArray[0].toLowerCase()
        : formatCapitalize(stringsArray[i]);
  }

  return formattedString;
};

export const toKebabCase = (string) => {
  const kebab = toSnakeCase(string);

  return kebab.replace(/_/g, '-');
};

export const toPascalCase = (string) => {
  const pascal = toCamelCase(string);

  return pascal.charAt(0).toUpperCase() + pascal.slice(1);
};

export const toScreamingSnakeCase = (string) => {
  return toSnakeCase(string).toUpperCase();
};

export const toSnakeCase = (string) => {
  let snake = string.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, '');

  snake = snake.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ_-]/g, '');
  snake = snake.replace(/[-_]/g, '_');
  snake = snake.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  snake = snake.replace(/\s/g, '_');

  return snake.toLowerCase();
};

export const formatApiName = (index) => {
  if (index < 0 || index >= apis.length) return 'Índice fuera de rango';

  // Obtener el nombre de la API
  const apiName = apis[index];

  // Separar las palabras usando expresiones regulares y capitalizar la primera letra
  const formattedName = apiName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

  return formattedName.trim();
};

/**
 * Función para validar si el correo electrónico de entrada está en un formato correcto y coincide con el dominio y TLD personalizados.
 *
 * @param {string} email - El correo electrónico a validar.
 * @param {Object} options - Un objeto que contiene el dominio personalizado y el TLD personalizado para la validación.
 * @param {Set|Array} options.customDomain - Dominio(s) personalizado(s) con el que comparar.
 * @param {Set|Array} options.customTLD - TLD(s) personalizado(s) con el que comparar.
 * @returns {boolean} `True` si el correo electrónico es válido, `false` en caso contrario.
 */
export const isEmail = (email, { customDomain, customTLD } = {}) => {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let domainRegexPart = '';
  let tldRegexPart = '';

  if (customDomain) {
    const domains = Array.isArray(customDomain) ? customDomain : [customDomain];

    // Construir parte del regex para incluir los dominios personalizados
    for (let i = 0; i < domains.length; i++) {
      if (i > 0) domainRegexPart += '|';

      domainRegexPart += domains[i].replace('.', '\\.');
    }

    emailRegex = new RegExp(`^[^\\s@]+@(${domainRegexPart})\\.[^\\s@]+$`);
  }

  if (customTLD) {
    const tlds = Array.isArray(customTLD) ? customTLD : [customTLD];

    // Construir parte del regex para incluir los TLD personalizados
    for (let i = 0; i < tlds.length; i++) {
      if (i > 0) tldRegexPart += '|';

      tldRegexPart += tlds[i].replace('.', '\\.');
    }

    if (domainRegexPart !== '') {
      // Agregar la validación del TLD al regex existente
      emailRegex = new RegExp(
        `^[^\\s@]+@(${domainRegexPart})\\.(${tldRegexPart})$`,
      );
    } else {
      // Si no hay dominio personalizado definido, solo validamos el TLD
      emailRegex = new RegExp(`^[^\\s@]+@[^\\s@]+\\.(${tldRegexPart})$`);
    }
  }

  // Ahora procedemos con la validación del correo electrónico
  const partsEmail = email.split('@');
  if (partsEmail.length !== 2) return false;

  return emailRegex.test(email);
};

export const extractJSON = (texto) => {
  const resultados = [];
  const regex =
    /{(?:[^{}]*|"(?:\\.|[^"\\])*"|{(?:[^{}]*|"(?:\\.|[^"\\])*")*})*}/g;
  const coincidencia = regex.exec(texto);

  while (coincidencia !== null) {
    try {
      resultados.push(JSON.parse(coincidencia[0]));
    } catch (error) {
      // Ignorar fragmentos no válidos
    }
  }

  return resultados;
};
