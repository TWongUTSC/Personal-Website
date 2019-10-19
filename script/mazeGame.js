function Position (x, y) {
    this.x = x;
    this.y = y;
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
    /*
    this.mazeArray[this.playerPosition].classList.remove("player");
    this.mazeArray[this.playerPosition].classList.add("path");

    this.mazeArray[movePosition].classList.add("player");
    this.mazeArray[movePosition].classList.remove("path");
     */

    this.mazeArray[this.playerPosition.x][this.playerPosition.y].classList.remove("player");
    this.mazeArray[movePosition.x][movePosition.y].classList.add("player");
    this.playerPosition = movePosition;
    console.log(this.playerPosition);



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
    //console.log(this.mazeArray[this.playerPosition]);

    /*
    for (var i = 0; i < this.maze.children.length; i++) {
        for (var j = 0; j < this.maze.children[i].children.length; j++) {
            var position = new Position(i,j);
            console.log(this.mazeArray[position])
        }
    }

     */

    console.log("Bye")
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
                bump into wall
                move
                    win?
                        stop game
 */