//#region Globals

let currentMemeIndex = 0;
let advancing = false;
let intervalIds = [];
let imgUrl = "./images/memes/";
let audUrl = "./sounds/";
let audioObj = new Audio();
let content; // document.getElementById("content");
let cache; // document.createElement("cache");

////#endregion

var debug = function(msg){
    console.log(msg);
}

//#region Initialization

var init = function(){
    debug("init");
    document.getElementById("header").style.marginTop = "-60";
    content = document.getElementById("content");
    content.style.opacity = 0;
    cache = document.getElementById("cache");
    
    permission = document.getElementById("permission");
    permission.addEventListener("click", function(){
        permission.remove();
        startPage();
    })
    setTimeout(() => {
        preloadMeme(0);
    }, 100);
}

// var initializeMeme = function() {
//     debug("initializeMeme");
//     let meme = document.getElementById("meme");
//     meme.removeAttribute("style");
//     meme.style.backgroundImage = "url(" + imgUrl + memes[currentMemeIndex].frames[0].img + ")";
// }

var initializeController = function(){
    debug("initializeController");
    left = document.getElementById("left");
    right = document.getElementById("right");
    left.addEventListener('click', function(){
        clearIntervals();
        advance("right");
    })
    right.addEventListener('click', function(){
        clearIntervals();
        advance("left");
    })
}

//#endregion

//#region Animations

var startPage = function(){
    debug("startPage");
    flyInAnim();
    // initializeMeme();
    initializeController();
}

var flyInAnim = function(){
    debug("introAnim");

    //playSoundBite("ThemeClip.mp3");

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
    
    let intId = setInterval(() => {
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
            window.clearInterval(intId);
            headerAnim();
            controlsAnim();
            // setTimeout(() => {
            //     playMeme();
            // }, 2000);
        }
    }, 80);
}

var headerAnim = function(){
    debug("headerAnim");
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
    let opacity = .00001;
    let intId = setInterval(() => {
        if (opacity < 1){
            opacity += .03;
            content.style.opacity = opacity;
        }
        else{
            content.removeAttribute("style");
            window.clearInterval(intId);
            playMeme();
        }
    }, 50);
}

//#endregion

//#region Meme controls

var advance = function(direction, imgName = false){
    debug("advance");
    if (!advancing){
        advancing = true;
        let nextMeme = false;

        let current = document.getElementById("meme");
        let step = .25;

        if (!imgName){            
            changeMemeIndex(direction);
            imgName = memes[currentMemeIndex].frames[0].img;
            step = .05;
            nextMeme = true;
        }
    
        let next = document.createElement("div");
        // next.style.backgroundRepeat = "no-repeat";
        // next.style.backgroundPosition = "center";
        next.style.backgroundImage = "url(" + imgUrl + imgName + ")";
        next.style.opacity = 0;
        next.id = "meme";
        next.classList.add("meme");
        
        content.appendChild(next);
    
        // let cPcty = 1;
        let nPcty = 0;
        let intId = setInterval(() => {        
            if (nPcty < 0){    
                next.style.opacity = nPcty;
                nPcty += step;
            } else {
                next.style.opacity = 1;
                window.clearInterval(intId);
                current.remove();
                advancing = false;
                if(nextMeme)playMeme();
            }
        }, 50)
    }
}

var changeMemeIndex = function(direction){
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
    // current.style.backgroundRepeat = "no-repeat";
    // current.style.backgroundPosition = "center";
    let interval = 20;
    let frameNum = 0;
    let count = 0;
    let setImage = true;
    let playAud = true;
    intervalIds.push(setInterval(() => {
        if (frameNum < meme.frames.length){
            if (setImage) {
                debug("setting image");
                if (frameNum > 0){
                    advance(null, meme.frames[frameNum].img);
                } else {
                    current.style.backgroundImage = "url(" + imgUrl + meme.frames[frameNum].img + ")";
                }
                setImage = false;
            }

            if (count < meme.frames[frameNum].dur) {
                debug(frameNum + " dur: " + meme.frames[frameNum].dur);
                if (playAud){
                    playAud = false;
                    playSoundBite(meme.frames[frameNum].aud);
                    if (frameNum === meme.frames.length - 1 ) {
                        clearIntervals();
                    }
                }
                count += interval;
            } else {
                setImage = true;
                playAud = true;
                frameNum++;
                count = 0;
            }
        } else {
            clearIntervals();
            //window.clearInterval(intId);
        }
    }, interval))
}

var playSoundBite = function(fileName) {
    debug("playSoundBite");
    audioObj.pause();
    if (fileName !== ""){
        audioObj = new Audio(audUrl + fileName);
        if (audioObj.HAVE_FUTURE_DATA) {
            audioObj.play();
            //audioObj = null;
        }
        // let intId = setInterval(() => {
        //     if (audioObj.HAVE_FUTURE_DATA) {
        //         audioObj.play();
        //         audioObj = null;
        //         window.clearInterval(intId);
        //     } else {
        //         debug("clearing audioObj");
        //     }
        // }, 10)
    }
}

//#endregion

//#region Resource management

var preloadMeme = function(memeIndex) {
    debug("preloadMeme");
    let memeDiv = document.getElementById(memeIndex);
    if (!memeDiv){
        let meme = memes[memeIndex];
        memeDiv = document.createElement("div");
        memeDiv.id = memeIndex;
        cache.appendChild(memeDiv);
        for (let i = 0; i < meme.frames.length; i++){
            let frameDiv = document.createElement("div");
            frameDiv.classList.add("meme");
            frameDiv.style.backgroundImage = "url(" + imgUrl + meme.frames[i].img + ")";
            frameDiv.style.opacity = 0;
            memeDiv.appendChild(frameDiv);
        }
    }
}

var clearIntervals = function(){
    debug("clearIntervals");
    let del = function(id) {window.clearInterval(id);}
    intervalIds.forEach(id => del(id));
    intervalIds = [];
}

//#endregion