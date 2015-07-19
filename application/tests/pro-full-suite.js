exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {'browserName': 'chrome'},
  
  suites: {
	  users: ['sign-up.js','create-users.js'],
	  groups: ['init-groups.js']
  }
};