const fs = require('fs');
const wordList = fs.readFileSync('wordlist.txt', 'utf8');

function getPossibleMoves(node, length) {
	let [row, col] = node;
	let moves = [];
	if (row-1 !== -1) moves.push([row-1, col]) //up
	if (row-1 !== -1 && col+1 !== length) moves.push([row - 1, col + 1]) //upright
	if (row-1 !== -1 && col-1 !== -1) moves.push([row - 1, col - 1]) //upleft
	if (col + 1 !== length) moves.push([row, col + 1]) //right
	if (row + 1 !== length) moves.push([row + 1, col]) //down
	if (row + 1 !== length && col + 1 !== length) moves.push([row + 1, col + 1]) //downright
	if (row + 1 !== length && col - 1 !== -1) moves.push([row + 1, col - 1]) //downleft
	if (col - 1 !== -1) moves.push([row, col - 1]) //left
	return moves;
}

function areNodesUnique (path) {
	let temp = [];
	for (let i = 0; i < path.length; i++) {
		let parsedNode = path[i].join('')
		if (temp.indexOf(parsedNode) !== -1) return false;
		temp.push(parsedNode);
	}
	return true;
}

function pathToWord(path, board) {
	let string = "";
	for (let i = 0; i < path.length; i++) {
		string += board[path[i][0]][path[i][1]]
	}
	return string;
}

function checkWord(word) {
	let complete = false;
	let part = false;
	let index = wordList.indexOf("\n" + word);

	if (index !== -1) {
		part = true;
		if (index !== -1 && wordList.charAt(index+word.length+1) === ".") complete = true;
	}

	return {part, complete}
}

async function solvePath(path, board) {
	let word = pathToWord(path, board);
	let unique = areNodesUnique(path);
	let {complete, part} = checkWord(word)
	if (unique && part) {
		if (word.length > 3 && complete) return {newPath: path, newWord: word}
		else return {newPath: path}
	} else {
		return null;
	}
}

function sendResults(results, workerIndex) {
	let toSend = {newPaths: [],	newWords: [], workerIndex}
	results.forEach(result => {
		if (result) {
			if (result.newPath) toSend.newPaths.push(result.newPath)
			if (result.newWord) toSend.newWords.push(result.newWord)
		}
	})
	process.send(toSend)
}

async function run({path, board, workerIndex}) {
	try {
		let currentNode = path[path.length-1]
		let possibleMoves = getPossibleMoves(currentNode, board.length)
		let promises = possibleMoves.map((possibleMove) => solvePath([...path, possibleMove], board))
		let results = await Promise.all(promises)
		sendResults(results, workerIndex)
	} catch (error) {
		console.log(error)
	}
	
}

process.on('message', (msg) => {
	run(msg)
})