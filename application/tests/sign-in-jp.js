describe('angularjs Jesse Pinkman sign in', function() {
  
    var email = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var signInButton = element(by.id('sign-in-button'));
    
    
    beforeEach(function() {
    	browser.waitForAngular();
    	browser.get('http://localhost:3333/auth/signout');
        browser.waitForAngular();
    	browser.get('http://localhost:3333/#!/signin');
    });
    
    it('should allow Jesse Pinkman to sign in', function() {
        email.sendKeys('capncook@heisenberg.com');
        password.sendKeys('password');
        
        signInButton.click();
       
        browser.waitForAngular();
        expect(browser.getTitle()).toEqual('Azzenda');
    });    
});

