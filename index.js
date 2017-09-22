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

function createWindow() {
  win = new BrowserWindow({
    width: 720,
    height: 650,
    frame: false,
    resizable: false,
    skipTaskbar: true,
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
  let icon = nativeImage.createFromDataURL(trayIcon)
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
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  win.setPosition(x, y, false)
  win.show()
  win.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
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
