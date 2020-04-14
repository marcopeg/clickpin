# Auth0 Setup

Once you create the Auth0 app as in [this tutorial](https://marcopeg.com/2019/how-to-integrate-hasura-with-auth0)
you need to setup the production credentials:

```bash
eval $(gp env -e REACT_APP_AUTH0_DOMAIN=xxx)
eval $(gp env -e REACT_APP_AUTH0_CLIENT_ID=xxx)
```

Then you should also setup Hasura in order to validate the JWT Token:

```bash
eval $(gp env -e HASURA_GRAPHQL_JWT_SECRET='xxx')
```
