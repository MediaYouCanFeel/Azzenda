describe('angularjs pers-event-1', function() {
  
	var persEvent    = element(by.id('createPersEvent'));
    var eventName    = element(by.model('name'));
    var eventHrDur   = element(by.model('hourDurationFromModal'));
    var eventMinDur  = element(by.model('minDurationFromModal'));
    var eventDate 	 = element(by.model('dateFromModal'));
    var eventTmHrs	 = element(by.model('hours'));
    var eventTmMins	 = element(by.model('minutes'));
    var eventTime	 = element(by.model('timeFromModal'));
    var eventPersSub = element(by.id('persEventSubmit'));
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/events');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Azzenda');
    });
    
    it('should allow creation of a personal event', function() {
        persEvent.click();
    	eventName.sendKeys('Walter\'s Lecture');
        eventHrDur.sendKeys('2');
        eventMinDur.sendKeys('30');
        eventDate.sendKeys('10/10/2015');
        eventTmHrs.sendKeys(protractor.Key.DELETE);
        eventTmHrs.sendKeys(protractor.Key.DELETE);
        eventTmHrs.sendKeys('8');
        eventTmMins.sendKeys(protractor.Key.DELETE);
        eventTmMins.sendKeys(protractor.Key.DELETE);
        eventTmMins.sendKeys('00');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(1);
    });
    
    
});
