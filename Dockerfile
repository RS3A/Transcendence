FROM node:20-slim

# Usuário não-root já existe na imagem oficial
USER node

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache)
COPY --chown=node:node transcendence/package*.json ./

RUN npm install

# Agora copia o restante do projeto
COPY --chown=node:node transcendence/ .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# docker build -t transcendence-node . && docker run -p 5173:5173 --name transcendence-dev transcendence-node