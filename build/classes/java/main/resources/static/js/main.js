document.addEventListener("DOMContentLoaded", function(event) {

        jsonField = ['name', 'address', 'tel'];

        const divAdd = document.querySelector(".othersBtn");
        const addButton = document.createElement('input');
        buttonUtil.generateButton(addButton, "add", "Add Bookstore", bookstoreAddNewButton.addNewRow);
        divAdd.appendChild(addButton);

        bookstore.listBookstore();
    });

const bookstore = {
    listBookstore : function(){
        let request = new XMLHttpRequest();
        request.open('GET', '/bookstore/list', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                let json = JSON.parse(request.response);
                console.log(request.response);
                let data = Object.keys(json[0]);
                let table = document.querySelector(".bookstore_list");
                bookstoreTable.generateTable(table, json);
                bookstoreTable.generateTableHead(table, data);
            }
            else {
               console.log('We reached our target server, but it returned an error');
            }
        };

        request.onerror = function() {
          console.log('There was a connection error of some sort');
        };

        request.send();
    }
};

const bookstoreTable = {
    generateTableHead : function(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for(let key of data){
            if(key != "id"){
                const th = document.createElement('th')
                const text = document.createTextNode(key.toUpperCase());
                th.appendChild(text);
                row.appendChild(th);
            }
        }
        let generateTableHeaderEditDeleteBooks = function(row, textName){
            const th = document.createElement('th');
            const text = document.createTextNode(textName);
            th.appendChild(text);
            row.appendChild(th);
        }
        generateTableHeaderEditDeleteBooks(row, 'EDIT');
        generateTableHeaderEditDeleteBooks(row, 'DELETE');
        generateTableHeaderEditDeleteBooks(row, 'BOOKS');
    },

    generateTable : function(table, json){
        let numOfRow = 1;
        for(let element of json){
            let row = table.insertRow();
            numOfRow++;
            let i = 0;
            for(let value in element){
                if(value != "id"){
                    let td = row.insertCell();
                    td.setAttribute("data-inlinevalue", element[value]);
<!--                    td.className = jsonField[i];-->
                    td.setAttribute("data-inlinename", jsonField[i]);
                    let text = document.createTextNode(element[value]);
                    td.appendChild(text);
                    i++;
                }
            }
            const firstKey = Object.keys(element)[0];
            const storeId = element[firstKey];

            const editButton = document.createElement('input');
            const deleteButton = document.createElement('input');
            const booksButton = document.createElement('input');
            const saveButton = document.createElement('input');
            const cancelButton = document.createElement('input');

            buttonUtil.generateButton(saveButton, "save", "Save", bookstoreSaveButton.updateAndSaveBookstore.bind(null, storeId, row, editButton, deleteButton, booksButton, saveButton, cancelButton));
            buttonUtil.generateButton(cancelButton, "cancel", "Cancel", bookstoreCancelButton.cancelEditing.bind(null, row, editButton, deleteButton, booksButton, saveButton, cancelButton));
            buttonUtil.generateButton(editButton, "edit", "Edit", bookstoreEditButton.editBookstore.bind(this, row, storeId, editButton, deleteButton, booksButton, saveButton, cancelButton));
            buttonUtil.generateButton(deleteButton, "delete", "Delete", bookstoreDeleteButton.deleteBookstore.bind(null, storeId));
            buttonUtil.generateButton(booksButton, "books", "Books", bookstoreBooksButton.openBookDB.bind(null, storeId));

// Show Edit
// Hide Save
            const tdEditButton = row.insertCell();
            tdEditButton.appendChild(editButton);
            tdEditButton.appendChild(saveButton);
            editButton.style.display = "block";
            saveButton.style.display = "none";

// Show Delete
// Hide Cancel
            const tdDeleteButton = row.insertCell();
            tdDeleteButton.appendChild(deleteButton);
            tdDeleteButton.appendChild(cancelButton);
            deleteButton.style.display = "block";
            cancelButton.style.display = "none";

// Show Books
            const tdBooksButton = row.insertCell();
            tdBooksButton.appendChild(booksButton);
            booksButton.style.display = "block";
        }
    },

};

