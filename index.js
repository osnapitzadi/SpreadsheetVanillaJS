// Globals
let phoneNums = "0123456789-() ";
let alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
let alphaNums = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
let tblArray = [];
const TBLROWS = 20;
const TBLCOLUMNS = 10;

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
            row.insertCell(-1).innerHTML = i&&j ? `<div id='${letter+i}' class='cell'>${i+j}</div>` : i||letter;
        }
    }
    updateArray();
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

// // filter the currently entered character to see that it is part
// // of the acceptable character set
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

// button "clear"
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
document.querySelector('#formula').addEventListener('change', cellEdit, false);

// event handlers
function selectedCell(event) {
    // to prevent an undefined value by hitting a not cell in a table
    console.log(event.target.id);
    if (event.target.localName == 'td') {
        console.log("you've hitted a <td>")
        return;
    }  else {
        // identify a cell ID and assign to cell indicator
        var indicator = document.getElementById('selectedCell');
        indicator.value = event.target.id;

        // getting a 2d table postition for same cell
        var tblIndex = event.target.id;
        var iString = tblIndex.substr(0, 1);
        var i = iString.charCodeAt(0)-65;
        var j = tblIndex.substr(1, 2);
        j = parseFloat(j)-1;

        // Parce data from tblArray to formula input  
        document.getElementById('formula').value = tblArray[j][i];
    }
}

function cellEdit() {
    // converting to a 2d array cell id
    var iString = tblIndex.substr(0, 1);
    var i = iString.charCodeAt(0)-65;
    var j = tblIndex.substr(1, 2);
    j = parseFloat(j)-1;

    let editedInput = document.getElementById('formula').value;
    tblArray[j][i] = editedInput;
    // updateArray();
    recalculate();
    let indicator = document.getElementById('selectedCell').value;
    document.getElementById(indicator).innerText = tblArray[j][i];
}

// determines if user entered a formula such as =SUM(A1:B2)
// returns an array with formula components
function getFormula(tbValue){
    var pattern = /[:|\(|\)]/;
    var ar = tbValue.split(pattern);
    var sum = ar[0].toUpperCase();
	if (ar.length < 3)
	    return null;
	else if (sum !== "=SUM")
	    return null;
	else
        return ar;
}

// traverse the 2d array looking for formulas
// and then recalculate cell values
// tblArray is the 2d JS array
function recalculate(){
    for (var i = 0; i < TBLROWS; i++){
        for (var j = 0; j < TBLCOLUMNS; j++){
            // check to see if table element is a formula
            if (tblArray[i][j].indexOf("=SUM") !== -1){
                // apply the formula for cell at row/column i/j
                calculateCell(i, j);
                return;
            };
        };
    };
};

// if we find a formula, parse it to find the from (row and column) and
// the to (row and column) and then perform the calculation by getting all
// the numeric values from the 2d array and generating a total
// parse the formula with a call to getFormula
// ... finally take the calculated total and insert into the HTML table
function calculateCell(row, column){
    // begin by getting the formula parts
    var tokenArray = getFormula(tblArray[row][column]);
    
    // tokenArray[1] and tokenArray[2] contain the from and to references
    // need more validation if this was a production level app
    
    if (tokenArray !== null){
        var fromColumn = tokenArray[1].substr(0, 1);
        var fromRow = tokenArray[1].substr(1, tokenArray[1].length - 1);

        var toColumn = tokenArray[2].substr(0, 1);
        var toRow = tokenArray[2].substr(1, tokenArray[2].length - 1);

        // assign the actual row/column index values for the tblArray
        var fromRowIndex = parseFloat(fromRow) - 1;
        var fromColIndex = fromColumn.charCodeAt(0) - 65;

        var toRowIndex = parseFloat(toRow) - 1;
        var toColIndex = toColumn.charCodeAt(0) - 65;

        var sumTotal = 0;

        for (var i = fromRowIndex; i <= toRowIndex; i++){
            for (var j = fromColIndex; j <= toColIndex; j++){
                // make sure we have a number for addition
                if (isFloat(tblArray[i][j]))
                    sumTotal += parseFloat(tblArray[i][j]);
            }
        }

        // we now have the total... insert into spreadsheet cell
        // ... get the cell id
        var letter = String.fromCharCode("A".charCodeAt(0)+column);
        var cellID = `${letter}${row+1}`;
        var ref = document.getElementById(cellID);
        console.log(cellID);
        ref.innerText = sumTotal;

        // //update formula input
        // document.getElementById('formula').value = sumTotal;
    }
}

// determines if this is an acceptable float value
function isFloat(s){
	var ch = "";
	var justFloat = "0123456789.";
	
	for (var i = 0; i < s.length; i++){
		ch = s.substr(i, 1);
	
		if (justFloat.indexOf(ch) == -1)
			return false;
	}
	return true;
}

// upadtind array data from dom
function updateArray() {
    for (var i = 0; i < TBLROWS; i++){
        tblArray[i] = [];
        for (var j = 0; j < TBLCOLUMNS; j++) {
            var letter = String.fromCharCode("A".charCodeAt(0)+j);
            var inputValue = document.getElementById(letter+(i+1)).innerText;
            tblArray[i][j] = inputValue;
        }
    }
    console.table(tblArray);
}