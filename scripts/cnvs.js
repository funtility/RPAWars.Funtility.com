var currentMemeIndex = 0;
var currentDirection = "";
var soundBite = null;
var advancing = false;
var memeSize = "";

var debug = function(msg){
    console.log(msg + ": memeSize = " + memeSize);
}

//#region Initialization

var go = function(canvasId){
    debug("initBgCanvas");
    window.addEventListener('resize', function(){
        resize();
    })
    initializePage(canvasId);
}

var initializePage = function(canvasId){
    debug("initializePage");
    resize();
}

//#endregion

//#region Starscape

var fillBlack = function(canvas,dims){
    debug("fillBlack");
    ctx = canvas.getContext('2d');
    ctx.fillSyle = "(0,0,0)";
    ctx.fillRect(0,0,dims[0],dims[1]);
}

var drawStars = function(canvas,dims){
    debug("drawStars");
    area = dims[0] * dims [1];
    count = Math.round(area * .005);
    ctx = canvas.getContext('2d');
    maxRadius = .95;
    endAngle = 2 * Math.PI;
    for(let i = 0; i < count; i++){
        x = Math.floor(Math.random() * dims[0]);
        y = Math.floor(Math.random() * dims[1]);
        radius = (Math.random() * maxRadius);
        ctx.beginPath();
        ctx.fillStyle = fillStyle(radius,maxRadius);
        ctx.arc(x,y,radius,0,endAngle,1);
        ctx.fill();
    }
}

var fillStyle = function(size, maxSize){
    debug("fillStyle");
    alpha = size/(maxSize*2);
    if (alpha >= .48 ) {
        chance = Math.random()
        if (chance > .8 ) {
            alpha = 1;
            if (chance > .97){
                return "RGBA(200,180,255,.8)";
            }
        }
    }
    return "RGBA(100,120,255," + alpha + ")";
}

//#endregion

//#region Resize

var resize = function() {
    debug("resize");
    canvas = document.getElementById("cnvs");
    dims = [
        4096,
        2160
    ];
    resizeCanvas(canvas,dims);
    fillBlack(canvas,dims);
    drawStars(canvas,dims);
}

var resizeCanvas = function(canvas,dims){
    debug("resizeCanvas");
    canvas.setAttribute("width",dims[0]);
    canvas.setAttribute("height",dims[1]);
}

//#endregion