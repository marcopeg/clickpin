const gql = require('graphql-tag');
const { FEATURE_NAME } = require('./hooks');
const { linkpreview } = require('./lib/linkpreview');

const UPDATE_URL_MUTATION = gql`
  mutation updateUrlMutation(
    $url: String!
    $title: String!
    $description: String!
    $cover: String!
  ) {
    insert_urls(
      objects: {
        url: $url
        title: $title
        description: $description
        cover: $cover
        updated_at: "now()"
      }
      on_conflict: {
        constraint: urls_pkey
        update_columns: [title, description, cover, updated_at]
      }
    ) {
      affected_rows
    }
  }
`;

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$ON_HASURA_WEBHOOK',
    name: FEATURE_NAME,
    trace: __filename,
    handler: (_, { getConfig, getContext }) => ({
      match: request => request.body.trigger.name === 'on_create_url',
      handler: async (request, reply) => {
        const client = getContext('hasura.apollo.client');
        const apiKey = getConfig('linkpreview.api.key');
        let variables = null;
        let update = null;

        // Get linkpreview
        try {
          variables = await linkpreview(
            apiKey,
            request.body.event.data.new.url,
          );
        } catch (err) {
          console.error(err);
          reply.code(406).send(`Failed linkpreview: ${err.message}`);
        }

        // Update Hasura's table
        try {
          update = await client.mutate({
            mutation: UPDATE_URL_MUTATION,
            variables,
          });
        } catch (err) {
          console.error(err);
          reply.code(406).send(`Failed Hasura update: ${err.message}`);
        }

        reply.send(`affected_rows: ${update.data.insert_urls.affected_rows}`);
      },
    }),
  });
};
