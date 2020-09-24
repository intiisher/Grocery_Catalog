class Grocery {
    constructor(name, price, id) {
        this.name = name;
        this.price = price;
        this.id = id;
    }
}

class UI {

    addNewEntry({ name, price, id }) {

        const newTr = document.createElement('tr');
        newTr.className = 'grocery-products'
        newTr.innerHTML =
            `<th scope = "row "> ${ name }  </th>  
            <td>$ ${ price } </td>  
            <td input type='hidden' data-id= ${id} >  
            <td> <a><i id='delete' class="fa fa-trash"></i>Delete</a> </td>`;

        document.querySelector('#product-list').appendChild(newTr);
    }

    clearField() {
        document.querySelector('#prd').value = '';
        document.querySelector('#prc').value = '';

    }

    getId() {
        return document.querySelectorAll('tr').length;
    }

    addAlert(msg, status) {
        const div = document.createElement('div');
        div.className = `alert alert-${status}`;
        div.innerHTML = `<div role="alert" style="text-align:center;">
        ${msg}
        </div>`;

        const container = document.querySelector('.container');
        const form = document.querySelector('form');

        container.insertBefore(div, form);


        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    };

    deleteProduct(target) {
        if (target.id === 'delete') {

            //target.parentElement.parentElement.parentElement.remove();
            //const delPrdId = (target.parentElement.parentElement.parentElement.value);
            //console.log(delPrdId);
            const id = Number(target.parentElement.parentElement.previousElementSibling.dataset.id);

            LocalStore.deleteFromStotage(id);
            target.parentElement.parentElement.parentElement.remove();


        }
    }

}

class LocalStore {

    static addToStorage(prd) {
        let storedProducts;
        if (localStorage.getItem('grocery') === null) {
            storedProducts = [];
        } else {
            storedProducts = JSON.parse(localStorage.getItem('grocery'));
        }
        storedProducts.push(prd);

        localStorage.setItem('grocery', JSON.stringify(storedProducts));

    }

    static getFromStorage() {
        let storedProducts;
        if (localStorage.getItem('grocery') === null) {
            storedProducts = [];

        } else {
            storedProducts = JSON.parse(localStorage.getItem('grocery'));
        }

        return storedProducts;
    }


    static displayFromStorage() {

        const storedProducts = LocalStore.getFromStorage();
        storedProducts.forEach(item => {
            const ui = new UI();
            ui.addNewEntry(item);
        })

    }

    static deleteFromStotage(id) {
        const storedProducts = LocalStore.getFromStorage();
        storedProducts.forEach((item, index) => {
            if (item.id === id) {
                storedProducts.splice(index, 1);
            }
        })

        localStorage.setItem('grocery', JSON.stringify(storedProducts));
    }

}


document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();

    const ui = new UI();
    const prdname = document.querySelector('#prd').value;
    const prdprice = document.querySelector('#prc').value;
    const prdid = ui.getId();

    const groceryEntry = new Grocery(prdname, prdprice, prdid);


    if (prdname === '' || prdprice === '' || prdid === '') {
        ui.addAlert('One or more fields are blank.', 'danger')

    } else {
        ui.addNewEntry(groceryEntry);
        ui.clearField();
        LocalStore.addToStorage(groceryEntry);
        ui.addAlert('New Product Added.',
            'success');

    }


});

document.querySelector('#product-list').addEventListener('click', e => {
    console.log(e.target);
    const ui = new UI();
    ui.deleteProduct(e.target);
    e.preventDefault();
})

//Fetching data for displaying in table  from LocalStorage
window.addEventListener('DOMContentLoaded', LocalStore.displayFromStorage);

// Searching products
const filterInput = document.querySelector('#filterInput')
filterInput.addEventListener('keyup', e => {
    e.preventDefault();
    const text = e.target.value.toLowerCase();
    let itemLength = 0;
    document.querySelectorAll('.grocery-products').
    forEach(item => {
        const getproductName = item.firstElementChild.textContent.toLowerCase()

        if (getproductName.indexOf(text) === -1) {
            itemLength = 0;
            item.style.display = 'none'
        } else {
            item.style.display = 'table-row-group'
                ++itemLength
        }
    });

    const ui = new UI();

    (itemLength > 0) ? ui.addAlert(''): ui.addAlert('No product found.', 'danger')
})
