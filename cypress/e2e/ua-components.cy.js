/// <reference types="cypress" />

beforeEach('Open application', () => {
  cy.visit('/')
})

it('input fields', () => {
  cy.contains('Forms').click()
  cy.contains('Form Layouts').click()

  const name = 'Artem'
  cy.get('#inputEmail1').type('hello@test.com', {delay: 200}).clear().type('hello').clear()
  cy.contains('nb-card', 'Using the Grid').contains('Email').type(`${name}@test.com`)

  cy.get('#inputEmail1').should('not.have.value', '').clear().type('test@bondaracademy.com')
    .press(Cypress.Keyboard.Keys.TAB) // натискає Tab після введення тексту

  // cy.contains('Auth').click()
  // cy.contains('Login').click()

  // cy.get('#input-email').type('test@bondaracademy.com')
  // cy.get('#input-password').type('Welcome{enter}') // це еквівалентно натисканню кнопки Enter після введення тексту
})

it('radio buttons', () => {
  cy.contains('Forms').click()
  cy.contains('Form Layouts').click()

  cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( allRadioButtons => {
    //{force:true} - використовується коли елемент прихований або перекритий іншим елементом
    cy.wrap(allRadioButtons).eq(0).check({force:true}).should('be.checked')
    cy.wrap(allRadioButtons).eq(1).check({force:true})
    cy.wrap(allRadioButtons).eq(0).should('not.be.checked')
    cy.wrap(allRadioButtons).eq(2).should('be.disabled')
  })

  cy.contains('nb-card', 'Using the Grid').contains('label', 'Option 1').find('input').check({force:true})
})

it('checkboxes', () => {
  cy.contains('Modal & Overlays').click()
  cy.contains('Toastr').click()

  //.check() - змінює стейт чекбокса на "checked"
  //.uncheck() - змінює стейт чекбокса на "unchecked"
  cy.get('[type="checkbox"]').check({force: true})
  // cy.get('[type="checkbox"]').click({force: true, multiple: true})
  cy.get('[type="checkbox"]').should('be.checked')
})

it.only('lists and dropdowns', () => {
  cy.contains('Modal & Overlays').click()
  cy.contains('Toastr').click()

  //______testing native dropdown_______
  //👉 Cypress знайде <div>, в якому є текст Toast type: cy.contains('div', 'Toast type:'), далі .find('select') знайде дочірній елемент.
  //.select('info') далі вибираємо значення 'info' зі списку
  cy.contains('div', 'Toast type:').find('select').select('info').should('have.value', 'info')

  //______testing custom dropdown_______
  cy.contains('div', 'Position:').find('nb-select').click()
  cy.get('.option-list').contains('bottom-right').click()
  cy.contains('div', 'Position:').find('nb-select').should('have.text', 'bottom-right')

  //Вибір всіх опцій по черзі
  cy.contains('div', 'Position:').find('nb-select').then(dropdown => {
    cy.wrap(dropdown).click()
    cy.get('.option-list nb-option').each((option, index, list) => {
      cy.wrap(option).click()
      if(index < list.length-1)
        cy.wrap(dropdown).click()
    })
  })
})
