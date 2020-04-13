# Service Hasura

Sets up the `hasura-sdk` client and checks that a functioning connection can
be established.

It provides an `$HASURA_IS_READY` hook with `{ hasura }` that lets play with
the running instance at boot time. (Used for migrations)
