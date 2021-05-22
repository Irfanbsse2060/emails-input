// main function for initializing the component
function EmailsInput(elementId, options = {}) {

    this.data = []
    this.options = options

    // main container element
    this.rootElement = document.getElementById(elementId)
    this.rootElement.classList.add('email-input-container')


    //list of emails
    this.listNode = document.createElement('ul')
    this.listNode.classList.add('email-input-container__list')

    // email input
    this.emailInput = document.createElement('input')
    this.emailInput.classList.add('email-input-container__list__item__input')
    this.emailInput.placeholder = this.options.placeholder ? this.options.placeholder : 'Enter Email'
    this.emailInput.type = 'text'
    // input events
    this.emailInput.addEventListener('keyup', this, false)
    this.emailInput.addEventListener('focusout', this, false)
    this.emailInput.addEventListener('paste', this, false)

    // adding input element in the list
    this.inputItem = document.createElement('li').appendChild(this.emailInput)
    this.listNode.appendChild(this.inputItem)
    this.rootElement.appendChild(this.listNode)
}


// For checking whether email is valid or not
EmailsInput.prototype.validateEmail = function (email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/  // email regex
    return emailRegex.test(email)  // true or false
}

// For checking  whether email already exists in the list or not to avoid duplication.
EmailsInput.prototype.isEmailAlreadyExists = function (value) {
    // find in the existing list to verify whether it already exists or not.
    const emailFound = this.data.find(function (email) {
        return email.value === value
    })
    return emailFound ? true : false

}

// For adding new value in the list.
EmailsInput.prototype.add = function (value) {

    // to avoid duplicate entries
    if (this.isEmailAlreadyExists(value))
        return;

    const isValidEmail = this.validateEmail(value)
    this.data.push({value, isValidEmail}) // updating listing
    const className = isValidEmail ? 'email-input-container__list__item--valid' : 'email-input-container__list__item--invalid'

    // appending list with new email
    const emailItem = document.createElement('li')
    emailItem.classList.add('email-input-container__list__item')
    emailItem.classList.add(className)

    // email value span
    const emailValueNode = document.createElement('span')
    emailValueNode.innerText = value
    emailItem.appendChild(emailValueNode)

    // cross span for deleting if user wants
    const removeNode = document.createElement('span')
    removeNode.innerText = 'x'
    removeNode.classList.add('email-input-container__list__item__remove')
    removeNode.addEventListener('click', this, false)
    emailItem.appendChild(removeNode)

    // insert before the last children which is the input element.
    this.listNode.insertBefore(emailItem, this.inputItem)

}

// For getting count of the valid emails.
EmailsInput.prototype.getValidEmailsCount = function () {
    return this.data.filter(function (email) {
        return email.isValidEmail
    }).length
}

// for getting all the  emails.
EmailsInput.prototype.getAllEmails = function () {
    return this.data
}

// For updating all emails, it will remove current emails and put the emails which are passed in the function call.
EmailsInput.prototype.updateAllEmails = function (emails) {
    // removing all the children except last one as that is input element.
    while (this.listNode.childNodes.length > 1) {
        this.listNode.removeChild(this.listNode.firstChild);
    }

    //empty data list as well
    this.data = []

    // add new emails
    const self = this
    emails.forEach(function (email) {
        self.add(email)
    })
}

// ============================= EVENTS ===========================================

// implementing event interface
EmailsInput.prototype.handleEvent = function (event) {
    switch (event.type) {
        case "keyup":
            this.keyup(event, this)
            break
        case "focusout":
            this.focusOut(event, this)
            break
        case "click":
            this.remove(event, this)
        case "paste":
            this.onPaste(event, this)
    }
};

// when user types in the input element
EmailsInput.prototype.keyup = function (event, emailInput) {
    // 13 keyCode is for enter
    if (event.keyCode === 13 && event.target.value.trim().length > 0) {
        event.preventDefault()
        emailInput.add(event.target.value)
        event.target.value = ''

        if (typeof emailInput.options.onAdd === 'function') {
            emailInput.options.onAdd(event.target.value, emailInput.data)
        }

    }
}

// when focus out from input element
EmailsInput.prototype.focusOut = function (event, emailInput) {
    if (event.target.value.trim().length > 0) {
        event.preventDefault()
        emailInput.add(event.target.value)
        event.target.value = ''

        if (typeof emailInput.options.onAdd === 'function') {
            emailInput.options.onAdd(event.target.value, emailInput.data)
        }
    }

}

// when user clicks on the remove  icon
EmailsInput.prototype.remove = function (event, emailInput) {
    const emailToBeRemoved = event.target.parentElement.children[0].innerText
    emailInput.data = emailInput.data.filter(function (email) {
        return email.value !== emailToBeRemoved
    })
    event.target.parentElement.remove()

    if (typeof emailInput.options.onRemove === 'function') {
        emailInput.options.onRemove(emailToBeRemoved, emailInput.data)
    }


}

// when user pastes in the input element
EmailsInput.prototype.onPaste = function (event, emailInput) {
    // for deferring access of the value, otherwise you will get null
    setTimeout(function () {
        const inputValue = event.target.value
        if (inputValue && inputValue.trim().length > 0) {
            const emailLists = inputValue.split(',')  // splitting using , as a separator to cover multiple email pasted scenario

            emailLists.forEach(function (email) {
                emailInput.add(email)
            })

            event.target.value = null

        }
    }, 0)
}
