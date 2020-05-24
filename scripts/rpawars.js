var currentMemeIndex = 0;
var soundBite = null;
var advancing = false;

var debug = function(msg){
    console.log(msg);
}

//#region Initialization

var init = function(){
    debug("init");
    document.getElementById("header").style.marginTop = "-60";
    let content = document.getElementById("content");
    content.style.opacity = 0;
    
    permission = document.getElementById("permission");
    debug("permission");
    permission.addEventListener("click", function(){
        initializePage();
    })
}

var initializePage = function(){
    debug("initializePage");
    permission = document.getElementById("permission");
    permission.remove();
    let content = document.getElementById("content");
    content.style.opacity = 0;
    flyInAnim();
    initializeMeme();
    initializeController();
}

var initializeMeme = function() {
    debug("initializeMeme");
    let count = memes.length;
    currentMemeIndex = Math.floor(Math.random() * count);
    let meme = document.getElementById("meme");
    meme.removeAttribute("style");
    meme.style.backgroundImage = "url(" + imgUrl + memes[currentMemeIndex].frames[0].img + ")";
    meme.style.backgroundRepeat = "no-repeat";
    meme.style.backgroundPosition = "center";
}

var initializeController = function(){
    debug("initializeController");
    left = document.getElementById("left");
    right = document.getElementById("right");
    left.addEventListener('click', function(){advance("right");})
    right.addEventListener('click', function(){advance("left");})
}

//#endregion

//#region Animations

var flyInAnim = function(){
    debug("introAnim");
    let flyInSizePercent = 2;
    let step = .16;
    let ease = .918;
    let pcty = 1;

    let flyIn = document.getElementById("flyIn");
    let dims = [
        flyIn.clientWidth,
        flyIn.clientHeight
    ];
    flyIn.style.backgroundPosition = "center";
    flyIn.style.backgroundRepeat = "no-repeat";
    flyIn.style.backgroundSize = (dims[0] * flyInSizePercent) + "px " + (dims[1] * flyInSizePercent) + "px";
    flyIn.style.backgroundImage = "url(./images/rpawars/RPAWarsFlyIn.svg)";
    
    let introAnimId = setInterval(() => {
        if (flyInSizePercent > .06){
            flyInSizePercent -= step;
            step = step * ease;
            if (flyInSizePercent < .5) {
                pcty = pcty * .95
                flyIn.style.opacity = pcty;
            }
            
            flyIn.style.backgroundSize = (dims[0] * flyInSizePercent) + "px " + (dims[1] * flyInSizePercent) + "px";
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
    debug("headerAnim");
    window.clearInterval(introAnimId);
    let header = document.getElementById("header");
    let hdrMgnTp = -60;
    let intId = setInterval(() => {
        if (hdrMgnTp <= -1){
            hdrMgnTp = hdrMgnTp * .85;
            header.style.marginTop = hdrMgnTp;
        }
        else{
            header.removeAttribute("style");
            window.clearInterval(intId);
        }
    }, 50);
}

var controlsAnim = function(){
    debug("controlsAnim");
    let content = document.getElementById("content");
    let opacity = .00001;
    let intId = setInterval(() => {
        if (opacity < 1){
            opacity += .03;
            content.style.opacity = opacity;
        }
        else{
            content.removeAttribute("style");
            window.clearInterval(intId);
        }
    }, 50);
}

//#endregion

//#region Meme controls

var advance = function(direction){
    debug("advance");
    if (!advancing){
        advancing = true;

        let current = document.getElementById("meme");
        let parent = current.parentElement;
    
        getMeme(direction);
        // playSoundBite();
    
        let next = document.createElement("div");
        next.style.backgroundRepeat = "no-repeat";
        next.style.backgroundPosition = "center";
        next.style.backgroundImage = "url(" + imgUrl + memes[currentMemeIndex].frames[0].img + ")";
        next.style.opacity = 0;
        next.id = "meme";
        next.classList.add("meme");
        
        parent.appendChild(next);
    
        let cPcty = 1;
        let nPcty = 0;
        let step = .07;
        let intId = setInterval(() => {
            if (cPcty > 0){
                current.style.opacity = cPcty;
                cPcty -= step;
    
                next.style.opacity = nPcty;
                nPcty += step;
            } else {
                window.clearInterval(intId);
                current.remove();
                playMeme();
                advancing = false;
            }
        }, 50)
    }
}

var getMeme = function(direction){
    debug("getMeme");
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
    debug("playMeme");
    meme = memes[currentMemeIndex];
    let current = document.getElementById("meme");
    current.style.backgroundRepeat = "no-repeat";
    current.style.backgroundPosition = "center";
    let interval = 20;
    let frameNum = 0;
    let count = 0;
    let audioPlayed = false;
    let intId = setInterval(() => {
        if (frameNum < meme.frames.length){
            current.style.backgroundImage = "url(" + imgUrl + meme.frames[frameNum].img + ")";


            if (count < meme.frames[frameNum].frameDuration) {
                console.log(frameNum + " frameDuration: " + meme.frames[frameNum].frameDuration);
                if (!audioPlayed){
                    audioPlayed = true;
                    // console.log(JSON.stringify(meme));
                    // console.log(meme.frames[frameNum].aud);
                    playSoundBite(meme.frames[frameNum].aud);
                }
                count += interval;
            } else {
                audioPlayed = false;
                frameNum++;
                count = 0;
            }
        } else {
            window.clearInterval(intId);
        }
    }, interval)
}

var playSoundBite = function(fileName) {
    debug("playSoundBite");
    if (fileName !== ""){
        audioObj = new Audio(audUrl + fileName);
        let intId = setInterval(() => {
            if (audioObj.HAVE_FUTURE_DATA) {
                audioObj.play();
                window.clearInterval(intId);
            }
        }, 10)
    }
}

//#endregion