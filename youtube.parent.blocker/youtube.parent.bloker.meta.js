// ==UserScript==
// @name         Youtube Parent Blocker
// @namespace    https://bitbucket.org/NSq1/
// @version      0.8.0
// @description  Blocks youtube and requires someone else to unlock any video
// @author       NSq1
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/channel*
// @grant        none
// ==/UserScript==

//wywalić odtwarzanie video na channel
window._pause=true;
window._oldURL="";

window.noAutoPlay = function(){
    try {
        if (document.getElementById('ink')!==null && document.getElementById('ink').outerHTML.indexOf("checked") > 0){
            document.getElementById('ink').click();
        } else {

        }
    }
    catch (e) {
        //    console.log(e);
    }
};

window.pause = function(){
    //console.log("pause");
    try {
        if (window._pause){
            if (document.getElementsByClassName('ytp-play-button ytp-button').length > 0 && document.getElementsByClassName('ytp-play-button ytp-button')[0].outerHTML.indexOf('Pause') > 0){
                document.getElementsByClassName('ytp-play-button ytp-button')[0].click();
            }
            window.setTimeout(function(){window.pause();},100);
        }
    }
    catch (e){
        // console.log(e);
    }
}

window.play = function(){
    try {
        if (document.getElementsByClassName('ytp-play-button ytp-button').length > 0 && document.getElementsByClassName('ytp-play-button ytp-button')[0].outerHTML.indexOf('Play') > 0){
            document.getElementsByClassName('ytp-play-button ytp-button')[0].click();
            window._pause=false;
        }
    }
    catch (e){
        // console.log(e);
    }
}

window.delock = function(){
    if (unlocker(document.getElementById('blockerCode').value)){
        window.blockerDiv().hidden=true;
        document.getElementById('content').hidden=false;
        window.play();
    }
}

window.blockerDiv = function(){
    if (document.getElementById('blocker')!==null){
        return document.getElementById('blocker').parentElement;
    }
    newDiv = document.createElement("div");
    newDiv.innerHTML = `
<div id="blocker" style="font-size: xx-large;">
    <h1 style="color: white; text-align: center;">Blokada rodzicielska</h1><br/>
    <h2 style="color: white; text-align: center;">
        <span>Wpisz kod: </span>
        <input id="blockerCode" type="password" style="font-size: larger;" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" onkeyup="delock()" maxlength="6" size="6"/>
        <button onclick="delock()" style="font-size: larger;">ODBLOKUJ</button>
    </h2>
</div>`;
    return newDiv;
}

window.hidePlayer = function(){
    if (document.getElementById('content')!==null){
        if (document.getElementById('content').hidden!=true){
            document.getElementById('content').hidden=true;
            document.getElementById('content').parentElement.appendChild(window.blockerDiv());
            window.blockerDiv().hidden=false;
            document.getElementById('blockerCode').value=null;
            window.pause();
        }
    } else {
        window.setTimeout(function(){document.hidePlayer()},100);
    }
}

window.unlocker = function(passcode){
    let salt = '22';
    let today = new Date();
    let day = today.getDate();
    let minutes = today.getMinutes();
    let actual = Number.parseInt(`${salt}${day<10?'0'+day:day}${minutes<10?'0'+minutes:minutes}`);
    let expected = Number.parseInt(passcode);
    return (actual <= (expected + 1)) && (actual >= (expected - 1))
}

window.purge = function(){
    [
        document.getElementById('secondary'),
        document.getElementById('comments'),
        document.getElementById('container'),
        document.getElementById('contentContainer'),
        document.getElementById('iv-drawer'),
        document.getElementById('subscribe-button'),
    ].forEach(function(item){
        if (item!==null) item.innerHTML=""
    });
    [
        document.getElementById('subscribe-button'),
        document.getElementById('menu-container')
    ].forEach(function(item){
        if (item!==null) item.parentNode.removeChild(item);
    });
    [
        document.getElementsByClassName('video-ads'),
        document.getElementsByClassName('super-title style-scope ytd-video-primary-info-renderer'),
        document.getElementsByClassName('ytp-upnext'),
        document.getElementsByClassName('html5-endscreen'),
        document.getElementsByClassName('ytp-ce-element')
    ].forEach(function(itemTree){
        for (let item of itemTree){
            if (item!==null && item.parentNode!==undefined) item.parentNode.removeChild(item);
        }
    });
};

(function() {
    window.hidePlayer();
    window.noAutoPlay();
    window.purge();
    window.setInterval(function(){
        window.purge();
        window.noAutoPlay();
        if (window._oldURL!==window.location.href){
            window._pause=true;
            window.hidePlayer();
            window._oldURL=window.location.href;
        }
    }, 1000);
})();
