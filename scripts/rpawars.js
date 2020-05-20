var currentMemeIndex = 0;
var currentDirection = "";
var soundBite = null;
var advancing = false;

//#region Initialization

var initBgCanvas = function(canvasId){
    window.addEventListener('resize', function(){
        resize();
    })
    initializePage(canvasId);
}

var initializePage = function(canvasId){
    let content = document.getElementById("content");
    content.setAttribute("style","opacity:0;");
    resize();
    introAnim(canvas);
    initializeController();
    initializeMeme();
}

var initializeMeme = function() {
    let count = memes.length;
    currentMemeIndex = Math.floor(Math.random() * count);
    let meme = document.getElementById("meme");
    meme.setAttribute("style", "background:url(" + memes[currentMemeIndex].frames[0].url + ") no-repeat center;")
}

var initializeController = function(){
    left = document.getElementById("left");
    right = document.getElementById("right");
    left.addEventListener('click', function(){advance("right");})
    right.addEventListener('click', function(){advance("left");})
}

//#endregion

//#region Starscape

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

//#endregion

//#region Animations

var introAnim = function(){
    canvas = document.getElementById("starscape");
    let dims = [
        canvas.clientWidth,
        canvas.clientHeight
    ];

    let header = document.getElementById("header");
    let hdrMgnTp = -60;
    header.setAttribute("style","margin-top:" + hdrMgnTp + "px;")

    let flyIn = document.getElementById("flyInLogo");  
    let styleBase = "width:" + (dims[0] - 10) + "px;height:" + (dims[1] - 10) + "px;";
    
    let flyInSizePercent = 2;
    let step = .16;
    let ease = .918;
    let opacity = 1;
    let introAnimId = setInterval(() => {
        if (flyInSizePercent > .06){
            let bgs = "background-size:" + (dims[0] * flyInSizePercent) + "px " + (dims[1] * flyInSizePercent) + "px;";
            flyInSizePercent -= step;
            step = step * ease;
            if (flyInSizePercent < .5) {
                opacity = opacity * .95
            }
            let ops = "opacity:" + opacity + ";";
            flyIn.setAttribute("style",styleBase + bgs + ops);
        }
        else {
            flyIn.remove();
            headerAnim(introAnimId);
            controlsAnim();
            setTimeout(() => {
                playMeme();
            }, 2000);
        }
    }, 80);
}

var headerAnim = function(introAnimId){
    window.clearInterval(introAnimId);
    let header = document.getElementById("header");
    let hdrMgnTp = -60;
    let intId = setInterval(() => {
        if (hdrMgnTp <= -1){
            hdrMgnTp = hdrMgnTp * .85;
            header.setAttribute("style","margin-top:" + hdrMgnTp + "px;");
        }
        else{
            window.clearInterval(intId);
        }
    }, 50);
}

var controlsAnim = function(){
    let content = document.getElementById("content");
    let opacity = .00001;
    let intId = setInterval(() => {
        if (opacity < 1){
            opacity += .03;
            content.setAttribute("style","opacity:" + opacity + ";");
        }
        else{
            content.setAttribute("style","opacity:1;");
            window.clearInterval(intId);
        }
    }, 50);
}

//#endregion

//#region Resize

var resize = function() {
    canvas = document.getElementById("starscape");
    parent = canvas.parentElement;
    dims = [
        parent.clientWidth,
        parent.clientHeight
    ];
    resizeMeme();
    resizeCanvas(canvas,dims);
    fillBlack(canvas,dims);
    drawStars(canvas,dims);
}

var resizeCanvas = function(canvas,dims){
    canvas.setAttribute("width",dims[0]);
    canvas.setAttribute("height",dims[1]);
}

var resizeMeme = function(){
    //console.log("resizeMeme");
    content = document.getElementById("content");
    // parent = content.parentElement;
    // let width = parent.clientWidth *.8;
    // let height = width * .4301821335646;
    // meme = document.getElementById("meme");
    // meme.setAttribute("style","background-size:" + width + "px " + height + "px;");
}

//#endregion

//#region Meme controls

var advance = function(direction){
    if (!advancing){
        advancing = true;
        let current = document.getElementById("meme");
        let width = current.clientWidth;
        let cBg = "background:url(" + memes[currentMemeIndex].frames[0].url + ") no-repeat center;";
    
        getMeme(direction);
        playSoundBite();
        currentDirection = direction;
    
        let next = document.createElement("div");
        let nBg  = "background:url(" + memes[currentMemeIndex].frames[0].url + ") no-repeat center;";
        next.setAttribute("style","opacity:0;");
        next.setAttribute("id","meme");
        next.classList.add("meme");
        
        let parent = current.parentElement;
        parent.appendChild(next);
    
        let cPcty = 1;
        let nPcty = 0;
        let intId = setInterval(() => {
            if (cPcty > 0){
                cPcty -= .05;
                cMargin = "margin-" + direction + ":-" + (width * nPcty) + ";";
                cFade = "opacity:" + cPcty + ";";
                current.setAttribute("style", cBg + cMargin + cFade);
    
                nPcty += .1;
                nMargin = "margin-" + direction + ":" + (width * cPcty) + ";";
                nFade = "opacity:" + nPcty + ";";
                next.setAttribute("style", nBg + nMargin + nFade);
            } else {
                next.setAttribute("style", nBg);
                window.clearInterval(intId);
                current.remove();
                playMeme();
                advancing = false;
            }
        }, 50)
    }
}

var getMeme = function(direction){
    let count = memes.length;
    if (direction == "right"){
        if (currentMemeIndex == 0){ 
            currentMemeIndex = count - 1;
        } else {
            currentMemeIndex--;
        }
    } else {
        if (currentMemeIndex == count - 1){ 
            currentMemeIndex = 0;
        } else {
            currentMemeIndex++;
        }
    }
}

var playMeme = function(){
    meme = memes[currentMemeIndex];
    let current = document.getElementById("meme");
    let interval = 10;
    let frameNum = 0;
    let count = 0;
    let intId = setInterval(() => {
        if (frameNum < meme.frames.length){
            let cBg = "background:url(" + meme.frames[frameNum].url + ") no-repeat center;";
            current.setAttribute("style", cBg);
            if (count < meme.frames[frameNum].time) {
                count += interval;
            } else {
                frameNum++;
                count = 0;
            }
        } else {
            window.clearInterval(intId);
        }
    }, interval)
}

var playSoundBite = function() {
    randSound = Math.floor(Math.random() * sounds.length);
    audioObj = new Audio(sounds[randSound].url);
    let intId = setInterval(() => {
        if (audioObj.HAVE_FUTURE_DATA) {
            audioObj.play();
            window.clearInterval(intId);
        }
    }, 10)
}

//#endregion