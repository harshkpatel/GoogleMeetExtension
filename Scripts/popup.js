/*
    popup.js
    script to get functionality when user interacts with the pop up
    uses chrome storage to allow functions to work if the user has enabled/disabled them
    Harsh Patel
*/

//get values of any changes to their key bind
let keyChange = document.getElementById("changeKey");
keyChange.onclick = function (element) {
    let key = prompt("Please input a key");
    chrome.storage.sync.set({
        "key": key
    });
}

//enable/disable changes
let pushTalk = document.getElementById("pushTalk");
pushTalk.onclick = function (element) {
    if (pushTalk.innerHTML == "Enable") {
        chrome.storage.sync.set({
            "ptt": true
        });
        pushTalk.innerHTML = "Disable"
    } else {
        console.log("test")
        chrome.storage.sync.set({
            "ptt": false
        });
        pushTalk.innerHTML = "Enable"
    }
}

//enable/disable changes
let muteTab = document.getElementById("muteTab");
muteTab.onclick = function (element) {
    if (muteTab.innerHTML == "Enable") {
        chrome.storage.sync.set({
            "mt": true
        });
        muteTab.innerHTML = "Disable"
    } else {
        chrome.storage.sync.set({
            "mt": false
        });
        muteTab.innerHTML = "Enable"
    }
}

//enable/disable changes
let iButtons = document.getElementById("iButtons");
iButtons.onclick = function (element) {
    if (iButtons.innerHTML == "Enable") {
        chrome.storage.sync.set({
            "ib": true
        });
        iButtons.innerHTML = "Disable"
    } else {
        chrome.storage.sync.set({
            "ib": false
        });
        iButtons.innerHTML = "Enable"
    }
}

//enable/disable changes
let unWarn = document.getElementById("unWarn");
unWarn.onclick = function (element) {
    if (unWarn.innerHTML == "Enable") {
        chrome.storage.sync.set({
            "uW": true
        });
        unWarn.innerHTML = "Disable"
    } else {
        chrome.storage.sync.set({
            "uW": false
        });
        unWarn.innerHTML = "Enable"
    }
}


//show changes in pop up
chrome.storage.sync.get(null, function (settings) {
    pushTalk.innerHTML = settings.ptt ? "Disable" : "Enable";
    muteTab.innerHTML = settings.mt ? "Disable" : "Enable";
    iButtons.innerHTML = settings.ib ? "Disable" : "Enable";
    unWarn.innerHTML = settings.uW ? "Disable" : "Enable";
    if (settings.key != null) {
        keyChange.innerHTML = "Change Keybind"
    }
})