describe('Home Page', () => {

    beforeEach(() => {
        //mocking of http request
        cy.fixture('courses.json').as('coursesJSON')
        //initialize cypress server
        cy.server()
        cy.route('/api/courses', '@coursesJSON').as('courses')

        cy.visit('/')
    })

    it('should display a list of courses', () => {
        cy.contains('All Courses')

        //wait for the response
        cy.wait('@courses')

        cy.get('mat-card').should('have.length', 9)
    })

    //user interaction test
    it('should display the advanced courses', () => {
        cy.get('.mat-tab-label').should('have.length', 2)
        cy.get('.mat-tab-label').last().click()
        //cypress takes care of the synchronous aspect
        cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1)
        cy.get('.mat-tab-body-active .mat-card-title').first()
            .should('contain', 'Angular Security Course')
    })
})