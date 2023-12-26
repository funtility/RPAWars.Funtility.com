//#region Globals

let currentMemeIndex = 0;
let currentFrameIndex = 0;
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
        preloadMemes();
    }, 100);
}

var initializeMeme = function() {
    debug("initializeMeme");

    let next = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);

    content.appendChild(next);
    let nPcty = 0;
    let intId = setInterval(() => {        
        if (nPcty < 0){    
            next.style.opacity = nPcty;
            nPcty += step;
        } else {
            next.style.opacity = 1;
            advancing = false;
            window.clearInterval(intId);
        }
    }, 50)



    // let meme = document.getElementById("meme");
    // meme.removeAttribute("style");
    // meme.style.backgroundImage = "url(" + imgUrl + memes[currentMemeIndex].frames[0].img + ")";
}

var initializeControls = function(){
    debug("initializeControls");
    left = document.getElementById("left");
    right = document.getElementById("right");
    left.addEventListener('click', function(){
        advanceMeme("right");
    })
    right.addEventListener('click', function(){
        advanceMeme("left");
    })
}

//#endregion

//#region Animations

var startPage = function(){
    debug("startPage");
    flyInAnim();
    initializeMeme();
    initializeControls();
}

var flyInAnim = function(){
    debug("introAnim");

    playSoundBite("ThemeClip.mp3");

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
            //playMeme();
        }
    }, 50);
}

//#endregion

//#region Meme controls

var advanceMeme = function(direction) {
    debug("advanceMeme");
    if (!advancing){
        clearIntervals();
        advancing = true;
        let current = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);
        changeMemeIndex(direction);
        let next = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);
        fadeTransition(current,next,.05);
        preloadMemes();
        playMeme();
    }
}

var advanceFrame = function() {
    debug("advanceFrame");
    if (!advancing){
        advancing = true;
        let current = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);
        currentFrameIndex++;
        let next = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);
        fadeTransition(current,next,.25);
    }
}

var fadeTransition = function(current, next, step){
    debug("fadeTransition");
    content.appendChild(next);
    let nPcty = 0;
    let intId = setInterval(() => {        
        if (nPcty < 0){    
            next.style.opacity = nPcty;
            nPcty += step;
        } else {
            next.style.opacity = 1;
            stowElement(current);
            advancing = false;
            window.clearInterval(intId);
        }
    }, 50)
}

// var advance = function(direction = "frame", frameNum = 0){
//     debug("advance");
//     if (!advancing){
//         advancing = true;

//         let current = document.getElementById(currentMemeIndex + "_" + currentFrameIndex);
//         let step = .25;

//         if (direction !== "frame"){            
//             changeMemeIndex(direction);
//             //imgName = memes[currentMemeIndex].frames[0].img;
//             step = .05;
//         }
    
//         let next = document.getElementById(currentMemeIndex + "_" + frameNum);

//         // let next = document.createElement("div");
//         // next.style.backgroundRepeat = "no-repeat";
//         // next.style.backgroundPosition = "center";
//         // next.style.backgroundImage = "url(" + imgUrl + imgName + ")";
//         // next.style.opacity = 0;
//         // next.id = "meme";
//         // next.classList.add("meme");
        
//         content.appendChild(next);
    
//         // let cPcty = 1;
//         let nPcty = 0;
//         let intId = setInterval(() => {        
//             if (nPcty < 0){    
//                 next.style.opacity = nPcty;
//                 nPcty += step;
//             } else {
//                 next.style.opacity = 1;
//                 window.clearInterval(intId);
//                 current.remove();
//                 advancing = false;
//                 if(direction !== "frame")playMeme();
//             }
//         }, 50)
//     }
// }

var changeMemeIndex = function(direction){
    debug("changeMemeIndex");
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
    currentFrameIndex = 0;
}

var playMeme = function(){
    debug("playMeme");
    let meme = memes[currentMemeIndex];
    let count = 0;
    let interval = 20;
    // let nextFrame = false;
    let playAud = true;
    intervalIds.push(setInterval(() => {
        if (currentFrameIndex < meme.frames.length){
            if (count > meme.frames[currentFrameIndex].dur && currentFrameIndex < meme.frames.length - 1){
                count = 0;
                playAud = true;
                advanceFrame();
            } else {
                if (playAud){
                    playSoundBite(meme.frames[currentFrameIndex].aud);
                    playAud = false;
                }
                count += interval;
            }


















            //     //debug("setting image");
            //     if (currentFrameIndex > 0){
            //         //advance(null, meme.frames[frameNum].img);
            //         advanceFrame(frameNum);
            //     } 
            //     // else {
            //     //     current.style.backgroundImage = "url(" + imgUrl + meme.frames[frameNum].img + ")";
            //     // }
            //     setImage = false;
            // }

            // if (count < meme.frames[frameNum].dur) {
            //     //debug(frameNum + " dur: " + meme.frames[frameNum].dur);
            //     if (playAud){
            //         playAud = false;
            //         playSoundBite(meme.frames[frameNum].aud);
            //         if (frameNum === meme.frames.length - 1 ) {
            //             clearIntervals();
            //         }
            //     }
            //     count += interval;
            // } else {
            //     setImage = true;
            //     playAud = true;
            //     frameNum++;
            //     count = 0;
            // }
        } else {
            //playSoundBite(meme.frames[0].aud);
            clearIntervals();
        }
    }, interval))
}

// var playMemeFrame = function() {
//     debug("playMemeFrame");

// }

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

var preloadMemes = function() {
    debug("preloadMemes");
    let prev = currentMemeIndex == 0 ? memes.length - 1 : currentMemeIndex - 1;
    let next = currentMemeIndex == memes.length - 1 ? 0 : currentMemeIndex + 1;
    [prev,currentMemeIndex,next].forEach((i) => preloadMeme(i));
}

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
            frameDiv.dataset.memeId = memeIndex;
            frameDiv.classList.add("meme");
            frameDiv.style.backgroundImage = "url(" + imgUrl + meme.frames[i].img + ")";
            frameDiv.style.opacity = 0;
            frameDiv.id = memeIndex + "_" + i;
            memeDiv.appendChild(frameDiv);
        }
    }
}

var stowElement = function(ele){
    debug("stowElement");
    let meme = document.getElementById(ele.dataset.memeId);
    ele.style.opacity = 0;
    meme.appendChild(ele);
}

var clearIntervals = function(){
    debug("clearIntervals");
    let del = function(id) {window.clearInterval(id);}
    intervalIds.forEach(id => del(id));
    intervalIds = [];
}

//#endregion