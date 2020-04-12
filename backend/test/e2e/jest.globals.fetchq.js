const axios = require('axios');
const { pause } = require('./jest.globals.utils');
const env = require('./jest.env')();

const assertQueueIterations = async (
  queue,
  subject,
  iterations = 0,
  { interval = 1000 } = {},
) => {
  // eslint-disable-next-line no-constant-condition
  let attempts = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    let doBreak = false;
    try {
      const query = `
          SELECT * FROM fetchq_catalog.fetchq__${queue}__documents
          WHERE subject = '${subject}'
            AND iterations >= ${iterations}
        `;
      const r1 = await axios.post(`${env.TEST_SERVER_ROOT}/test/query`, {
        query,
      });
      if (r1.data.rowCount > 0) {
        doBreak = true;
      }
    } catch (err) {
      console.error('@assertQueueIterations', err.message);
      attempts++;
      await pause(1000);

      if (attempts >= 10) {
        console.error(
          '@assertQueueIterations',
          'Max retries reached. Stopping',
        );
        break;
      }
    }

    if (doBreak) break;

    // eslint-disable-next-line no-await-in-loop
    await pause(interval);
  }
};

const getQueueMaintenanceDelay = async queue =>
  (
    await axios.post(`${env.TEST_SERVER_ROOT}/test/query`, {
      query: `
            SELECT settings->>'delay' AS delay
            FROM fetchq_catalog.fetchq_sys_jobs
            WHERE queue = '${queue}'
              AND task = 'mnt';
        `,
    })
  ).data.rows[0].delay;

const setQueueMaintenanceDelay = (queue, delay = '1s') =>
  axios.post(`${env.TEST_SERVER_ROOT}/test/query`, {
    query: `
        UPDATE fetchq_catalog.fetchq_sys_jobs
        SET settings = jsonb_set(settings, '{delay}', '"${delay}"')
        WHERE queue = '${queue}'
          AND task = 'mnt';
      `,
  });

// FIXME: it still uses the Sequelize data format
// const assertQueueMetrics = async (
//   queue,
//   metric,
//   value,
//   { interval = 50 } = {},
// ) => {
//   // eslint-disable-next-line no-constant-condition
//   let attempts = 0;
//   while (true) {
//     // eslint-disable-next-line no-await-in-loop
//     let doBreak = false;
//     try {
//       const r1 = await axios.post(`${env.TEST_SERVER_ROOT}/test/query`, {
//         query: `select * from fetchq_metric_compute('${queue}')`,
//       });
//       if (r1.data[0][0][metric] >= value) {
//         doBreak = true;
//       }
//     } catch (err) {
//       console.error('@assertQueueMetrics', err.message);
//       attempts++;
//       await pause(1000);

//       if (attempts >= 10) {
//         console.error('@assertQueueMetrics', 'Max retries reached. Stopping');
//         break;
//       }
//     }

//     if (doBreak) break;

//     // eslint-disable-next-line no-await-in-loop
//     await pause(interval);
//   }
// };

module.exports = {
  assertQueueIterations,
  getQueueMaintenanceDelay,
  setQueueMaintenanceDelay,
};
