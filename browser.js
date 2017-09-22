const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow

const observer = new MutationObserver(function(mutations, observer) {
    for (let mutation in mutations) {
        if (mutations[mutation].addedNodes[0].className === 'Cl') {
            let notification = new Notification('Incoming Call')
            notification.onclick = () => {
                console.log('clicked')
                BrowserWindow.getAllWindows()[0].show()
            }
        }
    }
})

observer.observe(document, {
  subtree: true,
  childList: true
})