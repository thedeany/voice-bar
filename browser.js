const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer

const observer = new MutationObserver(function(mutations, observer) {
    for (let mutation in mutations) {
        if (mutations[mutation].addedNodes.length && mutations[mutation].addedNodes[0].className === 'Cl') {
            let notification = new Notification('Call started')
            notification.onclick = () => {
                BrowserWindow.getAllWindows()[0].show()
            }
            ipc.send('incoming-call')
        } else if (mutations[mutation].removedNodes.length && mutations[mutation].removedNodes[0].className === 'Cl') {
            ipc.send('call-ended')
        }
    }
})

observer.observe(document, {
  subtree: true,
  childList: true
})