const localhost = 'http://localhost:3000';
const heroku = 'https://blankmap-front-1626f242c2d7.herokuapp.com';
const firebase = 'https://blank-map-client.web.app/';
const url = localhost;

describe('Main Page Get Started', () => {
    it('successfully loads main page', () => {
        cy.visit(url); // Assuming your app is served at http://localhost:3000/
        cy.contains('Get Started').click();
        cy.url().should('include', '/register');
    });
});
describe('Login Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
    });
}
);
describe('Guest Login Test', () => {
    it('should successfully log in as guest', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Click the login button
        cy.contains('Guest Login').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
    });
}
);

describe('Already have an account', () => {
    it('should successfully goes to login page', () => {
        // Visit the login page
        cy.visit(url + '/register');

        // Click the login button
        cy.contains('Already have an Account?').click();

        // Verify that the login was successful
        cy.url().should('include', '/login');
    });
}
);

describe('Home Pages test', () => {
    it('Create in home should successfully redirect to create', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('button').contains('Create Map').click();
        cy.url().should('include', '/create');
    });

});

describe('Profile Pages test', () => {
    it('Create in home should successfully redirect to create', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('#accountCircle').click();
        cy.get('#userInfo').find('div:contains("Username:")').invoke('text').as('usernameValue').should('contain', 'test3');
        cy.get('#userInfo').find('div:contains("Member Since:")').invoke('text').as('membersinceValue').should('contain', '11/25/2023');
    });

});

describe('Choropleth Empty Map Creation Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('button').contains('Create Map').click();
        cy.url().should('include', '/create');
        cy.get('#mapName').type('Cypress Test Map');
        cy.get('#mapDescription').type('This is a test map created by Cypress');
        cy.get('#mapTags').type('Cypress');
        cy.get('button').contains('Add Tag').click();
        cy.get('button').contains('Start With Blank').click();
        cy.url().should('include', '/edit');
        cy.get('button').contains('Render as Choropleth Map').click();
    });
}
);

describe('Simple Region Empty Map Creation Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('button').contains('Create Map').click();
        cy.url().should('include', '/create');
        cy.get('#mapName').type('Cypress Test Map');
        cy.get('#mapDescription').type('This is a test map created by Cypress');
        cy.get('#mapTags').type('Cypress');
        cy.get('button').contains('Add Tag').click();
        cy.get('#selectedCategory').click();
        cy.contains('Regional Map').click();
        cy.get('button').contains('Start With Blank').click();
        cy.url().should('include', '/regional-edit');
        cy.get('button').contains('Render as Simple Region').click();
        cy.url().should('include', '/home');
    });
}
);

describe('Simple Region Map Upload Creation Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('button').contains('Create Map').click();
        cy.url().should('include', '/create');
        cy.get('#mapName').type('Cypress Test Map');
        cy.get('#mapDescription').type('This is a test map created by Cypress');
        cy.get('#mapTags').type('Cypress');
        cy.get('button').contains('Add Tag').click();
        cy.get('#selectedCategory').click();
        cy.contains('Regional Map').click();
        cy.get('button').contains('Load From Map').click();
        cy.get('input[type=file]').selectFile('./cypress/e2e/us-states.geojson',{
            action: "select",
            force: true,
          })
        cy.get('button').contains('Submit').click();
        cy.url().should('include', '/regional-edit');
        cy.get('button').contains('Render as Simple Region').click();
        cy.url().should('include', '/home');
    });
}
); 

describe('Home page search Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home');
        cy.get('input[placeholder="Search Maps"]').type('Cypress Test Map');
        cy.get('#searchButton').click();
        cy.get('div').contains('Cypress Test Map').click();
        cy.url().should('include', '/detail');
    });
})