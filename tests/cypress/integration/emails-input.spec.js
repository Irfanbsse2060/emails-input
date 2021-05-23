/// <reference types="cypress" />

context('Email Input', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000')
    })

    it('should be able to load the component properly', () => {
        cy.get('#bt-add-email')
            .should('be.visible')

        cy.get('.email-input-container')
            .should('be.visible')

        cy.get('.email-input-container__list')
            .should('be.visible')

        cy.get('.email-input-container__list__item__input')
            .should('be.visible')
    })

    it('should be able to add random email using add function of the component', () => {

        cy.get('.email-input-container__list__item')
            .should(($items) => {
                expect($items).to.have.length(0)
            })

        cy.get('#bt-add-email').click()

        cy.get('.email-input-container__list__item')
            .should(($items) => {
                expect($items).to.have.length(1)
            })
    })

    it('should be able to add valid email by typing in the input field and pressing enter', () => {

        const email = 'fake@email.com'

        cy.get('.email-input-container__list__item__input')
            .type(`${email}{enter}`)

        cy.get('.email-input-container__list__item')
            .should(($items) => {
                expect($items[0].children[0].innerText).to.eq(email)
            })
    })


  it('should be able to add invalid email by typing in the input field and pressing enter', () => {

    const invalidEmail = 'invalid'

    cy.get('.email-input-container__list__item__input')
        .type(`${invalidEmail}{enter}`)

    cy.get('.email-input-container__list__item--valid')
        .should(($items) => {
          expect($items).to.have.length(0)
        })

    cy.get('.email-input-container__list__item--invalid')
        .should(($items) => {
          expect($items[0].children[0].innerText).to.eq(invalidEmail)
        })
  })


  it('should be able to get the valid emails count by calling emails input method', () => {

    const stub = cy.stub()
    cy.on ('window:alert', stub)

    const validEmail = 'valid@email.com'
    const invalidEmail = 'invalid'

    cy.get('.email-input-container__list__item__input')
        .type(`${validEmail}{enter}`)

    cy.get('.email-input-container__list__item__input')
        .type(`${invalidEmail}{enter}`)

    cy.get('#bt-emails-count')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Total number of valid emails  =  1')
        })
  })


  it('should be able to add comma separated multiple emails', () => {
    const textToPaste = 'john@demo.com,smith@gmail.com'
    const expectedEmails = textToPaste.split(',')

    cy.get('.email-input-container__list__item__input')
        .invoke('val', textToPaste)
        .trigger('paste')

    cy.get('.email-input-container__list__item--valid')
        .should(($items) => {
          expect($items).to.have.length(2)
          $items.each( function( index, emailItem ){
            expect(emailItem.children[0].innerText).to.eq(expectedEmails[index])
          });
        })
  })


  it('should be able to remove the particular email by click on cross icon', () => {
    const textToPaste = 'john@demo.com,smith@gmail.com'
    const expectedEmails = textToPaste.split(',')

    cy.get('.email-input-container__list__item__input')
        .invoke('val', textToPaste)
        .trigger('paste')

    cy.get('.email-input-container__list__item--valid')
        .should(($items) => {
          expect($items).to.have.length(2)
        })

    cy.get('.email-input-container__list__item__remove')
        .should(($items) => {
          expect($items).to.have.length(2)
          $items[0].click()
        })

    cy.get('.email-input-container__list__item')
        .should(($items) => {
          expect($items).to.have.length(1)
        })
  })





})
