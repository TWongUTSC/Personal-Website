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

// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

function Position(x, y) { //these are integers
    this.x = x;
    this.y = y;
}

Position.prototype.toString = function() { //idk what this is
    return this.x + ":" + this.y;
};

function Mazing() {
    // bind to HTML elements
    this.mazeContainer = document.getElementById("maze");
    this.mazeOutputDiv = document.getElementById("maze_output");
    this.mazeMessage   = document.getElementById("maze_message");
    this.mazeScore     = document.getElementById("maze_score");
    this.heroScore     = this.mazeContainer.getAttribute("data-steps") - 2;

    this.maze = []; //holds the maze
    this.heroPos = {}; //holds position
    this.heroHasKey = false;
    this.childMode = false;

    //set up
    for(i=0; i < this.mazeContainer.children.length; i++) { //rows
        for(j=0; j < this.mazeContainer.children[i].children.length; j++) { //individual item
            var el =  this.mazeContainer.children[i].children[j];
            //maze array holds all div elements
            this.maze[new Position(i, j)] = el;
            if(el.classList.contains("entrance")) {
                // place hero at entrance
                this.heroPos = new Position(i, j);
                this.maze[this.heroPos].classList.add("hero");
                //adds hero class at the element containing entrance
            }
        }
    }

    this.mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
    this.setMessage("first find the key");

    // activate control keys
    this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
    document.addEventListener("keydown", this.keyPressHandler, false);
}

Mazing.prototype.setMessage = function(text) {
    this.mazeMessage.innerHTML = text;
    this.mazeScore.innerHTML = this.heroScore;
};

Mazing.prototype.heroTakeTreasure = function() {
    this.maze[this.heroPos].classList.remove("nubbin");
    this.heroScore += 10;
    this.setMessage("yay, treasure!");
};

Mazing.prototype.heroTakeKey = function() {
    this.maze[this.heroPos].classList.remove("key");
    this.heroHasKey = true;
    this.heroScore += 20;
    this.mazeScore.classList.add("has-key");
    this.setMessage("you have the key!");
};

Mazing.prototype.gameOver = function(text) {
    // de-activate control keys
    document.removeEventListener("keydown", this.keyPressHandler, false);
    this.setMessage(text);
    this.mazeContainer.classList.add("finished");
};

Mazing.prototype.heroWins = function() {
    this.mazeScore.classList.remove("has-key");
    this.maze[this.heroPos].classList.remove("door");
    this.heroScore += 50;
    this.gameOver("you finished !!!");
};

Mazing.prototype.tryMoveHero = function(pos) {
    var nextStep = this.maze[pos].className;

    // before moving
    if(nextStep.match(/sentinel/)) {
        this.heroScore = Math.max(this.heroScore - 5, 0);
        if(!this.childMode && this.heroScore <= 0) {
            this.gameOver("sorry, you didn't make it");
        } else {
            this.setMessage("ow, that hurt!");
        }
        return;
    }
    if(nextStep.match(/wall/)) {
        return;
    }
    if(nextStep.match(/exit/)) {
        if(this.heroHasKey) {
            this.heroWins();
        } else {
            this.setMessage("you need a key to unlock the door");
            return;
        }
    }

    // move hero one step after no wall
    this.maze[this.heroPos].classList.remove("hero"); //remove old hero
    this.maze[pos].classList.add("hero"); //place new hero
    this.heroPos = pos; //change pos

    // after moving
    if(nextStep.match(/nubbin/)) {
        this.heroTakeTreasure();
        return;
    }
    if(nextStep.match(/key/)) {
        this.heroTakeKey();
        return;
    }
    if(nextStep.match(/exit/)) {
        return;
    }
    if(this.heroScore >= 1) {
        if(!this.childMode) {
            this.heroScore--;
        }
        if(!this.childMode && this.heroScore <= 0) {
            this.gameOver("sorry, you didn't make it");
        } else {
            this.setMessage("...");
        }
    }
};

Mazing.prototype.mazeKeyPressHandler = function(e) {
    var tryPos = new Position(this.heroPos.x, this.heroPos.y);
    switch(e.keyCode)
    {
        case 37: // left
            this.mazeContainer.classList.remove("face-right");
            tryPos.y--;
            break;

        case 38: // up
            tryPos.x--;
            break;

        case 39: // right
            this.mazeContainer.classList.add("face-right");
            tryPos.y++;
            break;

        case 40: // down
            tryPos.x++;
            break;

        default:
            return;

    }
    this.tryMoveHero(tryPos);
    e.preventDefault();
};

Mazing.prototype.setChildMode = function() {
    this.childMode = true;
    this.heroScore = 0;
    this.setMessage("collect all the treasure");
};
