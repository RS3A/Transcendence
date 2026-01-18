# FROM node:20-slim

# # Usuário não-root já existe na imagem oficial
# USER node

# WORKDIR /app

# # Copia apenas os arquivos de dependências primeiro (cache)
# COPY --chown=node:node package*.json .

# RUN npm install

# # Agora copia o restante do projeto
# COPY --chown=node:node . .

# EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host"]

FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host"]

ENTRYPOINT ["sh", "-c", "npm run dev -- --host & tail -f /dev/null"]

# docker build -t transcendence-node . && docker run -d -p 5173:5173 --name transcendence-dev transcendence-node