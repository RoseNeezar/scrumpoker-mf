ARG NODE_VERSION="18.12.1"
ARG ALPINE_VERSION="3.17"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.6.3 
COPY . .
RUN turbo prune --scope=@scrumpoker-mf/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/out/full/ .
RUN yarn install

# Build the project and its dependencies
# FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS sourcer
# WORKDIR /app
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=@scrumpoker-mf/api --include-dependencies

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner
WORKDIR /app
COPY --from=installer /app .

CMD [ "node", "packages/api/dist/index.js" ]