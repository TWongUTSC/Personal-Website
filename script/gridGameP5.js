/*
ABSTRACT CELL DETECTION PLAN
so i have my grid that has a number of cells and a total size in pixels

I can have a function, on click, when if pressed, I use the current x,y corrdinates of the mouse
to figure out which row and column index i am currently pressing.

I can use that to figure out whether or not the click was valid or not

I can use modulo(cell size) to find out which cell was pressed


*/
var size
var currentGameState
function setup(){
    //Init
    size = 500
    var canvas = createCanvas(size, size);
    canvas.parent('gridContainer');
    frameRate(60);
    
    //Get config containing level information
    config = getJSONObject("https://raw.githubusercontent.com/TerryCLAWong/Personal-Website/grid-game/gridGameConfig.json")
    
    //Play levels
    for (let index = 0 ; index < config.levels.length ; index++) {
        let level = config.levels[index]
        while (!playLevel(level)) {
            //Lost level, try again
        }
        //Won level, moving on
    }
    //Won game
}

function playLevel(level) {

    currentGameState = new GameState(level.size,[],level.walls, [])
    drawGrid(level.size, size)

    

    /*
    init game state with a function
    draw the screen
    take valid input and set current
    */
   return true
}

function mousePressed() {
    let cellSize = size/currentGameState.size
    console.log(cellSize)
    console.log(mouseX, mouseY)
    let coordinate = [floor(mouseX/cellSize),floor(mouseY/cellSize)]
    console.log(coordinate)
}




function drawGrid(cellCount, canvasSize) {
    let cellSize = canvasSize/cellCount
    for (let row = 0 ; row < cellCount ; row++) {
        for (let col = 0 ; col < cellCount ; col++) {
            rect(col*cellSize,row*cellSize,100,100)
            /*
            TODO
            the game state is to be passed into this function so that
            it can be checked if the current row/col is filled, avail, or current player
            Depending on the result, a different render will occur
            */
        }
    }
}


/**
 * Stores the state of the game per level
 * @param {[]int} current - An array of integers of size 2 that contain the x and y position of player
 * @param {[][]int} filled - A 2d array of itegers that contain the x/y coordinates of filled in positions
 * @param {[][]int} available - A 2d array of itegers that contain the x/y coordinates of positions available to move to
 */
function GameState(size, current, filled, available) {
    //Fields
    this.size = size
    this.current = current
    this.filled = filled
    this.available = available
    //Assumption, filled and avail contain only arrays of size two of integers
    this.hasCoordinate = function(array, x, y) {
        for (let index = 0 ; index < array.length ; index++) {
            let avail = array[index]
            let search = [x,y]
            if (avail[0] == search[0] && avail[1] == search[1]) {
                return true
            }
        }
        return false
    }
}

/**
 * Returns the json object at the url
 * @param {String} url - The url containing the json file to GET
 */
//TODO error handling
function getJSONObject(url) {
    var jsonObject = null
    $.ajax({
      url: url,
      async: false,
      dataType: 'json',
      success: function (json) {
        jsonObject = json
      },
    });
    return jsonObject
}










function draw(){
    ellipse(mouseX, mouseY, 25, 25);
}

function drawRect(){
    rect(100,200,50,60)
}