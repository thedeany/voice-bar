# VoiceBar
A Google Voice menubar app built with Electron.

## Development
The development environment has only been tested on a Mac.

### Requirements
- node/npm
- Xcode (with command line tools installed) for building .dmg installer

### Instructions
1. `npm install`
2. `npm start` to run the app

### Building
1. `npm run package` to package the apps for macOS and Windows
    * `npm run package-mac` and `npm run package-win` will package for the specified platform
2. `npm run create-installers` to create installers for distribution
    * `npm run create-installer-mac` and `npm run create-installer-win` will create installers for the specified platform
