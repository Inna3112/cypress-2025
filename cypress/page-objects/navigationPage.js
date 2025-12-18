function selectGroupMenuItem(groupItemName){
  //визначаємо чи розгорнутий пункт меню по атрибуту aria-expanded
  cy.contains('a', groupItemName).invoke('attr', 'aria-expanded').then( attr => {
   //клікаємо по пункту меню лише якщо він не розгорнутий
    if(attr.includes('false')){
      cy.contains('a', groupItemName).click()
    }
  })
}


class NavigationPage {
  formLayoutsPage() {
    selectGroupMenuItem('Forms')
    cy.contains('Form Layouts').click()
  }

  datePickerPage() {
    selectGroupMenuItem('Forms')
    cy.contains('Datepicker').click()
  }

  toastrPage() {
    selectGroupMenuItem('Modal & Overlays')
    cy.contains('Toastr').click()
  }

  tooltipPage() {
    selectGroupMenuItem('Modal & Overlays')
    cy.contains('Tooltip').click()
  }

}

export const navigateTo = new NavigationPage()
