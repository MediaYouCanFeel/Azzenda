exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['sign-in-JB.js','create-projects.js'],
  capabilities: {
    'browserName': 'firefox' // or 'safari'
  }
};