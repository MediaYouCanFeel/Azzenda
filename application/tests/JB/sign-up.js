describe('angularjs sign-up', function() {
  
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var signUpButton = element(by.id('sign-up-button'));    
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/signup');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Azzenda');
    });
    
    it('should allow sign-up', function() {
        firstName.sendKeys('John');
        lastName.sendKeys('Barton');
        email.sendKeys('john@barton.com');
        password.sendKeys('password');
        
        signUpButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/users');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(1);
    });    
    
});
