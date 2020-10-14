
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


function drawGrid() {
    //Create and place canvas
    var canvas = document.createElement("CANVAS")
    canvas.setAttribute("height", 500)
    canvas.setAttribute("width", 500)
    document.getElementById("gridContainer").appendChild(canvas)

    //Drawing grid
    context = canvas.getContext("2d")
    console.log(context)
    
    
    for (var x = 0; x <= 500; x += 100) {
        context.moveTo(x , 0);
        context.lineTo(x, 500 );

        context.moveTo(0 , x);
        context.lineTo(500, x );
    }

    context.strokeStyle = "black";
    context.stroke();


    /*

    
    var canvas = $('<canvas/>').attr({width: w, height: h}).appendTo('#gridContainer');
    var context = canvas.get(0).getContext("2d");

    for (var x = 0; x <= w; x += 100) {
        context.moveTo(x , 0);
        context.lineTo(x, h );
    }

    context.strokeStyle = "black";
    context.stroke();
    */
}