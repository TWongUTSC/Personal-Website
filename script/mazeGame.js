function Position (x, y) {
    this.x = x;
    this.y = y;
}

Maze.prototype.reveal = function (position) {
    var x = position.x;
    var y = position.y;

    //DOWN
    if (this.mazeArray[x + 1][y].classList.contains("wall")) {
        this.mazeArray[x + 1][y].classList.add("revealedWall")
    }
    //DOWN RIGHT
    if (this.mazeArray[x + 1][y + 1].classList.contains("wall")) {
        this.mazeArray[x + 1][y + 1].classList.add("revealedWall")
    }

    //UP
    if (this.mazeArray[x - 1][y].classList.contains("wall")) {
        this.mazeArray[x - 1][y].classList.add("revealedWall")
    }
    //UP RIGHT
    if (this.mazeArray[x - 1][y + 1].classList.contains("wall")) {
        this.mazeArray[x - 1][y + 1].classList.add("revealedWall")
    }

    //RIGHT
    if (this.mazeArray[x][y + 1].classList.contains("wall")) {
        this.mazeArray[x][y + 1].classList.add("revealedWall")
    }
    //UP RIGHT
    if (this.mazeArray[x - 1][y - 1].classList.contains("wall")) {
        this.mazeArray[x - 1][y - 1].classList.add("revealedWall")
    }
    //LEFT
    if (this.mazeArray[x][y - 1].classList.contains("wall")) {
        this.mazeArray[x][y - 1].classList.add("revealedWall")
    }
    //DOWN LEFT
    if (this.mazeArray[x + 1][y - 1].classList.contains("wall")) {
        this.mazeArray[x + 1][y - 1].classList.add("revealedWall")
    }
}

Maze.prototype.unReveal = function (position) {
    var x = position.x;
    var y = position.y;


    //UP
    if (this.mazeArray[x - 1][y].classList.contains("revealedWall")) {
        this.mazeArray[x - 1][y].classList.remove("revealedWall")
    }
    //UP RIGHT
    if (this.mazeArray[x - 1][y + 1].classList.contains("revealedWall")) {
        this.mazeArray[x - 1][y + 1].classList.remove("revealedWall")
    }
    //RIGHT
    if (this.mazeArray[x][y + 1].classList.contains("revealedWall")) {
        this.mazeArray[x][y + 1].classList.remove("revealedWall")
    }
    //DOWN RIGHT
    if (this.mazeArray[x + 1][y + 1].classList.contains("revealedWall")) {
        this.mazeArray[x + 1][y + 1].classList.remove("revealedWall")
    }
    //DOWN
    if (this.mazeArray[x + 1][y].classList.contains("revealedWall")) {
        this.mazeArray[x + 1][y].classList.remove("revealedWall")
    }
    //DOWN LEFT
    if (this.mazeArray[x + 1][y - 1].classList.contains("revealedWall")) {
        this.mazeArray[x + 1][y - 1].classList.remove("revealedWall")
    }
    //LEFT
    if (this.mazeArray[x][y - 1].classList.contains("revealedWall")) {
        this.mazeArray[x][y - 1].classList.remove("revealedWall")
    }
    //UP LEFT
    if (this.mazeArray[x - 1][y - 1].classList.contains("revealedWall")) {
        this.mazeArray[x - 1][y - 1].classList.remove("revealedWall")
    }
}

Maze.prototype.movePlayer = function (movePosition)  {
    if (this.gameStarted)  {
        this.mazeArray[this.playerPosition.x][this.playerPosition.y].classList.remove("player");
        this.mazeArray[movePosition.x][movePosition.y].classList.add("player");
        this.playerPosition = movePosition;
    }
}

Maze.prototype.handleButton = function (e) {
    //Set desired position
    var movePosition = new Position(this.playerPosition.x, this.playerPosition.y);
    if (e.key === "a" || e.key === "A") {
        movePosition.y--;
    } else if (e.key === "d" || e.key === "D") {
        movePosition.y++;
    } else if (e.key === "w" || e.key === "W") {
        movePosition.x--;
    } else if (e.key === "s" || e.key === "S") {
        movePosition.x++;
    }

    //Perform move
    if (this.validateMove(movePosition)) {
        //Disable if all walls revealed
        if (this.enabled) {
            this.unReveal(this.playerPosition)
        }
        this.movePlayer(movePosition)
        //Disable if all walls revealed
        if (this.enabled) {
            this.reveal(this.playerPosition);
        }
    }

    //Check win
    if (this.mazeArray[this.playerPosition.x][this.playerPosition.y].classList.contains("win")) {
        alert("You Win! Thanks for playing!");
        this.unReveal(this.playerPosition);
        this.movePlayer(this.startPosition);
    }
}