const bookstoreEditButton = {
    editBookstore : function(row, storeId, editButton, deleteButton, booksButton, saveButton, cancelButton) {
        for(let i = 0; i < jsonField.length; i++){
<!--            let td = row.querySelector('.'+ jsonField[i]);-->
            let td = row.querySelector('[data-inlinename=' + jsonField[i] + ']');
            let originalValue = td.getAttribute('data-inlinevalue');
            let child = td.childNodes[0];
            td.removeChild(child);

            let element = document.createElement("input");
            element.type = "text";
            element.className = jsonField[i];
            element.value = originalValue;
            td.appendChild(element);
        }

// Show Save
// Hide Edit
        editButton.style.display = "none";
        saveButton.style.display = "block";

// Show Cancel
// Hide Delete
        deleteButton.style.display = "none";
        cancelButton.style.display = "block";

// Hide books
        booksButton.style.display = "none";
    },
};

const buttonUtil = {
    generateButton : function(button, className, value, clickAction){
        button.setAttribute('type', 'button');
        button.setAttribute('class', className);
        button.setAttribute('value', value);
        button.addEventListener('click', clickAction);
    }
};

const bookstoreDeleteButton = {
    deleteBookstore : function(storeId){
        if(confirm('Do you sure you want to delete this item?')){
            let request = new XMLHttpRequest();
            request.open('DELETE', '/bookstore/delete?storeId=' + storeId, true);
            request.onload = function(){
                if (request.status >= 200 && request.status < 400){
                    reloadPage();
                }
                else{
                    console.log("failing");
                }
            }
            request.send();
        }
    },
};

const bookstoreBooksButton = {
    openBookDB : function(storeId){
        window.localStorage.setItem("storeId",storeId);
        window.location.href = '/book.html';
    }
};

const bookstoreSaveButton = {
    updateAndSaveBookstore : function(storeId, row, editButton, deleteButton, booksButton, saveButton, cancelButton){
        const data = {
            name: row.getElementsByClassName("name")[0].value,
            address: row.getElementsByClassName("address")[0].value,
            tel: row.getElementsByClassName("tel")[0].value
        };
        const json = JSON.stringify(data);
        let request = new XMLHttpRequest();
        request.open('PUT', '/bookstore/edit?storeId=' + storeId, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                for(let i = 0; i < jsonField.length; i++){
                    let td = row.querySelector('[data-inlinename=' + jsonField[i] + ']');
                    let newValue = data[jsonField[i]];
                    td.setAttribute("data-inlinevalue", newValue);
                    let child = td.childNodes[0];
                    td.removeChild(child);
                    let text = document.createTextNode(newValue);
                    td.appendChild(text);
                }
// Show EDIT
// Hide Save
                editButton.style.display = "block";
                saveButton.style.display = "none";

// Show Delete
// Hide Cancel
                deleteButton.style.display = "block";
                cancelButton.style.display = "none";

// Show BOOKS
                booksButton.style.display = "block";
            }
            else {
               console.log('We reached our target server, but it returned an error');
            }
        };

        request.onerror = function() {
            console.log('There was a connection error of some sort');
        };

        request.send(json);
    },

    saveBookstore : function(row, editButton, deleteButton, booksButton, saveButton, cancelButton){
        const data = {
            name: row.getElementsByClassName("name")[0].value,
            address: row.getElementsByClassName("address")[0].value,
            tel: row.getElementsByClassName("tel")[0].value
        };
        const json = JSON.stringify(data);

        let request = new XMLHttpRequest();
        request.open('POST', '/bookstore/save', true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                for(let i = 0; i < jsonField.length; i++){
                    let td = row.querySelector('[data-inlinename=' + jsonField[i] + ']');
                    let newValue = data[jsonField[i]];
                    td.setAttribute("data-inlinevalue", newValue);
                    let child = td.childNodes[0];
                    td.removeChild(child);
                    let text = document.createTextNode(newValue);
                    td.appendChild(text);
                }

                const storeId = request.response;
                buttonUtil.generateButton(editButton, "edit", "Edit", bookstoreEditButton.editBookstore.bind(this, row, storeId, editButton, deleteButton, booksButton, saveButton, cancelButton));
                buttonUtil.generateButton(deleteButton, "delete", "Delete", bookstoreDeleteButton.deleteBookstore.bind(null, storeId));
                buttonUtil.generateButton(booksButton, "books", "Books", bookstoreBooksButton.openBookDB.bind(null, storeId));

// Show EDIT
// Hide Save

                editButton.style.display = "block";
                saveButton.style.display = "none";

// Show Delete
// Hide Cancel
                deleteButton.style.display = "block";
                cancelButton.style.display = "none";

// Show BOOKS
                booksButton.style.display = "block";
            }
            else {
               console.log('We reached our target server, but it returned an error');
            }
        };

        request.onerror = function() {
            console.log('There was a connection error of some sort');
        };

        request.send(json);
    }

};

