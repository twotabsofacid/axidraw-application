// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');

class Renderer {
	constructor() {
		this.storeValues();
		this.addListeners();
	}
	storeValues() {
		this.speedPendownElem = document.getElementById('speedPendownRange');
		this.accelerationElem = document.getElementById('accelerationRange');
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
		// Submit button
		this.submitElem.addEventListener('click', (e) => {
			e.preventDefault();
			this.runAxidraw();
		})
		// ipc
		ipcRenderer.on('err', (event, data) => {
			console.log(data);
		});
		ipcRenderer.on('std', (event, data) => {
			console.log(data);
		});
	}
	runAxidraw() {
		let speedPendown = parseInt(this.speedPendownElem.innerText, 10);
		let accel = parseInt(this.accelerationElem.innerText, 10);
		ipcRenderer.send('run-axidraw', {
			"filename": "somethig_cool.png",
			"speed_pendown": speedPendown,
			"accel": accel
		});
	}
}

new Renderer();
