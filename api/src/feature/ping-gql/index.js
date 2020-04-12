const pingOnGql = require('./gql');

module.exports = ({ registerAction }) => registerAction(pingOnGql);
