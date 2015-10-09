exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['pers-event-suite.js'],
  capabilities: {
    'browserName': 'firefox' // or 'safari'
  }
};