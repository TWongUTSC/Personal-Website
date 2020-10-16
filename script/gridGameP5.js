/*
ABSTRACT CELL DETECTION PLAN
so i have my grid that has a number of cells and a total size in pixels

I can have a function, on click, when if pressed, I use the current x,y corrdinates of the mouse
to figure out which row and column index i am currently pressing.

I can use that to figure out whether or not the click was valid or not

I can use modulo(cell size) to find out which cell was pressed

For fading, use 
*/
var size
var gameLevel
function setup(){
    //Init
    size = 500
    var canvas = createCanvas(size, size);
    canvas.parent('gridContainer');
    frameRate(24);

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

function samePosition(c1, c2) {
    return (c1[0] == c2[0] && c1[1] == c2[1])
}

function getRGBA(r,g,b,a) {
    return "rgba(" + r.toString() + "," + g.toString() + "," +b.toString() + "," +a.toString() + ")"
}

function draw(){
    cellSize = size/gameLevel.size

    for (let index = 0 ; index < gameLevel.grid.length ; index++) {
        let cell = gameLevel.grid[index]

        
        /*
        check cell.position and see if its a player, wall, avail, none
        */
        if (samePosition(cell.position, gameLevel.current)) {
            cell.alpha = cell.alpha + 0.04
            fill(color(getRGBA(255,140,0,cell.alpha)))
        } else if (gameLevel.hasCoordinate(gameLevel.filled, cell.position)) {
            cell.alpha = cell.alpha + 0.04
            fill(color(getRGBA(0,0,0,cell.alpha)))
        } else {
            cell.alpha = cell.alpha + 0.04
            fill(color(getRGBA(255,255,255,cell.alpha)))
        }
        rect(cell.position[0] * cellSize, cell.position[1] * cellSize ,cellSize, cellSize)
    }





    /*
    TODO
    the game state is to be passed into this function so that
    it can be checked if the current row/col is filled, avail, or current player
    Depending on the result, a different render will occur
    */
}

function playLevel(level) {
    //todo change filled cells into just coordinates
    var filledCells = []
    for (let index = 0 ; index < level.walls.length ; index++) {
        filledCells.push(new Cell(level.walls[index], 0))
    }
    let grid = initGrid(level.size)
 
    gameLevel = new GameState(grid,level.size,[],filledCells)
    


    return true
}

function initGrid(gridSize) {
    var grid = []
    for (let row = 0 ; row < gridSize ; row++) {
        for (let col = 0 ; col < gridSize ; col++) {
            grid.push(new Cell([col, row], 0))
        }
    }

    return grid
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 500) {
        let cellSize = size/gameLevel.size
        let coordinate = [floor(mouseX/cellSize),floor(mouseY/cellSize)]
        console.log("Coordinate: " , coordinate)
    
        if (gameLevel.current.length == 0) {
            //todo check if first set position is wall
            //Set current
           
            gameLevel.current = coordinate
        } else {
            //TODO remove
            gameLevel.setAlpha(gameLevel.current[0],gameLevel.current[1], 0)
            gameLevel.current = coordinate
            gameLevel.setAlpha(gameLevel.current[0],gameLevel.current[1], 0)




            /*
            Other cases for:
            pressed on avail -> do a bunch of shit
            else do fuckin' NOTHING or maybe flash red idk
            */
        }
    }    
}



/**
 * Stores the state of the game per level
 * @param {[]int} size - The number of cells in a side of the square grid
 * @param {[]int} current - An array of integers of size 2 that contain the x and y position of player
 * @param {[]Cell} filled - An array of cells that refer to the filled in cells
 */
function GameState(grid, size, current, filled) {
    //Fields
    this.grid = grid
    this.size = size
    this.current = current
    this.filled = filled
    
    this.hasCoordinate = function(array, position) {
        for (let index = 0 ; index < array.length ; index++) {

            let coordinate = array[index].position
            if (samePosition(coordinate, position)) {
                return true
            }
        }
        return false
    }
    this.setAlpha = function(x, y, alpha) {
        for (let index = 0 ; index < this.grid.length ; index++) {
            let cell = this.grid[index]
            let coordinate = cell.position
            let search = [x,y]
            if (samePosition(search, coordinate)) {
                cell.alpha = alpha
            }
        }
    }
    this.getAlpha = function(array, x, y) {
        for (let index = 0 ; index < array.length ; index++) {

            let coordinate = array[index].position
            
            let search = [x,y]
            if (coordinate[0] == search[0] && coordinate[1] == search[1]) {
                return array[index].alpha
            }
        }
    }
}

function Cell(position, alpha) {
    this.position = position
    this.alpha = 0
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











function drawRect(){
    rect(100,200,50,60)
}