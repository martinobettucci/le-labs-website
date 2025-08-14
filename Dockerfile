
# ===== DOCKERFILE =====
FROM node:22-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Inject localhost from host
# RUN echo "172.17.0.1 host.docker.internal" >> /etc/hosts

RUN apt update
RUN apt install curl gpg netcat-traditional -y
RUN curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | tee /usr/share/keyrings/stripe.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | tee -a /etc/apt/sources.list.d/stripe.list
RUN apt update
RUN apt install stripe -y

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
CMD ["npm", "run", "integration"]
