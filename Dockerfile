FROM node:14

WORKDIR /app

# Nettoyer le cache npm
RUN npm cache clean --force

COPY package*.json ./

# Mettre à jour npm
RUN npm install -g npm

# Installer les dépendances
RUN npm install

# Installer nodemon et ts-node globalement
RUN npm install -g nodemon ts-node

# Copier le reste des fichiers de l'application
COPY . .

# Reconstruire bcrypt
RUN npm rebuild bcrypt --build-from-source

# Exposer le port 3000
EXPOSE 3000

# Attendre que MySQL soit prêt avant de démarrer l'application
CMD ["sh", "-c", "npm install wait-port && wait-port mysql-db:3306 -- nodemon -e ts --exec ts-node src/index.ts"]
