let introDone = false;

var initBgCanvas = function(canvasId){
    window.addEventListener('resize', function(){
        drawStarScape(canvasId);
    })
    drawStarScape(canvasId);
    if (introDone){
        //keep the margin top style for the header
        //keep the current meme open in its current state
    }
}

var drawStarScape = function(canvasId){
    canvas = document.getElementById(canvasId);
    parent = canvas.parentElement;
    dims = [
        parent.clientWidth,
        parent.clientHeight
    ];
    sizeCanvas(canvas,dims);
    fillBlack(canvas,dims);
    drawStars(canvas,dims);
    introAnim(canvas);
}

var sizeCanvas = function(canvas,dims){
    canvas.setAttribute("width",dims[0]);
    canvas.setAttribute("height",dims[1]);
}

var fillBlack = function(canvas,dims){
    ctx = canvas.getContext('2d');
    ctx.fillSyle = "(0,0,0)";
    ctx.fillRect(0,0,dims[0],dims[1]);
}

var drawStars = function(canvas,dims){
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

var introAnim = function(canvas){
    let dims = [
        canvas.clientWidth,
        canvas.clientHeight - 10
    ];

    let header = document.getElementById("header");
    let hdrMgnTp = -60;
    header.setAttribute("style","margin-top:" + hdrMgnTp + "px;")

    let flyIn = document.getElementById("flyInLogo");  
    let styleBase = "width:" + dims[0] + "px;height:" + dims[1] + "px;";
    
    let flyInSizePercent = .90;
    let opacity = 1;
    let intId = setInterval(() => {
        if (flyInSizePercent > 0){
            let bgs = "background-size:" + (dims[0] * flyInSizePercent) + "px " + (dims[1] * flyInSizePercent) + "px;";
            flyInSizePercent -= .008;
            if (flyInSizePercent < .4) {
                opacity = opacity * .93
            }
            let ops = "opacity:" + opacity + ";";
            flyIn.setAttribute("style",styleBase + bgs + ops);
        }
        else {
            window.clearInterval(intId);
            flyIn.remove();
            headerAnim();
        }
    }, 80);
}

var headerAnim = function(){
    let header = document.getElementById("header");
    let hdrMgnTp = -60;
    let intId = setInterval(() => {
        if (hdrMgnTp <= -1){
            hdrMgnTp = hdrMgnTp * .9;
            header.setAttribute("style","margin-top:" + hdrMgnTp + "px;");
            console.log("info");
        }
        else{
            window.clearInterval(intId);
        }
    }, 80);
}