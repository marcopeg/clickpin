# ClickPIN - Environment

You need to define the following environment variables:

```bash
NODE_ENV=development

# Create this here:
# https://hasura.io/jwt-config/
#
# Or follow this tutorial:
# https://marcopeg.com/2019/how-to-integrate-hasura-with-auth0
HASURA_GRAPHQL_JWT_SECRET

# Retrieve those from Auth0
REACT_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
```

Here is a decent guide how to do it from within a running workspace:
https://www.gitpod.io/docs/environment-variables/

Just remember to reload the environment in every running terminal and restart the processes.
