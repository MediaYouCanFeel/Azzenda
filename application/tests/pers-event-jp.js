describe('angularjs pers-event-jp', function() {
  
	var moment = require('moment');
	
	var persEvent    = element(by.id('createPersEvent'));
    var eventName    = element(by.model('name'));
    var eventHrDur   = element(by.model('hourDurationFromModal'));
    var eventMinDur  = element(by.model('minDurationFromModal'));
    var eventDate 	 = element(by.model('dateFromModal'));
    var eventTmHrs	 = element(by.model('hours'));
    var eventTmMins	 = element(by.model('minutes'));
    var eventTime	 = element(by.model('timeFromModal'));
    var toggMerPar	 = element(by.id('toggMer'));
    var toggMer		 = toggMerPar.element(by.css('.btn'));
    var eventPersSub = element(by.id('persEventSubmit'));
    
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/events');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Azzenda');
    });
    
    it('should allow creation of a personal event', function() {
        persEvent.click();
    	eventName.sendKeys('Hanging with Badger');
        eventHrDur.sendKeys('3');
        eventMinDur.sendKeys('00');
        eventDate.sendKeys('10/10/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('9');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('00');
        
        var now = new Date();
        if (now.getHours() >= 12) {
        	toggMer.click();
        }
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in futureEvents')).count()).toEqual(1);
    });
    
    
});
