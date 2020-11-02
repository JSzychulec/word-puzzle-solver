const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

function wordPuzzleSolver(board, options = {}) {
	board = validateAndSanitizeBoard(board);
	options = validateAndSanitizeOptions(options);
	let paths = setInitialPaths(board);
	let words = [];
	let workers = spawnWorkers();
	let busyWorkers = 0;

	function validateAndSanitizeBoard(board) {
		return board.map(col => col.map(letter => letter.toLowerCase()))
	}
	
	// @todo
	function validateAndSanitizeOptions(options) {
		return options
	}
	
	function spawnWorkers() {
		cluster.setupMaster({exec: __dirname + '/worker.js'})
		let temp = [];
		for (let i = 0; i < numCPUs; i++) {
			let newWorker = cluster.fork();
			temp.push(newWorker)
		}
		return temp;
	}
	
	function setInitialPaths(board) {
		let paths = []
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				paths.push([[i, j]])
			}
		}
		return paths;
	}
	
	function killWorkers() {
		workers.forEach(worker => worker.kill());
	}

	function sendWorkerMessage(workerIndex){
		let path = paths.shift()
		busyWorkers += 1;
		workers[workerIndex].send({path, board, workerIndex})
	}

	function solve(cb) {
		workers.forEach((worker, workerIndex) => {
			worker.on('message', ({newPaths, newWords, workerIndex}) => {
				busyWorkers -= 1;
				if (newPaths) paths = [...paths, ...newPaths]
				if (newWords) words = [...words, ...newWords] 

				if (paths.length > 0) {
					sendWorkerMessage(workerIndex)
				} else if (busyWorkers === 0) {
					killWorkers();
					cb(words)
				}
			})

			sendWorkerMessage(workerIndex)
		})
	}

	return { solve }
		
}

module.exports = wordPuzzleSolver;