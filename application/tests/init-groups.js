describe('angularjs group creation', function() {
  
    var groupName = element(by.model('name'));
    var createButton = element(by.id('create-group-button'));    
    var newButton = element(by.id('new-group-button'));
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/groups');
    });
    
    it('should allow the creation of White Family Members', function() {
        newButton.click();
        groupName.sendKeys('White Family Members');
        createButton.click();
       
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/groups');
        browser.waitForAngular();
        expect(element.all(by.repeater('group in groups')).count()).toEqual(2);
    });
    
    it('should allow the creation of Meth Cooks', function() {
    	newButton.click();
        groupName.sendKeys('Meth Cooks');
        createButton.click();
       
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/groups');
        browser.waitForAngular();
        expect(element.all(by.repeater('group in groups')).count()).toEqual(3);
    });
    
    it('should allow the creation of Lawyers', function() {
    	newButton.click();
        groupName.sendKeys('Lawyers');
        createButton.click();
       
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/groups');
        browser.waitForAngular();
        expect(element.all(by.repeater('group in groups')).count()).toEqual(4);
    });
    
    it('should allow the creation of Men', function() {
    	newButton.click();
        groupName.sendKeys('Men');
        createButton.click();
       
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/groups');
        browser.waitForAngular();
        expect(element.all(by.repeater('group in groups')).count()).toEqual(5);
    });
    
    it('should allow the creation of Women', function() {
    	newButton.click();
        groupName.sendKeys('Women');
        createButton.click();
       
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/groups');
        browser.waitForAngular();
        expect(element.all(by.repeater('group in groups')).count()).toEqual(6);
    });
    
});

