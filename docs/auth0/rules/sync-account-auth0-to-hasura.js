/**
 * Synchronizes the user's account details to Hasura and
 * enriches the accessToken for Hasura authenticated queries.
 * @param {*} user 
 * @param {*} context 
 * @param {*} callback 
 */

// eslint-disable-next-line
function (user, context, callback) {  
  const query = `
    mutation($userId: String!, $email: String) {
      insert_accounts(
        objects: [{
            auth0_id: $userId
            email: $email
						updated_at: "now()"
        }],
        on_conflict: {
            constraint: accounts_auth0_id_key,
            update_columns: [updated_at]
        }
      ) {
        affected_rows
        returning { id }
      }
    }
  `;

  const variables = {
    userId: user.user_id,
    email: user.email,
  };

  const payload = {
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": configuration.HASURA_ADMIN_SECRET
    },
    url: `${configuration.HASURA_BASE_URL}/v1/graphql`,
    body: JSON.stringify({ query, variables }),
  };

  request.post(payload, (error, response, body) => {
    // Eager return in case of errors
  	if (error) return callback(error, user, context);

    // Try to grab the user's id from the response
    let userId = null;
    try {
      const data = JSON.parse(body);
			const users = data.data.insert_accounts.returning;
      if (!users.length) throw new Error('Missing user');
      userId = users[0].id;
    } catch (err) {
      return callback(err, user, context);
    }
    
    // Decorate the access token for JWT authenticated requests
    try {
      context.accessToken['https://hasura.io/jwt/claims'] = {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": String(userId),
        // "x-auth0-user-id": user.user_id,
      };

      // console.log(context.accessToken);
      callback(null, user, context);
    } catch (err) {
      callback(err, user, context);
    }
  });
}
