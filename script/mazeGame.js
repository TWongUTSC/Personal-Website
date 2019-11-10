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

Maze.prototype.handleButton = function (e) {
    var movePosition = new Position(this.playerPosition.x, this.playerPosition.y)
    if (e.key == "ArrowLeft") {
        movePosition.y--;
        console.log("Left")
    } else if (e.key == "ArrowRight") {
        console.log("Right")
        movePosition.y++;
    } else if (e.key == "ArrowUp") {
        console.log("Up")
        movePosition.x--;
    } else if (e.key == "ArrowDown") {
        console.log("Down")
        movePosition.x++;
    }

    if (this.validateMove(movePosition)) {
        //delete revealedWall class from surrounding
        this.unReveal(this.playerPosition)
        this.mazeArray[this.playerPosition.x][this.playerPosition.y].classList.remove("player");
        this.mazeArray[movePosition.x][movePosition.y].classList.add("player");
        this.playerPosition = movePosition;
        this.reveal(this.playerPosition);
        //add revealedWall class to surrounding
        console.log(this.playerPosition);
    } else {
        console.log("invalid move")
    }

    if (this.mazeArray[this.playerPosition.x][this.playerPosition.y].classList.contains("win")) {
        document.write("YOU WIN NERD")
    }



}

Maze.prototype.validateMove = function (movePosition) {
    /*
    Validate for boundary
     */
    if (movePosition.x === -1 || movePosition.x === this.maze.children.length ) {
        return false;
    } else if (movePosition.y === -1 || movePosition.y === this.maze.children[0].children.length) {
        return false;
    }

    if (this.mazeArray[movePosition.x][movePosition.y].classList.contains("wall")) {
        return false;
    }



    /*
    Validate for border
     */

    if (this.mazeArray[movePosition.x][movePosition.y].className === "border") {
        return false
    }


    /*
    OK
     */
    return true;
}

function Maze() {
    this.maze = document.getElementById("maze")
    this.mazeArray = new Array(this.maze.children.length);

    //Create array
    for (var i = 0 ; i < this.maze.children.length ; i++) {
        this.mazeArray[i] = new Array(this.maze.children[i].children.length);
    }
    this.playerPosition = {};

    //Fill array
    for (var i = 0; i < this.maze.children.length; i++) {
        for (var j = 0; j < this.maze.children[i].children.length; j++) {
            var divElement = this.maze.children[i].children[j];
            this.mazeArray[i][j] = divElement;
            if (divElement.className == "start") {
                this.playerPosition = new Position(i, j)
                this.mazeArray[i][j].classList.add("player")
            }
        }
    }
    this.keyPressHandler = this.handleButton.bind(this);
    document.addEventListener('keydown', this.keyPressHandler)
}

/*
need main maze function
    init variables method
    init maze

    add event for keydown
        method for checking key press
            method for trying move
                bump into path
                move
                    win?
                        stop game
 */