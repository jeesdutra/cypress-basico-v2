Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Jéssica')
    cy.get('#lastName').type('Dutra') 
    cy.get('#email').type('jessypdo@gmail.com')
    cy.get('#open-text-area').type('Teste teste teste!')
    cy.contains('button', "Enviar").click()

})