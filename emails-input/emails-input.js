function EmailsInput(elementId, options = {}) {

    this.data = []
    this.options = options

    this.rootElement = document.getElementById(elementId) // main container element
    this.rootElement.classList.add('email-input-container')


    this.listNode = document.createElement('ul')
    this.listNode.classList.add('email-input-container__list')

    this.emailInput = document.createElement('input')
    this.emailInput.classList.add('email-input-container__list__item__input')
    this.emailInput.placeholder = this.options.placeholder ? this.options.placeholder : 'Enter Email'
    this.emailInput.type = 'text'
    this.emailInput.addEventListener('keyup', this, false)
    this.emailInput.addEventListener('focusout', this, false)
    this.emailInput.addEventListener('paste', this, false)

    this.inputItem = document.createElement('li').appendChild(this.emailInput)
    this.listNode.appendChild(this.inputItem)
    this.rootElement.appendChild(this.listNode)
}


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


EmailsInput.prototype.validateEmail = function (email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return emailRegex.test(email)
}


EmailsInput.prototype.keyup = function (event, emailInput) {
    // 13 keyCode is for enter
    if (event.keyCode === 13) {
        event.preventDefault()
        emailInput.add(event.target.value)
        event.target.value = ''

        if (typeof emailInput.options.onAdd === 'function') {
            emailInput.options.onAdd(event.target.value, emailInput.data)
        }

    }
}

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

EmailsInput.prototype.onPaste = function (event, emailInput) {
    // for deferring access of the value, otherwise you will get null
    setTimeout(function () {
        const inputValue = event.target.value
        const emailLists = inputValue.split(',')  // splitting using , as a separator to cover multiple email pasted scenario

        emailLists.forEach(function (email) {
            emailInput.add(email)
        })

        event.target.value = null
    }, 0)
}

EmailsInput.prototype.isEmailAlreadyExists = function (value) {
    const emailFound = this.data.find(function (email) {
        return email.value === value
    })
    return emailFound ? true : false

}

EmailsInput.prototype.add = function (value) {

    // to avoid duplicate entries
    if (this.isEmailAlreadyExists(value))
        return;

    const isValidEmail = this.validateEmail(value)
    this.data.push({value, isValidEmail})
    const className = isValidEmail ? 'email-input-container__list__item--valid' : 'email-input-container__list__item--invalid'


    const emailItem = document.createElement('li')
    emailItem.classList.add('email-input-container__list__item')
    emailItem.classList.add(className)

    const emailValueNode = document.createElement('span')
    emailValueNode.innerText = value
    emailItem.appendChild(emailValueNode)

    const removeNode = document.createElement('span')
    removeNode.innerText = 'x'
    removeNode.classList.add('email-input-container__list__item__remove')
    removeNode.addEventListener('click', this, false)

    emailItem.appendChild(removeNode)

    this.listNode.insertBefore(emailItem, this.inputItem)

}

EmailsInput.prototype.getValidEmailsCount = function () {
    return this.data.filter(function (email) {
        return email.isValidEmail
    }).length
}

EmailsInput.prototype.getAllEmails = function () {
    return this.data
}

EmailsInput.prototype.updateAllEmails = function (emails) {
    while (this.listNode.childNodes.length > 1) {
        this.listNode.removeChild(this.listNode.firstChild);
    }
    this.data = []
    // add new emails
    const self = this
    emails.forEach(function (email) {
        self.add(email)
    })
}
