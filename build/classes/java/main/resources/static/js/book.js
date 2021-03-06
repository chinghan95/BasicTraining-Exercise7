document.addEventListener("DOMContentLoaded", function(event) {

        jsonField = ['bookName', 'category', 'price'];
        storeId = localStorage.getItem("storeId");

        const divAdd = document.querySelector(".othersBtn");
        const addButton = document.createElement('input');
        buttonUtil.generateButton(addButton, "add", "Add Book", bookAddNewButton.addNewRow);
        divAdd.appendChild(addButton);

        const divReturnBookstore = document.querySelector(".returnToBookstore");
        const returnBookstoreButton = document.createElement('input');
        buttonUtil.generateButton(returnBookstoreButton, "returnToBookstore", "Return to bookstores", returnButton.returnBookstore);
        divReturnBookstore.appendChild(returnBookstoreButton);

        book.listBook();
    });

var book = {
    listBook : function(){
        let request = new XMLHttpRequest();
        request.open('GET', '/book/list?storeId=' + storeId, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                let json = JSON.parse(request.response);

                if(json.length === 0){
                    alert("No books' data avaliable yet!");
                }
                else{
                    bookTable.generateTbody(json);
                }
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

var bookTable = {
    generateTbody : function(json) {
        const tbody = document.querySelector("tbody");
        let numOfRow = 1;
        for(let element of json){
            let row = tbody.insertRow();
            numOfRow++;
            let i = 0;
            for(let value in element){
                if(value != "id" && value != "bookstore"){
                    let td = row.insertCell();
                    td.setAttribute("data-inlinevalue", element[value]);
                    td.setAttribute("data-inlinename", jsonField[i]);
                    let text = document.createTextNode(element[value]);
                    td.appendChild(text);
                    i++;
                }
            }
            const firstKey = Object.keys(element)[0];
            const bookId = element[firstKey];
// EDIT
            const tdEditButton = row.insertCell();
            const editButton = document.createElement('input');
            buttonUtil.generateButton(editButton, "edit", "Edit", bookEditButton.editBook.bind(this, editButton, row, bookId));
            tdEditButton.appendChild(editButton);

// DELETE
            const tdDeleteButton = row.insertCell();
            const deleteButton = document.createElement('input');
            buttonUtil.generateButton(deleteButton, "delete", "Delete", bookDeleteButton.deleteBook.bind(null, bookId));
            tdDeleteButton.appendChild(deleteButton);
        }
    },
};

var buttonUtil = {
    generateButton : function(button, className, value, clickAction){
        button.setAttribute('type', 'button');
        button.setAttribute('class', className);
        button.setAttribute('value', value);
        button.addEventListener('click', clickAction);
    }
};
var bookEditButton = {
    editBook :function(editButton, row, bookId){
        for(let i = 0; i < jsonField.length; i++){
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

        let editElement = row.getElementsByClassName('edit')[0];
// UPDATE
        const saveButton = document.createElement('input');
        buttonUtil.generateButton(saveButton, "save", "Save", bookSaveButton.updateAndSaveBook.bind(null, bookId));
        editElement.parentNode.appendChild(saveButton);
        editElement.parentNode.removeChild(editElement);

        let deleteElement = row.getElementsByClassName('delete')[0];
// CANCEL
        const cancelButton = document.createElement('input');
        buttonUtil.generateButton(cancelButton, "cancel", "Cancel", bookCancelButton.cancelEditing);
        deleteElement.parentNode.appendChild(cancelButton);
        deleteElement.parentNode.removeChild(deleteElement);
    }
};

var bookDeleteButton = {
    deleteBook : function(bookId){
        if(confirm('Do you sure you want to delete this item?')){
            let request = new XMLHttpRequest();
            request.open('DELETE', '/book/delete?bookId=' + bookId, true);
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
    }
};

var bookSaveButton = {
    updateAndSaveBook : function(bookId){
        const data = {
            bookName: document.getElementsByClassName("bookName")[0].value,
            category: document.getElementsByClassName("category")[0].value,
            price: document.getElementsByClassName("price")[0].value
        };

        const json = JSON.stringify(data);
        let request = new XMLHttpRequest();
        request.open('PUT', '/book/edit?storeId=' + storeId + '&bookId=' + bookId, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
// ??????
                reloadPage();
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

    saveBook : function(){
        const data = {
            bookName: document.getElementsByClassName("bookName")[0].value,
            category: document.getElementsByClassName("category")[0].value,
            price: document.getElementsByClassName("price")[0].value
        };

        const json = JSON.stringify(data);
        let request = new XMLHttpRequest();
        request.open('POST', '/book/save?storeId=' + storeId, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
// ??????
                reloadPage();
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

var bookCancelButton = {
    cancelEditing :function(){
        reloadPage();
    },

    cancelNewRow :function(row){
        row.parentNode.removeChild(row);
    }
};

var bookAddNewButton = {
    addNewRow :function(){
        const tableTbody = document.querySelector("tbody");

        const table = document.querySelector(".book_list");
        const rowCount = tableTbody.rows.length;
        const row = tableTbody.insertRow(rowCount);
        const numOfButtons = 2;
        const colCount = table.rows[0].cells.length - numOfButtons;

        for(let i = 0; i < colCount; i++){
            let td = row.insertCell(i);
            let element = document.createElement("input");
            element.type = "text";
            element.value = "";
            element.className = jsonField[i];
            td.appendChild(element);
        }

// SAVE
        const tdSaveButton = row.insertCell();
        const saveButton = document.createElement('input');
        buttonUtil.generateButton(saveButton, "save", "Save", bookSaveButton.saveBook);
        tdSaveButton.appendChild(saveButton);

// CANCEL
        const tdCancelButton = row.insertCell();
        const cancelButton = document.createElement('input');
        buttonUtil.generateButton(cancelButton, "cancel", "Cancel", bookCancelButton.cancelNewRow.bind(null, row));
        tdCancelButton.appendChild(cancelButton);
    }
};

var returnButton = {
    returnBookstore : function(){
        window.location.href = '/bookstore.html';
    }
};

function reloadPage(){
    const table = document.querySelector(".book_list");
    const tableTbody = document.querySelector("tbody");
    tableTbody.parentNode.removeChild(tableTbody);
    table.appendChild(document.createElement('tbody'))
    book.listBook();
}