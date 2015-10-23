describe('angularjs create projects', function() {
  
	var newUserButton = element(by.id('new-user-button'));
	
    var name = element(by.id('name'));
    var owners = element(by.id('owners'));
    var type = element(by.id('select2_search'));
    var typeArr = element(by.id('select2_dropdown_arrow'));
    var description = element(by.id('description'));   
    var newProjectButton = element(by.id('newProjButton'));
    var createButton = element(by.id('createProject'));
    var multArea = element(by.id('select2MultArea'));
    
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/projects');
        browser.waitForAngular();
        newProjectButton.click();
        browser.waitForAngular();
    }); 
    
    it('should allow creation (SP16)', function() {        
        name.sendKeys('SP16');
        owners.sendKeys('John');
        owners.sendKeys(protractor.Key.ENTER);
        typeArr.click();
        type.sendKeys('Web Series');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('We\'ll be writing a new web series for production during the Spring 2016 semester!');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(1);
    });
    
    it('should allow creation (Everyday Gator)', function() {        
        name.sendKeys('Everyday Gator');
        owners.sendKeys("Katie");
        typeArr.click();
        type.sendKeys('Variety Series');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('"Everyday Gator" is a variety show shot on the campus of the University of Florida!');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(2);
    });
    
    it('should allow creation (DISCONNECTED)', function() {        
        name.sendKeys('DISCONNECTED');
        owners.sendKeys('Emma');
        owners.sendKeys(protractor.Key.ENTER);
        typeArr.click();
        type.sendKeys('Web Series');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('Tangible\'s Fall 2015 flagship project, "DISCONNECTED" follows Mary Alice Dodson in her quest to create a sentient AI.');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);
    });
    
    it('should allow creation (Sketch Team)', function() {        
        name.sendKeys('Sketch Team');
        owners.sendKeys('Ben H');
        owners.sendKeys(protractor.Key.ENTER);
        typeArr.click();
        type.sendKeys('Miscellaneous');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('Short videos - sketches, music video parodies, and more!');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(4);
    });
    
    it('should allow creation (Commissioned)', function() {        
        name.sendKeys('Commissioned');
        owners.sendKeys('Christian');
        owners.sendKeys(protractor.Key.ENTER);
        typeArr.click();
        type.sendKeys('External');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('Projects for external clients, run through Media You Can Feel, LLC.');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(5);
    });
    
    it('should allow creation (all alO.N.E.)', function() {        
        name.sendKeys('all alO.N.E.');
        owners.sendKeys('Lawson');
        owners.sendKeys(protractor.Key.ENTER);
        typeArr.click();
        type.sendKeys('Podcast');
        type.sendKeys(protractor.Key.ENTER);
        description.sendKeys('Audio-only podcast. Exercise in character writing and voice acting.');
        
        createButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/projects');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(6);
    });
});
