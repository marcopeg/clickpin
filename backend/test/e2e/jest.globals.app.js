const axios = require('axios');
const { pause } = require('./jest.globals.utils');
const env = require('./jest.env')();

const statusCheck = async (endpoint, test) => {
  try {
    const res = await axios.get(endpoint);
    return test(res);
  } catch (err) {
    return false;
  }
};

const isRunning = async prefix => {
  console.info(`[${prefix}] await for server's health check...`);
  console.info(`[${prefix}] ${env.TEST_STATUS_CHECK_URL}`);

  let isup = false;
  while (isup === false) {
    await pause(env.TEST_STATUS_CHECK_INTERVAL);
    isup = await statusCheck(
      env.TEST_STATUS_CHECK_URL,
      res => res.status === 200,
    );
  }

  console.info(`[${prefix}] server is up...`);
};

const getConfig = async path =>
  (await axios.get(`${env.TEST_SERVER_ROOT}/test/config?path=${path}`)).data;

const setConfig = async (path, value) =>
  (await axios.post(`${env.TEST_SERVER_ROOT}/test/config`, { path, value }))
    .data;

module.exports = {
  isRunning,
  getConfig,
  setConfig,
};
