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
    
    it('should allow creation (Skyler)', function() {        
        firstName.sendKeys('Skyler');
        lastName.sendKeys('White');
        email.sendKeys('swhite@beneke.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(2);
    });
    
    
    it('should allow sign-up (Jesse)', function() {        
        firstName.sendKeys('Jesse');
        lastName.sendKeys('Pinkman');
        email.sendKeys('capncook@heisenberg.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(3);
    });
    
    it('should allow sign-up (Hank)', function() {        
        firstName.sendKeys('Hank');
        lastName.sendKeys('Schrader');
        email.sendKeys('asacschrader@abqdea.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(4);
    });
    
    it('should allow sign-up (Marie)', function() {        
        firstName.sendKeys('Marie');
        lastName.sendKeys('Schrader');
        email.sendKeys('purple@ilovepurple.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(5);
    });
    
    it('should allow sign-up (Walter White Jr.)', function() {        
        firstName.sendKeys('Walter');
        lastName.sendKeys('White');
        email.sendKeys('flynn@savewalterwhite.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(6);
    });
    
    it('should allow sign-up (Saul)', function() {        
        firstName.sendKeys('Saul');
        lastName.sendKeys('Goodman');
        email.sendKeys('jmcgill@hhm.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(7);
    });
    
    it('should allow sign-up (Mike)', function() {        
        firstName.sendKeys('Mike');
        lastName.sendKeys('Ehrmantraut');
        email.sendKeys('ilovekaylee@imaboss.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(8);
    });
    
    it('should allow sign-up (Lydia)', function() {        
        firstName.sendKeys('Lydia');
        lastName.sendKeys('Rodarte-Quayle');
        email.sendKeys('lrodar@madrigal.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(9);
    });
    
    it('should allow sign-up (Todd)', function() {        
        firstName.sendKeys('Todd');
        lastName.sendKeys('Alquist');
        email.sendKeys('todd@vamonospest.com');
        password.sendKeys('password');
        
        createButton.click();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(10);
    });
});
