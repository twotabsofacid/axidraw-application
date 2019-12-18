// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

class Renderer {
	constructor() {
		this.storeValues();
		this.addListeners();
	}
	storeValues() {
		this.filename = '';
		this.speedPendownElem = document.getElementById('speedPendownRange');
		this.accelerationElem = document.getElementById('accelerationRange');
		this.selectElem = document.getElementById('select');
		this.submitElem = document.getElementById('submit');
	}
	addListeners() {
		// Range sliders
		let ranges = [].slice.call(document.querySelectorAll('.input-range'));
		for (let i = 0; i < ranges.length; i++) {
			ranges[i].addEventListener('input', (e) => {
				let val = e.target.value;
				document.getElementById(e.target.getAttribute('name')).innerText = val;
			});
		}
		// Select button
		this.selectElem.addEventListener('click', (e) => {
			e.preventDefault();
			this.selectFile();
		});
		// Submit button
		this.submitElem.addEventListener('click', (e) => {
			e.preventDefault();
			this.runAxidraw();
		})
		// ipc
		ipcRenderer.on('err', (event, data) => {
			console.log(data);
			alert(`ERROR, COMMAND FAILED: ${data.error.cmd}`);
		});
		ipcRenderer.on('std', (event, data) => {
			console.log(data);
			if (data.stdout) {
				alert(`OUTPUT: ${data.stdout}`);
			} else {
				alert(`ERROR: ${data.stderr}`);
			}
		});
	}
	selectFile() {
		let newDialog = new dialog.showOpenDialog({
			properties: ['openFile']
		});
		newDialog.then((value) => {
			if (value.filePaths && typeof value.filePaths[0] == 'string') {
				this.selectElem.innerText = value.filePaths[0];
				this.filename = value.filePaths[0];
			}
		})
	}
	runAxidraw() {
		let speedPendown = parseInt(this.speedPendownElem.innerText, 10);
		let accel = parseInt(this.accelerationElem.innerText, 10);
		ipcRenderer.send('run-axidraw', {
			"filename": this.filename,
			"speed_pendown": speedPendown,
			"accel": accel
		});
	}
}

new Renderer();
