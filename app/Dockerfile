

#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
#
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file.
#
# Which doesn't happen so often.
# Hopefully.
#

FROM node:13.10-alpine AS builder

ARG REACT_APP_HASURA_ENDPOINT
ENV REACT_APP_HASURA_ENDPOINT=$REACT_APP_HASURA_ENDPOINT

ARG REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN

ARG REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID

# NPM Install for building
WORKDIR /usr/src/app-build
ADD package.json /usr/src/app-build
ADD package-lock.json /usr/src/app-build
RUN npm install

# Copy source files:
WORKDIR /usr/src/app-build
ADD src /usr/src/app-build/src
ADD public /usr/src/app-build/public

# Build:
WORKDIR /usr/src/app-build
RUN npm run build


#
# Runner Image
# ==========================================
#
# In this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# The idea is to keep this image as small as possible.
#

FROM nginx:1.17.9 AS runner

# Copy project specific assets:
COPY --from=builder /usr/src/app-build/build /usr/share/nginx/html

# # Default environment configuration:
# EXPOSE 80
# ENV NODE_ENV=production

# WORKDIR /usr/src/app
# CMD node ssr/index.js
