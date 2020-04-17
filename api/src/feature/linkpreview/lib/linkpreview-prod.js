const axios = require('axios');

const linkpreviewProd = async (key, q) => {
  const res = await axios.post('https://api.linkpreview.net', {
    key,
    q,
  });

  // rename "image > cover"
  // keep requested url
  return {
    title: res.data.title,
    description: res.data.description,
    cover: res.data.image,
    url: q,
  };
};

module.exports = { linkpreviewProd };
