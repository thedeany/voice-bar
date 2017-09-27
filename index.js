const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) return

const electron = require('electron')
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  ipcMain
} = require('electron')

let win
let tray
let icon

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 650,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: __dirname + '/browser.js'
    }
  })

  win.loadURL('https://hangouts.google.com/')

  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  win.on('closed', () => {
    win = null
  })
}

function createTray() {
  icon = nativeImage.createFromDataURL(process.platform === 'darwin' ? trayIcon : trayIconWhite)
  tray = new Tray(icon)
  tray.on('click', function (event) {
    toggleWindow()
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      accelerator: 'Super+Q',
      click() {
        app.quit()
      }
    }
  ])

  tray.on('right-click', function (event) {
    tray.popUpContextMenu(menu)
  })
}

const toggleWindow = () => {
  if (win.isVisible()) {
    win.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = win.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x - windowPos.width)
    y = Math.round(trayPos.y - windowPos.height)
  }

  win.setPosition(x, y, false)
  win.show()
  win.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('incoming-call', () => {
  const callIcon = nativeImage.createFromDataURL(trayIconCall)
  tray.setImage(callIcon)
})

ipcMain.on('call-ended', () => {
  tray.setImage(icon)
})

app.on('ready', () => {
  createWindow()
  win.hide()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

let trayIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATVJREFUSA3tlb1qAkEUhVdNYWUlWKZMZSFE0IeIrWVexj7EJ7QQSRHsBJOQ6P3WOTo7OnpBixQe2Ln/Z+be2dWiuOM/TmBqh/qyZxMedHxX4dWqIQS/9ohc8q+MHPsVT+WP5XepqYfCUZCxL3IVtdhw6A+WMyYPBTzthGvlUJz4FIgxAdBjUQcdDCe83TzCpw5aTnLSdMJLJW0lcCJdEj7pqVTs2ZRByMvp1K4oYETelskHdN0otbxOuMkicnYE6mZnVddzsWrmwarpkr8Pvota3zKGISunEy6/HW2wDgUe4R1RhXNuzBpTermy2Vy6R35QoA6WGE7kxhL7ofpk0QYLDCe8I5rFfO9m0DbItX8udqpmUrKF5SUQY3L7aYG+3tSfs/e/phCmSP8PeBve0qS7fbMJbAHCM3a4T4fXqwAAAABJRU5ErkJggg==`

let trayIconWhite = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAADTSURBVDjLzZQxCsJAEEXfxiA2WgmWllYWFhZewtbSy9iLuYV38DAWIhZinajJtxgEE3Zl04gzsDDL/pk3M7BOtLOk5fufCjIKhCjIviqE1pJQqbdVQj57aCoSYNmo5QK5U1aQApMArGpRCcws78gr8NUZW4WBV1B67oaQ4Oh6BXMWjRP6Jgi12Gmc0AMnEOBqLdajWmcJcI9GqmxKeTRSDgidpMZu/ZuWLrbpWzTS1ZDO0UhHQ9pFI20M6QDwMcgqMNIne6tgnqmQJOXairC7//sEXi8fvZWlvsEjAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA5LTI1VDIyOjQ2OjEyKzAyOjAwok8anAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOS0yNVQyMjo0NjoxMiswMjowMNMSoiAAAAAASUVORK5CYII=`

let trayIconCall = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAWlBMVEX///////8AzAD///8AzAAAzAAAzAD///////////////////////////8AzAAAzAD///////8AzAD///8AzAD///////////////////////8AzAD///8AzABthEU/AAAAHXRSTlMAkvlf/f77La2E1AECtevoNDj1O/Hk0ri0kU34j3oV3C0AAAABYktHRACIBR1IAAAACXBIWXMAAABIAAAASABGyWs+AAAAiElEQVQoz72RWQ7DIAwFXyhJ26yle5Z3/2vGJAjayPlsLUsgjxgDBv4UmSFNtq0eCEuJHIxRHAWcGCofgGcBZQLV6qjJRpY2gTqCUhajqTqgYgIXF5LX5VwE7haSVlTUVPzukVT+xF1TSQ88dm6Fp6by73hpqreAfu+vBiL3e7v93TCPcfrZuGco0B1RRU4rTgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wOS0yNlQwODo1MTozNi0wNDowMDa8V/MAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDktMjZUMDg6NTE6MzYtMDQ6MDBH4e9PAAAAAElFTkSuQmCC`