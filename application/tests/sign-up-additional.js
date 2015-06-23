describe('angularjs sign-up additional', function() {
  
    var toggledropdown = element(by.id('header-username'));
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.model('credentials.email'));
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var roles = element(by.model('credentials.roles'));
    var dropdownName = element(by.id('header-username'));
    var signUpButton = element(by.id('sign-up-button'));    
    
    beforeEach(function() {
        browser.get('http://localhost:3333/auth/signout');
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/signup');
        browser.waitForAngular();
    }); 
    
    it('should allow sign-up (Skyler)', function() {        
        firstName.sendKeys('Skyler');
        lastName.sendKeys('White');
        email.sendKeys('swhite@beneke.com');
        username.sendKeys('Skyler');
        password.sendKeys('password');
        roles.sendKeys('user');
        roles.sendKeys(protractor.Key.ENTER);
        
        signUpButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/users');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(2);
    });
    
    
    it('should allow sign-up (Jesse)', function() {        
        firstName.sendKeys('Jesse');
        lastName.sendKeys('Pinkman');
        email.sendKeys('capncook@heisenberg.com');
        username.sendKeys('Jesse');
        password.sendKeys('password');
        roles.sendKeys('user');
        roles.sendKeys(protractor.Key.ENTER);
        
        signUpButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/users');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(3);
    });
    
});
