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
            row.insertCell(-1).innerHTML = i&&j ? `<input id='${letter+i}' value='${i+j}' class='cell'/>` : i||letter;
        }
    }
    updateArray();
}

// function filterText(ref) {
//     // choose the value of filterSet based
//     // on the text box that sent the character
//     if (ref.id === "txtPhoneNum") {
//         filterSet = phoneNums;
//     }
                    
//     // IE11 uses the .preventDefault()
//     if (isIE11) {
//         if (window.event.keyCode === 13) {
//             alert("You pressed the enter key");
//         }
//         else if (!nCharOK(window.event.keyCode)) {
//             window.event.preventDefault();
//         }
//     }
//     else {
//         // Chrome, Edge and Safari use returnValue
//         if (window.event.keyCode === 13) {
//             alert("You pressed the enter key");
//         }
//         else if (!nCharOK(window.event.keyCode)) {
//             window.event.returnValue = null;
//         }
//     }
// }

// // filter the currently entered character to see that it is part
// // of the acceptable character set
// function nCharOK(c) {
//     var ch = (String.fromCharCode(c));
//     ch = ch.toUpperCase();

//     // if the current character is not found in the set of all numbers
//     // set the flag variable to fail
//     if (filterSet.indexOf(ch) !== -1) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

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
document.querySelector('#table').addEventListener("change", cellEdit, false);
document.getElementById("selectedCell").addEventListener('change', indicatorChange, false);
document.querySelector('#formula').addEventListener('change', cellEdit, false);

// event handlers
function selectedCell(event) {
    if (event.target.localName == 'td') {
        console.log("you've hitted a <td>")
        return;
    }  else {
        var indicator = document.getElementById('selectedCell');
        indicator.value = event.target.id;
        document.getElementById('formula').value = event.target.value;
    }
}

// TODO make it work
function indicatorChange() {
    let indicator = document.getElementById('selectedCell').value;
    document.getElementById(indicator).focus;
}

function cellEdit() {
    let indicator = document.getElementById('selectedCell').value;
    let editInput = document.getElementById('formula').value;
    document.getElementById(indicator).value = editInput;
    updateArray();
    recalculate();
}

//sum formula working 

// some Design Considerations:

// 1. Use a JavaScript 2d array to store all data as entered by the user, including
//    formulas.
   
// 2. Map from the JS array to the HTML table every time the user changes a cell.
//    Do this using a nested for loop and when you find a formula in the JS array,
//    call a separate function to calculate the results of the single formula and
//    then output that result to matching cell in the HTML table.

// 3. The Local Storage (HTML5) part can be done easily by converting the JS array to JSON
//    and then saving the JSON string to the local storage. 
      
// 4. The spreadsheet can be reloaded from local storage by retrieving the JSON string and then converting it to a JavaScript 2d array.
   
// Sample code fragments
// Creating a JavaScript 2d array

tblArray = [];

var TBLROWS = 20;
var TBLCOLUMNS = 10;


// ********************************************************
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

getFormula("SUM(A1:B2)");


// ******************************************
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
            }
        }
    }
}

// ***********************************************************************
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
        ref.value = sumTotal;

        //update formula input
        document.getElementById('formula').value = sumTotal;
    }
}

// ***********************************************
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


function updateArray() {
    for (var i = 0; i < TBLROWS; i++){
        tblArray[i] = [];
        for (var j = 0; j < TBLCOLUMNS; j++) {
            var letter = String.fromCharCode("A".charCodeAt(0)+j);
            var inputValue = document.getElementById(letter+(i+1)).value;
            tblArray[i][j] = inputValue;
        }
    }
    console.table(tblArray);
}