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
var levels
var currentLevel
var levelStarted
var gameStarted
var gameFinished
function setup(){
    //Init
    size = 500
    var canvas = createCanvas(size, size);
    canvas.parent('gridContainer');
    frameRate(24);

    //Get config containing level information
    config = getJSONObject("https://raw.githubusercontent.com/TerryCLAWong/Personal-Website/grid-game/gridGameConfig.json")
    levels = config.levels
    currentLevel = 0
    levelStarted = false
    gameStarted = false
    gameFinished = false

    //Text init
    textStyle(BOLD)
    textFont('Montserrat');
    textSize(50)
    textAlign(CENTER)
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

function renderStartScreen() {
    fill(15,15,17)
    text("Click to Start!",250,250)
}

function renderLevelLost() {
    fill(255,255,255)
    background(color("rgba(0,0,0,0.8)"))
    text("Try again!",250,240)
    text("Click to continue",250,290)
    noLoop()
}

function renderLevelWon() {
    fill(255,255,255)
    background(color("rgba(0,0,0,0.8)"))
    text("Good Job!",250,240)
    text("Click to continue",250,290)
    noLoop()
}

function renderGameFinished() {
    fill(255,255,255)
    background(color("rgba(0,0,0,0.8)"))
    text("You Win!",250,240)
    text("Click to restart",250,290)
    noLoop()
}

function draw(){
    if (!gameStarted) {
        /*
        Setup inits game started as false
        When false, only render the start screen
        When mouse is pressed, the game starts 
        */
        renderStartScreen()
    } else if (!levelStarted) {
        /*
        Set up inits this as false
        When false, that means that the level has no started yet
        When the game has started but the level hasn't, the level starts
        Value set to true and the gameLevel is initialized
        */
        playLevel(levels[currentLevel])
        console.log("Started level:", currentLevel)
        
        levelStarted = true
    } else if (gameLevel.won) { //TODO replace levelLost with field within GameState
        console.log("current level is" , currentLevel)
        
        if (currentLevel == levels.length - 1) {
            gameFinished = true
            renderGameFinished()
        } else {
            renderLevelWon()
        }
    } else if (gameLevel.stuck) {
        renderLevelLost()
    } else {
        //Draw only when not stuck
        renderGrid()
    }
    
    
    
}

function renderGrid() {

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
            //Draw available moves  
            fill(color(getRGBA(120,255,120,cell.alpha)))
        } else {
            //Draw empty
            fill(color(getRGBA(255,255,255,cell.alpha)))
        }
        cell.alpha = cell.alpha + 0.04
        rect(cell.position[0] * cellSize, cell.position[1] * cellSize ,cellSize, cellSize)
    }
}

function playLevel(level) {
    var filledCells = Array.from(level.walls) //Copying array in js is by reference
    let grid = initGrid(level.size)
    gameLevel = new GameState(grid,level.size,[],filledCells, false, false)
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
    //Clicking within screen
    if (mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 500) {
        if (mouseButton === RIGHT) {
            //Restart level
            playLevel(levels[currentLevel])
        } else if (mouseButton == LEFT) {
            if (!gameStarted) {
                //Start game
                gameStarted = true
            } else if (gameLevel.won) {
                //Level won
                if (currentLevel < levels.length - 1) {
                    //Iterate current level
                    currentLevel ++
                    levelStarted = false
                } else {
                    //Restart game
                    currentLevel = 0
                    levelStarted = false
                    gameFinished = true
                }
                loop()
            } else if (gameLevel.stuck) {
                //Level lost
                levelLost = false
                levelStarted = false
                loop()
            } else {
                //Perform game action
                let cellSize = size/gameLevel.size
                let coordinate = [floor(mouseX/cellSize),floor(mouseY/cellSize)]
                //Only 
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


    }    
}


//TODO update documentation for params
/**
 * Stores the state of the game per level
 * @param {[]int} size - The number of cells in a side of the square grid
 * @param {[]int} current - An array of integers of size 2 that contain the x and y position of player
 * @param {[]Cell} filled - An array of cells that refer to the filled in cells
 */
function GameState(grid, size, current, filled, won, stuck) {
    //Fields
    this.grid = grid
    this.size = size
    this.current = current
    this.filled = filled
    this.won = won
    this.stuck = stuck
    
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
    this.checkWon = function() {
       this.won = (this.filled.length == this.size * this.size - 1)
    }
    this.checkStuck = function() {
        this.stuck = (
            //Check if the next cell is either filled or out of bounds
            //Right
            (this.isFilled([this.current[0] + 1, this.current[1]]) || this.current[0] + 1 == this.size)
            &&
            //Left
            (this.isFilled([this.current[0] - 1, this.current[1]]) || this.current[0] == 0)
            &&
            //Down
            (this.isFilled([this.current[0], this.current[1] + 1]) || this.current[1] + 1 == this.size)
            &&
            //Up
            (this.isFilled([this.current[0], this.current[1] - 1]) || this.current[1] == 0)
        )
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
            //Moving right
            /*
            Checking all cells right of the current position
            If the next cell is out of bounds or filled, stop and place current
            Else fill the cell
            */
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
            //Moving left
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
            //Moving down
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
            //Moving up
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

        
        //TODO remove testing print
        this.checkStuck()
        this.checkWon()
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

/*
FEATURES TO ADD
right click or press R to restart
*/