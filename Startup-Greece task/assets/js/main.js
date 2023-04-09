//GLOBAL VARIABLES
var inputFirstName = document.getElementById("input-first-name");
var inputLastName = document.getElementById("input-last-name");
var inputEmail = document.getElementById("input-email");
var inputSelect = document.getElementById("input-type");
var messageBox = document.getElementById("message-box");
var arrErrors = [];
var arrUsers = [];
var objUser = {};

//REGEXES
var reFullName = /^([A-Z][a-z]{2,14}){1,3}$/;
var reEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


//ON PAGE LOAD
$(document).ready(function(){
    let btn = document.getElementById("btn-add-user");
    let btnDrop = document.getElementById("btn-drop-users");

    //LOAD PREVIOUSLY ADDED USERS
    updateUsersInTable();

    //ADD NEW USER
    btn.addEventListener("click", getUserInput) 

    //REMOVE ALL USERS
    btnDrop.addEventListener("click", dropAllUsers);

    
})


function updateUsersInTable() {
    let btnsDeleteUser = document.getElementsByClassName("btn-delete");
    let usersTableBody = document.querySelector("#users-table tbody");
    let arrUsersLS = readUsersFromLocalStorage();
    let print = "";

    //IF THERE ARE ANY PREVIOUSLY SAVED USERS
    if (arrUsersLS != null) {
        arrUsersLS.reverse();
        arrUsersLS.forEach(user => {
        print += `<tr align="center">
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.type}</td>
                    <td align="center"><button class="btn btn-danger btn-delete" data-id="${user.id}">Delete</button></td>
                </tr>`
        });
        messageBox.textContent = "To add a user, fill in user information.";
        usersTableBody.innerHTML = print;

        //DELETE INDIVIDUAL USER
        Array.from(btnsDeleteUser).forEach(btn => {
            btn.addEventListener("click", function(){
                let arrUsersLS = readUsersFromLocalStorage();
                let filteredUsers = arrUsersLS.filter(x => x.id != $(this).data("id"));
                
                //REMOVE SELECTED USER
                if (filteredUsers.length > 0) {
                    localStorage.removeItem("Users");
                    localStorage.setItem("Users", JSON.stringify(filteredUsers));
                    updateUsersInTable();
                }
                else {
                    //IF ONLY 1 USER EXISTS
                    localStorage.removeItem("Users"); 
                    updateUsersInTable();
                }
            });
        });
    }
    else {
        messageBox.textContent = "Currently there are no records of previous users. To add a user, fill in user information.";
        usersTableBody.innerHTML = "";
    }
}


function validateUserInput(){
    let isSuccesfull = false;
    let print = "";
    arrErrors = [];

    regexValidation(reFullName, inputFirstName);
    regexValidation(reFullName, inputLastName);
    regexValidation(reEmail, inputEmail);

    //SELECT VALIDATION
    if (inputSelect.options[inputSelect.options.selectedIndex].value == "0") {
        error = "User type is not chosen.";
        arrErrors.push(error);
    }

    //CHECK IF ANY ERRORS HAVE BEEN DETECTED
    if (arrErrors.length > 0) {
        messageBox.classList.remove("alert-primary");
        messageBox.classList.add("alert-danger");

        arrErrors.forEach(er => {
            print += arrErrors.indexOf(er)+1 + ') ' + er;
        });
        messageBox.innerHTML = print;
        return isSuccesfull;
    }
    else {
        messageBox.classList.remove("alert-danger");
        messageBox.classList.add("alert-primary");
        messageBox.textContent = "To add a user, fill in user information.";

        isSuccesfull = true;
        return isSuccesfull;
    }
    
}


function regexValidation(re, obj){
    let error = "";
    if (!re.test(obj.value)) {
        if (obj == inputFirstName || obj == inputLastName) {
            error = "First and last names must include at least 1 capital letter and at least 2 lower case letters from the alphabet.<br/>";
        }
        if (obj == inputEmail) {
            error = "Email address is not correctly formatted.<br/>";
        }

        //FIRST ERROR
        if (arrErrors.length == 0) {
            arrErrors.push(error);
        }
        else {
            let hasError = false;
            hasError = arrErrors.includes(error);
            if (!hasError) {
                arrErrors.push(error);
            }
        }
    }
}


function getUserInput(){
    let isSuccesfull = validateUserInput();
    if (isSuccesfull) {
        arrUsers = readUsersFromLocalStorage();

        if (arrUsers == null) {
            arrUsers = [];
        }

        objUser = {
            id: arrUsers.length,
            firstName: inputFirstName.value,
            lastName: inputLastName.value,
            email: inputEmail.value,
            type: inputSelect.options[inputSelect.options.selectedIndex].text
        };
        arrUsers.push(objUser);
        localStorage.setItem("Users",JSON.stringify(arrUsers));

        updateUsersInTable();
    }
}


function readUsersFromLocalStorage(){
    return JSON.parse(localStorage.getItem("Users"));
}


function dropAllUsers(){
    let confirmed = confirm("WARNING! You are about to delete all previously saved users. Proceed?");
    if (confirmed) {
        localStorage.removeItem("Users");
        updateUsersInTable();
    }
}