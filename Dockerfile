
# ===== DOCKERFILE =====
FROM node:22-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Inject localhost from host
# RUN echo "172.17.0.1 host.docker.internal" >> /etc/hosts

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port 3000
EXPOSE 5173

# Variables d'environnement pour Vite
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000



# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
