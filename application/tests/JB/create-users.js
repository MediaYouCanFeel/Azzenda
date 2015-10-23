describe('angularjs create users', function() {
  
	var newUserButton = element(by.id('new-user-button'));
	
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var createButton = element(by.id('create-user-button'));    
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/users');
        browser.waitForAngular();
        newUserButton.click();
        browser.waitForAngular();
    }); 
    
    it('should allow creation (Ben)', function() {        
        firstName.sendKeys('Ben');
        lastName.sendKeys('Heuser');
        email.sendKeys('ben@heuser.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(2);
    });
    
    it('should allow sign-up (Emma)', function() {        
        firstName.sendKeys('Emma');
        lastName.sendKeys('Green');
        email.sendKeys('emma@green.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(3);
    });
    
    it('should allow sign-up (Lawson)', function() {        
        firstName.sendKeys('Lawson');
        lastName.sendKeys('Nuland');
        email.sendKeys('lawson@nuland.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(4);
    });
    
    it('should allow sign-up (Christian)', function() {        
        firstName.sendKeys('Christian');
        lastName.sendKeys('Torres');
        email.sendKeys('christian@torres.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(5);
    });
    
    it('should allow sign-up (Katie)', function() {        
        firstName.sendKeys('Katie');
        lastName.sendKeys('Bonti');
        email.sendKeys('katie@bonti.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(6);
    });
});