const bookstoreCancelButton = {
    cancelEditing : function(row, editButton, deleteButton, booksButton, saveButton, cancelButton){
        for(let i = 0; i < jsonField.length; i++){
            let td = row.querySelector('[data-inlinename=' + jsonField[i] + ']');
            let originalValue = td.getAttribute('data-inlinevalue');
            let child = td.childNodes[0];
            td.removeChild(child);
            let text = document.createTextNode(originalValue);
            td.appendChild(text);
        }
        editButton.style.display = "block";
        deleteButton.style.display = "block";
        booksButton.style.display = "block";
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
    },

    cancelNewRow : function(row){
        row.parentNode.removeChild(row);
    }
};

const bookstoreAddNewButton = {
    addNewRow : function(){
        const table = document.querySelector(".bookstore_list");
        const rowCount = table.rows.length;
        const row = table.insertRow(rowCount);
        const numOfButtons = 3;
        const colCount = table.rows[0].cells.length - numOfButtons;
        for(let i = 0; i < colCount; i++){
            let td = row.insertCell(i);
            td.setAttribute("data-inlinename", jsonField[i]);
            let element = document.createElement("input");
            element.type = "text";
            element.value = "";
            element.className = jsonField[i];
            td.appendChild(element);
        }

        const editButton = document.createElement('input');
        const deleteButton = document.createElement('input');
        const booksButton = document.createElement('input');
        const saveButton = document.createElement('input');
        const cancelButton = document.createElement('input');

        buttonUtil.generateButton(saveButton, "save", "Save", bookstoreSaveButton.saveBookstore.bind(null, row, editButton, deleteButton, booksButton, saveButton, cancelButton));
        buttonUtil.generateButton(cancelButton, "cancel", "Cancel", bookstoreCancelButton.cancelNewRow.bind(null, row));

// Hide Edit
// Show SAVE
        const tdSaveButton = row.insertCell();
        tdSaveButton.appendChild(saveButton);
        tdSaveButton.appendChild(editButton);
        editButton.style.display = "none";
        saveButton.style.display = "block";

// Hide Delete
// Show CANCEL
        const tdCancelButton = row.insertCell();
        tdCancelButton.appendChild(cancelButton);
        tdCancelButton.appendChild(deleteButton);
        deleteButton.style.display = "none";
        cancelButton.style.display = "block";

// Hide Books
        const tdBooksButton = row.insertCell();
        tdBooksButton.appendChild(booksButton);
        booksButton.style.display = "none";
    }
};

function reloadPage(){
    const tableTbody = document.querySelector("tbody");
    tableTbody.parentNode.removeChild(tableTbody);
    const tableThead = document.querySelector("thead");
    tableThead.parentNode.removeChild(tableThead);
    bookstore.listBookstore();
}