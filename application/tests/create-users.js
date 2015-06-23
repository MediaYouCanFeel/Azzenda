describe('angularjs sign-up', function() {
  
    var firstName = element(by.model('credentials.firstName'));
    var lastName = element(by.model('credentials.lastName'));
    var email = element(by.model('credentials.email'));
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var signUpButton = element(by.id('sign-up-button'));
    
    beforeEach(function() {
        browser.get('http://localhost:3333/#!/signup');
    });
    
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Azzenda');
    });
    
    it('should allow sign-up', function() {
        firstName.sendKeys('Walter');
        lastName.sendKeys('White');
        email.sendKeys('heisenberg@graymatter.com');
        username.sendKeys('Heisenberg');
        password.sendKeys('password');
        
        signUpButton.click();
        browser.waitForAngular();
        browser.get('http://localhost:3333/#!/users');
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(1);
    });
    
});



/*
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});
*/
