# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.17.0
ARG PNPM_VERSION=10.13.1

################################################################################
# Base stage with pnpm and Alpine dependencies
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

# Critical Alpine packages for Next.js
RUN apk add --no-cache libc6-compat tini

# Install pnpm with caching
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Install ALL dependencies (we'll separate later)
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

################################################################################
# Build stage
FROM base as build

# Copy deps from previous stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy source code
COPY . .

# Build with telemetry disabled and memory limits
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

################################################################################
# Final runtime stage
FROM base as final

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user with proper shell
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --shell /bin/sh nextjs

# Install Sharp for image optimization
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm add sharp

# Copy standalone server and static assets
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /usr/src/app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]