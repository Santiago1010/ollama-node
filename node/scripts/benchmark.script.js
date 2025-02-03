const benchmark = (label, fn) => {
  const start = performance.now();
  let count = 0;
  const endTime = start + 1000; // 1 segundo
  while (performance.now() < endTime) {
    fn();
    count++;
  }
  const duration = performance.now() - start;
  console.log(`${label}: ${count} operaciones en ${duration.toFixed(2)} ms`);
};

const stringComparison = () => {
  const variable = 'hola';
  const variableString = 'hola';
  for (let i = 0; i < 10000; i++) {
    variable === 'hola';
    variable === variableString;
  }
};

const numberComparison = () => {
  const variable = 1;
  const variableInt = 1;
  for (let i = 0; i < 10000; i++) {
    variable === 1;
    variable === variableInt;
  }
};

const array = new Array(10000).fill(0);

const forLoop = () => {
  for (let i = 0; i < array.length; i++) {
    array[i] += 1;
  }
};

const whileLoop = () => {
  let i = 0;
  while (i < array.length) {
    array[i] += 1;
    i++;
  }
};

const forEachLoop = () => {
  array.forEach((_, i) => {
    array[i] += 1;
  });
};

const mapLoop = () => {
  array.map((x) => x + 1);
};

const templateLiterals = () => {
  const name = 'Mundo';
  for (let i = 0; i < 10000; i++) {
    `¡Hola, ${name}!`;
  }
};

const stringConcatenation = () => {
  const name = 'Mundo';
  for (let i = 0; i < 10000; i++) {
    '¡Hola, ' + name + '!';
  }
};

const arrayLookup = () => {
  const arr = Array.from({ length: 10000 }, (_, i) => i);
  for (let i = 0; i < 10000; i++) {
    arr.includes(i);
  }
};

const setLookup = () => {
  const set = new Set(Array.from({ length: 10000 }, (_, i) => i));
  for (let i = 0; i < 10000; i++) {
    set.has(i);
  }
};

console.log('Ejecutando benchmark durante 1 segundo...');
benchmark('Comparación de strings', stringComparison);
benchmark('Comparación de números', numberComparison);
benchmark('Ciclo for', forLoop);
benchmark('Ciclo while', whileLoop);
benchmark('Ciclo forEach', forEachLoop);
benchmark('Ciclo map', mapLoop);
benchmark('Template Literals', templateLiterals);
benchmark('Concatenación de Strings', stringConcatenation);
benchmark('Búsqueda en Array', arrayLookup);
benchmark('Búsqueda en Set', setLookup);
