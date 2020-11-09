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

