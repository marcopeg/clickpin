const globals = require('./jest.globals')();
module.exports = () => globals.app.isRunning('jest');
