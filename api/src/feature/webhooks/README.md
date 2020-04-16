# Webhooks

It integrates into the webhooks service and adds some app
specific webhoos.

## /webhooks/hasura

It receives any trigger from hasura and offers the possibility
for other features to integreate into it with a `match/handler`
mechanism.

## /webhooks/fq-ingest

[[ TO BE DONE ]]

Should append any request body into an ingest queue for further
processing.
