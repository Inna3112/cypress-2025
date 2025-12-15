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

it('lists and dropdowns', () => {
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

it('tooltips', () => {
  //tooltip - це невелике спливаюче вікно з підказкою, яке з'являється, коли користувач наводить курсор миші на певний елемент інтерфейсу.
  cy.contains('Modal & Overlays').click()
  cy.contains('Tooltip').click()

  //Тут ми використовуємо trigger('mouseenter') щоб симулювати наведення миші на кнопку 'Top'
  cy.contains('button', 'Top').trigger('mouseenter')
  cy.get('nb-tooltip').should('have.text', 'This is a tooltip')
})

it('dialog boxes', () => {
  cy.contains('Tables & Data').click()
  cy.contains('Smart Table').click()

  //1.
  cy.get('.nb-trash').first().click()
  //method 'on' дозволяє слухати різні події браузера.
  cy.on('window:confirm', confirm => {
    expect(confirm).to.equal('Are you sure you want to delete?')
  })

  //2.
  //цей підхід дає нам більше контролю над поведінкою вікна підтвердження - є надійнішим за перший.
  cy.window().then( win => {
    //ми замінили поведінку вікна підтвердження, щоб воно завжди повертало false, що означає відміну дії видалення.
    //ми знайшли у обєкті вікна метод confirm і створили його підробку за допомогою cy.stub().
    cy.stub(win, 'confirm').as('dialogBox').returns(false)
  })
  cy.get('.nb-trash').first().click()
  cy.get('@dialogBox').should('be.calledWith', 'Are you sure you want to delete?')
})

it.only('web tables', () => {
  cy.contains('Tables & Data').click()
  cy.contains('Smart Table').click()

  //1. How to find by text
  cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
    cy.wrap(tableRow).find('.nb-edit').click()
    cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35')
    cy.wrap(tableRow).find('.nb-checkmark').click()
    cy.wrap(tableRow).find('td').last().should('have.text', '35')
  })

  //2. How to find by index
  cy.get('.nb-plus').click()
  //отримуємо thead в ньому другий tr (індексація з 0)
  cy.get('thead tr').eq(2).then(tableRow => {
    cy.wrap(tableRow).find('[placeholder="First Name"]').type('John')
    cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Smith')
    cy.wrap(tableRow).find('.nb-checkmark').click()
  })

  cy.get('tbody tr').first().find('td').then( tableColumns => {
    cy.wrap(tableColumns).eq(2).should('have.text', 'John')
    cy.wrap(tableColumns).eq(3).should('have.text', 'Smith')
  })

  //3. Looping though the rows
  const ages = [20, 30, 40, 200]

  cy.wrap(ages).each(age => {
    cy.get('[placeholder="Age"]').clear().type(age)
    //затримка щоб таблиця встигла оновитися перед перевіркою
    //але це не найкраща практика, тому краще уникати її
    cy.wait(500)
    cy.get('tbody tr').each(tableRows => {
      if (age === 200) {
        cy.wrap(tableRows).should('contain.text', 'No data found')
      } else {
        cy.wrap(tableRows).find('td').last().should('have.text', age)
      }
    })
  })
})

it.only('datepickers', () => {
  cy.contains('Forms').click()
  cy.contains('Datepicker').click()

  // cy.get('[placeholder="Form Picker"]').then(input => {
  //   cy.wrap(input).click()
  //   cy.get('.day-cell').not('.bounding-month').contains('12').click()
  //   cy.wrap(input).should('have.value', 'Dec 12, 2023')
  // })

  function selectDateFromCurrentDay(day) {
    //new Date() - створює новий об'єкт дати з поточним днем
    let date = new Date()
    //додаємо до поточного дня потрібну кількість днів - мутуємо об'єкт date
    date.setDate(date.getDate() + day)
    let futureDay = date.getDate()
    //отримуємо назву місяця у довгому форматі (January, February, etc.)
    let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long' })
    let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short' })
    let futureYear = date.getFullYear()
    let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`

    //invoke('text') - викликає метод (мабуть цей метод jQuery) text() на знайденому елементі, щоб отримати його текстовий вміст
    cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {
      if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) {
        cy.get('[data-name="chevron-right"]').click()
        selectDateFromCurrentDay(day)
      } else {
        //обираємо день у календарі, виключаючи дні з інших місяців (bounding-month)
        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
      }
    })

    return dateToAssert
  }

  cy.get('[placeholder="Form Picker"]').then(input => {
    //cy.wrap – обгортає елемент у контекст Cypress, дозволяючи використовувати команди Cypress на цьому елементі
    //тому що input це jQuery елемент
    cy.wrap(input).click()
    const dateToAssert = selectDateFromCurrentDay(20)
    cy.wrap(input).should('have.value', dateToAssert)
  })
})
