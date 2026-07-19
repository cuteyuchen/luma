FROM node:22-bookworm-slim AS build

WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/lumal-mock-api ./apps/lumal-mock-api

RUN pnpm install --frozen-lockfile
RUN pnpm --filter lumal-mock-api build

FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5320

COPY --from=build /workspace/apps/lumal-mock-api/.output ./.output

EXPOSE 5320
CMD ["node", ".output/server/index.mjs"]
