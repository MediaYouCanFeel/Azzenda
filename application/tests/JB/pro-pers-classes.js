exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['sign-in-JB.js', 'pers-event-1.js'],
  capabilities: {
    'browserName': 'firefox' // or 'safari'
  }
};