/// <reference types="cypress" />

describe('Test Suite 1', () => {
  beforeEach('Open test application', () => {
    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();
  })

  it('Hello World 1', () => {
    //by Tag
    cy.get('input')

    //by Id
    cy.get('#inputEmail1')

    //by Class
    cy.get('.input-full-width')

    //by Attribute
    cy.get('[fullwidth]')

    //by Attribute with value
    cy.get('[placeholder="Email"]')

    //by entire class value
    cy.get('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //how to combine several attributes
    cy.get('[placeholder="Email"][fullwidth]')
    cy.get('input[placeholder="Email"]')

    //find by data-cy attribute
    cy.get('[data-cy="inputEmail1"]')
  });

  it('Cypress Locator Methods', () => {
    //Theory
    //get() - to find elements on the page globally
    //find() - to find only child elements

    //contains() - to find web elements by text (!!!find only first match!!!)
    //this method is case sensitive

    cy.contains('Sign In', {matchCase: false});
    cy.contains('[status="warning"]', 'Sign in');
    cy.contains('nb-card', 'Horizontal form').find('button')
    cy.contains('nb-card', 'Horizontal form').contains('Sign in')
    cy.contains('nb-card', 'Horizontal form').get('button')
  })

  it('Child Elements', () => {

    cy.contains('nb-card', 'Using the Grid').find('.row').find('button')

    cy.get('nb-card').find('nb-radio-group').contains('Option 1')// спосіб знайти один і той же елемент

    cy.get('nb-card nb-radio-group').contains('Option 1')// спосіб знайти один і той же елемент

    cy.get('nb-card > nb-card-body [placeholder="Jane Doe"]') // ">" означає що елемент є прямим нащадком
  })

  it('Parent Elements', () => {

    cy.get('#inputEmail1').parents('form').find('button')

    cy.contains('Using the Grid').parent().find('button')

    cy.get('#inputEmail1').parentsUntil('nb-card-body').find('button')
  })

  it('Cypress Chains', () => {
    // Під час чейнінгу кожен виклик повертає результат (наприклад cy.get('#inputEmail1') повертає знайдений елемент)
    cy.get('#inputEmail1')
      .parents('form')
      .find('button')
      .click()

    cy.get('#inputEmail1')
      .parents('form')
      .find('nb-radio')
      .first()
      .should('have.text', 'Option 1')
  })

  it.only('Reusing Locators', () => {

    //THIS WILL NOT WORK!!! DON"T DO LIKE THIS!!!
    //const inputEmail1 = cy.get('#inputEmail1')
    //inputEmail1.parents('form').find('button')
    //inputEmail1.parents('form').find('nb-radio')

    // 1. Cypress Alias
    cy.get('#inputEmail1').as('inputEmail1')
    cy.get('@inputEmail1').parents('form').find('button')
    cy.get('@inputEmail1').parents('form').find('nb-radio')

    // 2. Cypress then() method

    cy.get('#inputEmail1').then( inputEmail => {
      //InputEmail is a jQuery object тому треба його обернути в cy.wrap() щоб використовувати команди cypress
      cy.wrap(inputEmail).parents('form').find('button')
      cy.wrap(inputEmail).parents('form').find('nb-radio')
      cy.wrap('Hello').should('equal', 'Hello')
      cy.wrap(inputEmail).as('inputEmail2')
    })

    cy.get('@inputEmail2').click()

  })
});

