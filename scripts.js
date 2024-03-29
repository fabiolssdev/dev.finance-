const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
        },
    close(){
        // fechar o modal
        // remover a class active no modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
}
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        // collect all transactions
        //for each transaction
        Transaction.all.forEach(transaction => {
            //if it is > 0
            if(transaction.amount > 0) {
                //add to a variable and return the variable
                income = income + transaction.amount;
            }
        })
        return income; //some the incomes
    },

    expenses() {
        let expense = 0;
        // collect all transactions
        //for each transaction
        Transaction.all.forEach(transaction => {
            //if it is > 0
            if(transaction.amount < 0) {
                //add to a variable and return the variable
                expense = expense + transaction.amount;
            }
        })
        return expense;
    },

    total () {
            return Transaction.incomes() + Transaction.expenses();
    }
}

// I need to replace my datas in my object here at javascript and add on HTML.
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
            const tr = document.createElement('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
            tr.dataset.index = index

            DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remove transaction"></td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDatte = date.split("-")
        return `${splittedDatte[2]}/${splittedDatte[1]}/${splittedDatte[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")//change all value and change to string in numbers
        
        value = Number(value) / 100 //here replace in number
        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) // transform the numbers in monetary value
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    
    validateFields() {
        const {description, amount, date } = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Please fill all form fields")
        }
    },

    formatValues() {
        let {description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {description, amount, date}
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    // saveTransaction(transaction) {
    //     Transaction.add(transaction)
    // },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields() // verify is all places are filled
            const transaction = Form.formatValues() // format the data(value)
            Transaction.add(transaction) //save
            Form.clearFields() //clear form
            Modal.close() //close modal
        } catch(error) {
            alert(error.message)//launch error askingg for te user fill the form
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
                
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}


App.init()
