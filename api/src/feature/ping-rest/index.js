const pingOnRest = require('./rest');
module.exports = ({ registerAction }) => registerAction(pingOnRest);
