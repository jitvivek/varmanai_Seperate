FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

COPY prisma ./prisma
RUN pnpm exec prisma generate

COPY dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
