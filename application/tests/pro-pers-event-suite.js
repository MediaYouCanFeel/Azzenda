exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['sign-in-ww.js','pers-event-1.js', 
          'sign-in-jp.js', 'pers-event-jp.js',
          'sign-in-sg.js', 'pers-event-sg.js'],
  capabilities: {
    'browserName': 'firefox' // or 'safari'
  }
};
