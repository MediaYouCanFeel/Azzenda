exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['create-users.js', 'init-groups.js'] //['create-users.js','sign-up-additional.js']
};