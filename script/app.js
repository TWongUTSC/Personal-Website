//This bit of code is just practice for using variables and types

var string1 = "Hello";
var string2 = "World";
var num1 = 100;
var num2 = 100.123; //decimals and integers are the same data type: number

console.log("This is a string: " + string1);
console.log("This is a concatenated string: " + string1 + string2);
console.log("This is a number: " + num1)
console.log("This is a sum of numbers: " + (num1 + num2))

//This bit of code is practicing displaying with js
function engineButton() {
    if (document.getElementById("result").innerHTML === "ENGINE") {
        document.getElementById("result").innerHTML = "RYAN";
    } else if (document.getElementById("result").innerHTML === "RYAN"){
        document.getElementById("result").innerHTML = "ENGINE";
    }
}

function documentButton(){
    document.write("Hello World! This is document.write for js")
}

function alertButton() {
    window.alert("Hello Button! This is window alert for js")
}

function logButton() {
    console.log("Hello World! This is done using console.log in js")
}

//Object practice

var car = {
    model:"tesla s" ,
    color: "black" ,
    gas : 23 ,
    addGas : function(amount){
        console.log("You had " + this.gas + " L of gas.")
        this.gas += amount;
        console.log("You now have " + this.gas + " L of gas.")
    }
}

//This makes the entire document cat each keypress into a string which is then logged
document.addEventListener('keypress', e => logString(e))

var input = '';
function logString(e){
    input += e.key;
    console.log(input);
}
//This checks the document for a specific key
document.addEventListener('keypress', e => checkKey(e))
function checkKey(e){
    if (e.key === 'A'){
        console.log("Its an A")
    }
}

//Looping samples
var i = 0;
while (i < 10){
    console.log(i)
    i++;
}

for (var i = 10 ; i < 13 ; i++){
    console.log(i)
}

//Array samples
//shift and unshift for remove/append to front
//push and pop for remove/append to back
//slice(index, #ofremoval,item1,item2,....)
    //this is for appending at a certain index
var numberArray = [20, 111, 259, 68];
console.log(numberArray)
numberArray.push(31, 21)
console.log(numberArray)
numberArray.push("hello")
console.log(numberArray)
console.log(numberArray[numberArray.length - 1])

//HTMLDOG event callbacks
var handleClick = function (event){
    console.log("hello")
}
var par = document.querySelector("#paragraph") //returns element
par.addEventListener('click', handleClick) //add event properties to element

//HTMLDOG JSON
//string can be gotten from json object
//string can be converted to actual object
var jsonstring = JSON.stringify({age:69})
var person = JSON.parse(jsonstring)
console.log(person)
person.age += 1;
console.log(person)

/**
 * Scope is not like java or c when using js
 * Function Scope means that variables are global unless declared in a function.
 * When in a function, variables are invisible outside of that function
 *
 * function myFunction(){
 *     var a = 30;
 * }
 * console.log(a) a is invisible here
 *
 * BUT
 *
 * if (true){
 * var thing = 50;
 * }
 * console.log(a) a is visible here
 *
 * AND
 *
 * variables declared are also available in child functions
 */