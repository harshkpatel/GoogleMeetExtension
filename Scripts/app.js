/*
    app.js
    content script for all features of extension to interact with the page uses socket.io to interect between multiple users and jquery
    to inject html into the javascript on the website
    Harsh Patel
*/

//For Push to Talk
chrome.storage.sync.get(null, function (settings) {
    if (settings.ptt == true) { //check if they have it enabled
        document.addEventListener('readystatechange', event => {
            if (document.readyState === 'complete' && document.title !== 'Meet') {
                document.addEventListener('keydown', function (event) { //checks if they are in google meet
                    const micVidButton = document.querySelectorAll('[jsname="BOHaEe"]');
                    if (event.key === settings.key && micVidButton[0].dataset.isMuted === 'true' && !event.repeat) {
                        event.preventDefault();
                        micVidButton[0].click();
                    }
                })
                document.addEventListener('keyup', function (event) { //unmutes when they release the key
                    const micVidButton = document.querySelectorAll('[jsname="BOHaEe"]');
                    if (event.key === settings.key && micVidButton[0].dataset.isMuted === 'false') {
                        event.preventDefault();
                        setTimeout(() => micVidButton[0].click(), 200);
                    }
                })
            }
        })
    }
});
//mute when changing tabs
chrome.storage.sync.get(null, function (settings) {
    if (settings.mt == true)
        //checks if they change tabs
        document.addEventListener("visibilitychange", event => {
            if (document.title !== 'Meet' && document.hidden) {
                const muteTab = document.querySelectorAll('[jsname="BOHaEe"]');
                if (muteTab[0] && muteTab[0].dataset.isMuted === 'false') {
                    muteTab[0].click();
                }
            }
        })
    }
);

//function to display message from server to users in meet
function displayOutput(socket) {
    let caseHolder = document.createElement('div');
    caseHolder.id = "case"
    document.body.prepend(caseHolder);
    socket.on('message', function (data) {
        let newMessage = document.createElement('div');
        newMessage.id = "userMessage";

        let newImg = document.createElement('img');
        newImg.src = chrome.extension.getURL(data.icon);
        newMessage.appendChild(newImg);
        
        let newText = document.createElement('p');
        newText.innerText = data.user;
        newMessage.appendChild(newText);
        caseHolder.appendChild(newMessage);

        setTimeout(function () {
            newMessage.style.display = "none";
        }, 9000) //timer to get rid of message after 9 seconds
    })
}

//function to create buttons for user to interact
function constructButtons(socket) {
    //method of grabbing user data
    const findMatch = (selector, match) => {
        let s = document.querySelectorAll(selector);
        return [].filter.call(s, (function (t) {
            return RegExp(match).test(t.textContent)
        }))
    }
    const foundBody = findMatch("script", "ds:7");
    const userData = JSON.parse(foundBody[1].text.match(/\[[^\}]*/)[0]);
    socket.emit('user', {
        'username': userData[6],
        'url': document.URL
    });

    //creates buttons for user to click on and send message to server
    let div = document.createElement('div'); 
    div.id = "buttonContainer";

    let upbutton = document.createElement('button');
    upbutton.addEventListener('click', () => {
        socket.emit('message', "../Images/thumbsup.png")
    })

    let downbutton = document.createElement('button');
    downbutton.addEventListener('click', () => {
        socket.emit('message', "../Images/thumbsdown.png")
    })

    let qbutton = document.createElement('button');
    qbutton.addEventListener('click', () => {
        socket.emit('message', "../Images/handraise.png")
    })

    //creates elements via jquery
    let tup = document.createElement('img');
    let qmark = document.createElement('img');
    let tdown = document.createElement('img');

    tup.src = chrome.extension.getURL("../Images/thumbsup.png");
    qmark.src = chrome.extension.getURL("../Images/handraise.png");
    tdown.src = chrome.extension.getURL("../Images/thumbsdown.png");;

    upbutton.appendChild(tup);
    qbutton.appendChild(qmark);
    qbutton.id = "qbutton"
    downbutton.appendChild(tdown);

    div.appendChild(upbutton);
    div.appendChild(downbutton);
    div.appendChild(qbutton);

    document.body.prepend(div);
    displayOutput(socket);
}
//function to check if they are in google meet
function check() {
    let video = document.querySelector('[jsname="VyLmyb"]');
    if (video) {
        //access webserver if they are in the actual call
        let socket = io("https://guarded-temple-86561.herokuapp.com/");
        //creates buttons for interactions
        constructButtons(socket);
    } else {
        setTimeout(check, 500);
    }
}

//Bonus: Function to warn user about being unmuted by flashing red and leaving an alert
function warning() {
    let inCall = document.querySelector('[jsname="VyLmyb"]');
    if (inCall) {
        let checkMute = document.querySelectorAll('[jsname="BOHaEe"]');
        checkMute[0].addEventListener('mousedown', function (event) {
            if (checkMute[0].dataset.isMuted === 'true') {
                let flash = document.createElement('div');
                flash.id = "warn";
                document.body.prepend(flash);

                setTimeout(() => {
                    flash.style.display = 'none';
                }, 2200);
                checkMute[0].click();
                setTimeout(() => {
                    alert("You are now unmuted");
                }, 2250);
            }
        })

    } else {
        setTimeout(warning, 500);
    }
}
//checks if user has these features enabled
chrome.storage.sync.get(null, function (settings) {
    if (settings.ib == true) {
        check();
    }
});
chrome.storage.sync.get(null, function (settings) {
    if (settings.uW == true) {
        warning();
    }
});