# Usa una imagen oficial de Node.js
FROM node:latest

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala dependencias
RUN npm install --omit=dev

# Copia el resto del código
COPY . .

# Expone el puerto 8084
EXPOSE 8084

# Comando de inicio
CMD ["node", "index.mjs"]
