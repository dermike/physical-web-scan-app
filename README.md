# electron-physical-web-scan
Scan for [Physical Web](https://github.com/google/physical-web) ([Eddystone](https://github.com/google/eddystone)) bluetooth beacons from your computer. Mac OSX desktop app of the [physical-web-scan](https://github.com/dermike/physical-web-scan) project made with [Electron](http://electron.atom.io).

**[Download pre-built binary](https://github.com/dermike/electron-physical-web-scan/releases/download/0.1.5/PhysicalWebScan.zip)** or follow the instructions below to run with Electron or build your own binary.

### Prerequisites

* [Node.js](https://nodejs.org/)
* [Electron](http://electron.atom.io)

### Install and build

After cloning or downloading this repo, install the dependencies listed in `package.json`:

```sh
npm install
```

Rebuild native modules for Electron use:

```sh
node ./node_modules/.bin/electron-rebuild
```

Run as Electron app:

```sh
electron .
```

Package as standalone Mac OSX app:

```sh
npm run package
```

Note: Edit the electron-packager options to your liking in the `scripts` section of `package.json`