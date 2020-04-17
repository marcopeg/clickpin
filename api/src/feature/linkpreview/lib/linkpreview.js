const { linkpreviewDev } = require('./linkpreview-dev');
const { linkpreviewProd } = require('./linkpreview-prod');

const linkpreview = (apiKey, targetUrl) =>
  apiKey === '@dev'
    ? linkpreviewDev(apiKey, targetUrl)
    : linkpreviewProd(apiKey, targetUrl);

module.exports = { linkpreview };
