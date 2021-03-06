###
### - postgres
### - adminer (on Apache)
### - Hasura engine
###

FROM hasura/graphql-engine:v1.1.1 as hasura
FROM marcopeg/gitpod-workspace-postgres:2.5.0


###
### HASURA
###

###
# Install Hasura Engine
COPY --from=hasura /bin/graphql-engine /bin/graphql-engine

# Creates the `hasura_start` command:
ENV PATH="$PATH:$HOME/.hasura/bin"
RUN mkdir -p ~/.hasura/bin \
    && printf "#!/bin/bash\n/bin/graphql-engine serve" > ~/.hasura/bin/hasura_start \
    && chmod +x ~/.hasura/bin/*

# Ensure the basic environment variables that are needed by Hasura to start
ENV HASURA_GRAPHQL_DATABASE_URL="postgres://localhost:5432/postgres"
ENV HASURA_GRAPHQL_ENABLE_CONSOLE="true"
ENV HASURA_GRAPHQL_ADMIN_SECRET="hasura"

# Add the default link to the backend ingest webhook
ENV HASURA_INGEST_WEBHOOK="http://localhost:8081/webhooks/hasura"

# Add the development version of the linkpreview api
ENV LINKPREVIEW_API_KEY="@dev"
