const pause = (delay = 0) => new Promise(r => setTimeout(r, delay));
const info = data => console.info(JSON.stringify(data, null, 2));

module.exports = {
  pause,
  info,
};
