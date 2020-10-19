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

function nearPosition(c1, c2) {
    return (samePosition([c1[0] + 1,c1[1]],c2)
    ||samePosition([c1[0] - 1,c1[1]],c2)
    ||samePosition([c1[0],c1[1] + 1],c2)
    ||samePosition([c1[0],c1[1] - 1],c2))
}

function getRGBA(r,g,b,a) {
    return "rgba(" + r.toString() + "," + g.toString() + "," +b.toString() + "," +a.toString() + ")"
}   

function draw(){
    cellSize = size/gameLevel.size

    for (let index = 0 ; index < gameLevel.grid.length ; index++) {
        let cell = gameLevel.grid[index]

        if (samePosition(cell.position, gameLevel.current)) {
            //Draw player position
            //todo figure out why changing current elsewhere doesn't change it here
            fill(color(getRGBA(255,140,0,cell.alpha)))
        } else if (gameLevel.isFilled(cell.position)) {
            //Draw wall 
            fill(color(getRGBA(0,0,0,cell.alpha)))
        } else if (gameLevel.current.length != 0 && nearPosition(gameLevel.current, cell.position)) {
            //Draw available move
            fill(color(getRGBA(0,150,0,cell.alpha)))
        } else {
            //Draw empty
            fill(color(getRGBA(255,255,255,cell.alpha)))
        }
        cell.alpha = cell.alpha + 0.04
        rect(cell.position[0] * cellSize, cell.position[1] * cellSize ,cellSize, cellSize)
    }
}

function playLevel(level) {
    var filledCells = level.walls
    let grid = initGrid(level.size)
    gameLevel = new GameState(grid,level.size,[],filledCells)
    
    /*
    TODO: check end level req.
    while (!(game.Level.gameOver || game.Level.gameWon)) {
        if game.Level.gameOver
            return false
        else if game.Level.gameWon
            return true
    }
    */

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

        if (!gameLevel.isFilled(coordinate)) {
            if (gameLevel.current.length == 0) {
                //Set first position
                gameLevel.setAlpha(coordinate, 0)
                gameLevel.current = coordinate
            } else {
                //Checking for pressing an available cell
                if (nearPosition(gameLevel.current,coordinate)) {
                    gameLevel.move(coordinate)
                }
            }
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
    
    this.isFilled = function(position) {
        for (let index = 0 ; index < this.filled.length ; index++) {
            let coordinate = this.filled[index]
            if (samePosition(coordinate, position)) {
                return true
            }
        }
        return false
    }
    this.fill = function(filled) {
        this.filled.push(filled)
    }
    this.setCurrent = function(newPosition) {
        this.current = newPosition
    }
    this.setAlpha = function(position, alpha) {
        for (let index = 0 ; index < this.grid.length ; index++) {
            let cell = this.grid[index]
            let coordinate = cell.position
            if (samePosition(position, coordinate)) {
                cell.alpha = alpha
            }
        }
    }
    this.move = function(coordinate) {
        if (samePosition(coordinate, [gameLevel.current[0] + 1, gameLevel.current[1]])) {
            console.log("right")
            for (x = gameLevel.current[0] ; x < gameLevel.size ; x++) {
                position = [x,gameLevel.current[1]]
                gameLevel.setAlpha(position, 0)
                if (x + 1 == gameLevel.size || gameLevel.isFilled([x+1, gameLevel.current[1]])) {
                    gameLevel.setCurrent(position)
                    break
                }
                gameLevel.fill(position)
            }
        } else if (samePosition(coordinate, [gameLevel.current[0] - 1, gameLevel.current[1]])) {
            console.log("left")
            for (x = gameLevel.current[0] ; x > -1 ; x--) {
                position = [x,gameLevel.current[1]]
                gameLevel.setAlpha(position, 0)
                if (x  == 0 || gameLevel.isFilled([x-1, gameLevel.current[1]])) {
                    gameLevel.setCurrent(position)
                    break
                }
                gameLevel.fill(position)
            }
        } else if (samePosition(coordinate, [gameLevel.current[0], gameLevel.current[1] + 1])) {
            console.log("down")
            for (y = gameLevel.current[1] ; y < gameLevel.size ; y++) {
                position = [gameLevel.current[0], y]
                gameLevel.setAlpha(position, 0)
                if (y + 1 == gameLevel.size || gameLevel.isFilled([gameLevel.current[0], y + 1])) {
                    gameLevel.setCurrent(position)
                    break
                }
                gameLevel.fill(position)
            }
        } else if (samePosition(coordinate, [gameLevel.current[0], gameLevel.current[1] - 1])) {
            console.log("up")
            for (y = gameLevel.current[1] ; y > -1 ; y--) {
                position = [gameLevel.current[0], y]
                gameLevel.setAlpha(position, 0)
                if (y == 0 || gameLevel.isFilled([gameLevel.current[0], y - 1])) {
                    gameLevel.setCurrent(position)
                    break
                }
                gameLevel.fill(position)
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