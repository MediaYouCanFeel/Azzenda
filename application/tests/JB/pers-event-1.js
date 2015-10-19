describe('angularjs pers-event-1', function() {
  
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
    var weekRec		 = element(by.id('weekRec'));
    var monRec		 = element(by.id('monLab'));
    var tueRec		 = element(by.id('tueLab'));
    var wedRec		 = element(by.id('wedLab'));
    var thuRec		 = element(by.id('thuLab'));
    var friRec		 = element(by.id('friLab'));
    var recEndDate	 = element(by.model('recEndDate'));

    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/events');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Azzenda');
    });
    
    it('should allow creation of a CIS4301 personal event', function() {
        persEvent.click();
    	eventName.sendKeys('CIS4301 (Databases)');
        eventHrDur.sendKeys('0');
        eventMinDur.sendKeys('50');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('8');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('3');
        eventTmMins.sendKeys('0');
        
        //sets AM
        var now = new Date();
        if (now.getHours() >= 12) {
        	toggMer.click();
        	toggMer.click();
        }
        
        weekRec.click();
        
        monRec.click();
        wedRec.click();
        friRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(4);
    });
    
    
    it('should allow creation of a CIS4930 personal event', function() {
        persEvent.click();
    	eventName.sendKeys('CIS4930 (Design Patterns)');
        eventHrDur.sendKeys('0');
        eventMinDur.sendKeys('50');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('1');
        eventTmHrs.sendKeys('2');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('5');
        eventTmMins.sendKeys('0');
        
        //sets PM
        var now = new Date();
        if (now.getHours() < 12) {
        	toggMer.click();
        	toggMer.click();
        }
        
        weekRec.click();
        
        monRec.click();
        wedRec.click();
        friRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(8);
    });
    
    it('should allow creation of a AEC4434 (I) personal event', function() {
        persEvent.click();
    	eventName.sendKeys('AEC4434 (Leadership in Groups/Teams)');
        eventHrDur.sendKeys('0');
        eventMinDur.sendKeys('50');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('3');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('0');
        eventTmMins.sendKeys('0');
        
        //sets PM
        var now = new Date();
        if (now.getHours() < 12) {
        	toggMer.click();
        	toggMer.click();
        }
        
        weekRec.click();
        
        monRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(10);
    });
    
    it('should allow creation of a AEC4434 (II) personal event', function() {
        persEvent.click();
    	eventName.sendKeys('AEC4434 (Leadership in Groups/Teams)');
        eventHrDur.sendKeys('1');
        eventMinDur.sendKeys('55');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('3');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('0');
        eventTmMins.sendKeys('0');
        
        //sets PM
        var now = new Date();
        if (now.getHours() < 12) {
        	toggMer.click();
        	toggMer.click();
        }
        
        weekRec.click();
        
        wedRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(11);
    });
    
    it('should allow creation of a CNT4007C (I) personal event', function() {
        persEvent.click();
    	eventName.sendKeys('CNT4007C (Computer Networking)');
        eventHrDur.sendKeys('0');
        eventMinDur.sendKeys('50');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('1');
        eventTmHrs.sendKeys('0');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('4');
        eventTmMins.sendKeys('0');
        
        //sets AM
        var now = new Date();
        if (now.getHours() >= 12) {
        	toggMer.click();
        }
        
        weekRec.click();
        
        tueRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(12);
    });
    
    it('should allow creation of a CNT4007C (II) personal event', function() {
        persEvent.click();
    	eventName.sendKeys('CNT4007C (Computer Networking)');
        eventHrDur.sendKeys('1');
        eventMinDur.sendKeys('55');
        eventDate.sendKeys('10/19/2015');
        eventTmHrs.sendKeys(protractor.Key.END);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys(protractor.Key.BACK_SPACE);
        eventTmHrs.sendKeys('1');
        eventTmHrs.sendKeys('0');
        eventTmMins.sendKeys(protractor.Key.END);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys(protractor.Key.BACK_SPACE);
        eventTmMins.sendKeys('4');
        eventTmMins.sendKeys('0');
        
        //sets AM
        var now = new Date();
        if (now.getHours() >= 12) {
        	toggMer.click();
        }
        
        weekRec.click();
        
        thuRec.click();
        
        recEndDate.sendKeys('12/9/2015');
        
        eventPersSub.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/events');
        browser.waitForAngular();
        browser.waitForAngular();
        expect(element.all(by.repeater('event in events')).count()).toEqual(13);
    });
    
    
    
});
