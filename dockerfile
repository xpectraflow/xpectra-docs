# Lowercase filename to match xpectra-web's convention — the CI workflows
# reference `file: ./xpectra-docs/dockerfile` literally, and Linux runners are
# case-sensitive.

# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 2. Build the app
#
# `.source` (the compiled content index) is generated here by createMDX during
# `next build` — NOT by a postinstall hook. A postinstall would run in the deps
# stage above, where source.config.ts and content/ do not exist yet.
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Run the app
#
# Only what a docs site needs. The console's runner also copies drizzle/, data/
# and scripts/; none of that exists here because this app has no database and no
# migrations.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
