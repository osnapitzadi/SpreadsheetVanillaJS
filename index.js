// Globals
let phoneNums = "0123456789-() ";
let alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
let alphaNums = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

// the current set of allowable characters or numbers
var filterSet = "";
    
// find out what type of browser we have
var isIE11 = ((window.navigator.userAgent).indexOf("Trident") !== -1);
var isChrome = ((window.navigator.userAgent).indexOf("Chrome") !== -1);
var isSafari = ((window.navigator.userAgent).indexOf("Safari") !== -1);

// initializing table 10x20
const init = () => {
    for (var i=0; i<21; i++) {
        var row = document.querySelector("#table").insertRow(-1);
        for (var j=0; j<11; j++) {
            var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
            row.insertCell(-1).innerHTML = i&&j ? `<input id='${letter+i}' value='${10+i}' class='cell'/>` : i||letter;
        }
    }
}

function filterText(ref) {
    // choose the value of filterSet based
    // on the text box that sent the character
    if (ref.id === "txtPhoneNum") {
        filterSet = phoneNums;
    }
                    
    // IE11 uses the .preventDefault()
    if (isIE11) {
        if (window.event.keyCode === 13) {
            alert("You pressed the enter key");
        }
        else if (!nCharOK(window.event.keyCode)) {
            window.event.preventDefault();
        }
    }
    else {
        // Chrome, Edge and Safari use returnValue
        if (window.event.keyCode === 13) {
            alert("You pressed the enter key");
        }
        else if (!nCharOK(window.event.keyCode)) {
            window.event.returnValue = null;
        }
    }
}

// filter the currently entered character to see that it is part
// of the acceptable character set
function nCharOK(c) {
    var ch = (String.fromCharCode(c));
    ch = ch.toUpperCase();

    // if the current character is not found in the set of all numbers
    // set the flag variable to fail
    if (filterSet.indexOf(ch) !== -1) {
        return true;
    }
    else {
        return false;
    }
}

// Functions
const clearBtn = () => {
    let allInputs = document.querySelectorAll("input");
    for (let index = 0; index < allInputs.length; index++) {
        const element = allInputs[index];
        element.value = '';
    }   
}

// event listeners 
document.querySelector('#table').addEventListener("click", selectedCell, false);
document.querySelector('#table').addEventListener("change", selectedCell, false);
document.getElementById("selectedCell").addEventListener('change', indicatorChange, false);
document.querySelector('#formula').addEventListener('change', cellEdit, false);

// event handlers
function selectedCell(event) {
    // console.log(event.path[0].id);
    // console.log(event.target);
    // console.log(event);
    // console.log(event.target.localName);
    if (event.target.localName == 'td') {
        console.log("you've hitted a <td>")
        return;
    }  else {
        var indicator = document.getElementById('selectedCell');
        indicator.value = event.target.id;
        document.getElementById('formula').value = event.target.value;
    }
}

function indicatorChange() {
    let indicator = document.getElementById('selectedCell').value;
    document.getElementById(indicator).focus;
}

function cellEdit() {
    let indicator = document.getElementById('selectedCell').value;
    let editInput = document.getElementById('formula').value;
    document.getElementById(indicator).value = editInput;
}