Maze.prototype.validateMove = function (movePosition) {
    //Check for exiting maze space
    if (movePosition.x === -1 || movePosition.x === this.maze.children.length ) {
        return false;
    } else if (movePosition.y === -1 || movePosition.y === this.maze.children[0].children.length) {
        return false;
    }
    //Check for walls
    if (this.mazeArray[movePosition.x][movePosition.y].classList.contains("wall")) {
        return false;
    }
    //Check for borders
    return this.mazeArray[movePosition.x][movePosition.y].className !== "border";
}


function Maze() {
    //Instantiate
    this.enabled = true; //Enables wall hiding / showing
    this.wallsHidden = true;
    this.playerPosition = {};
    this.startPosition = {};
    this.maze = document.getElementById("maze");
    this.mazeArray = new Array(this.maze.children.length);
    for (var i = 0 ; i < this.maze.children.length ; i++) {
        this.mazeArray[i] = new Array(this.maze.children[i].children.length);
    }

    //Fill array
    for (var i = 0; i < this.maze.children.length; i++) {
        for (var j = 0; j < this.maze.children[i].children.length; j++) {
            var divElement = this.maze.children[i].children[j];
            this.mazeArray[i][j] = divElement;
            if (divElement.className === "start") {
                this.startPosition = new Position(i, j);
                this.playerPosition = new Position(i, j);
                this.mazeArray[i][j].classList.add("player")
            }
        }
    }

    //Set up keypress handling
    this.keyPressHandler = this.handleButton.bind(this);
    document.addEventListener('keydown', this.keyPressHandler);

    //Set up show/hide button handling
    this.showhideButton = document.getElementById("showhideButton");
    this.showhideButtonHandler = this.showhideWalls.bind(this);
    this.showhideButton.addEventListener("click", this.showhideButtonHandler);

    //Set up restart button handling
    this.restartButton = document.getElementById("restartButton");
    this.restartButtonHandler = this.restart.bind(this);
    this.restartButton.addEventListener("click", this.restartButtonHandler);

    //Set up start button handling
    this.startButton = document.getElementById("mazeStartButton");
    this.startButtonHandler = this.startGame.bind(this);
    this.startButton.addEventListener("click", this.startButtonHandler);
}

Maze.prototype.revealWalls = function (e) {
    this.enabled = false;
    for (var i = 0 ; i < this.mazeArray.length ; i++) {
        for (var j = 0 ; j < this.mazeArray[i].length ; j++) {
            if (!this.mazeArray[i][j].classList.contains("revealedWall") && this.mazeArray[i][j].classList.contains("wall")) {
                this.mazeArray[i][j].classList.add("revealedWall")
            }
        }
    }
};

Maze.prototype.hideWalls = function (e) {
    this.enabled = true;
    for (var i = 0 ; i < this.mazeArray.length ; i++) {
        for (var j = 0 ; j < this.mazeArray[i].length ; j++) {
            if (this.mazeArray[i][j].classList.contains("revealedWall") && this.mazeArray[i][j].classList.contains("wall")) {
                this.mazeArray[i][j].classList.remove("revealedWall")
            }
        }
    }
    //Upon pressing hide walls again, surrounding should be revealed before having to make a move
    this.reveal(this.playerPosition);
};

Maze.prototype.showhideWalls = function(e) {
    this.showhideButton = document.getElementById("showhideButton");
    if (this.gameStarted) {
        if (this.wallsHidden) { //Shows walls
            this.showhideButton.innerText = "Hide"
            this.revealWalls(e)
            this.wallsHidden = false
        } else { //Hides walls
            this.showhideButton.innerText = "Show"
            this.hideWalls(e)
            this.wallsHidden = true
        }
    }
}

//Resets the player position to the beginning and hides walls
Maze.prototype.restart = function (e) {
    if (this.gameStarted) {
        this.enabled = true
        document.getElementById("showhideButton").innerHTML = "Show"
        this.resetMaze()
    }
}

Maze.prototype.resetMaze = function() {
    if (this.gameStarted) {
        for (var i = 0; i < this.maze.children.length; i++) {
            for (var j = 0; j < this.maze.children[i].children.length; j++) {
                var divElement = this.maze.children[i].children[j];
                this.mazeArray[i][j] = divElement;
                this.mazeArray[i][j].classList.remove("player")
                this.mazeArray[i][j].classList.remove("revealedWall")
                if (divElement.className === "start") {
                    this.playerPosition = new Position(i, j);
                    this.mazeArray[i][j].classList.add("player")
                }
            }
        }
    }
}

Maze.prototype.startGame = function() {
    this.gameStarted = true;
    document.getElementById("mazeStartButton").remove()
}
