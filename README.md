# Word Puzzle Solver

A module used for solving word puzzles.

## Description

It was made with popular word-puzzle game "Słowotok" in mind.

## Getting Started

### Dependencies

* Made purely with native Node.js modules.

### Executing program

Currently only working with specific word list. Ability to plug your own txt file is on the way (see Roadmap)

```
const wordPuzzleSolver = require('word-puzzle-solver')

const board = [ [ 'w', 'i', 'm', 'ć' ],
  [ 'r', 'k', 'o', 'a' ],
  [ 'ą', 'k', 'w', 'd' ],
  [ 'a', 'c', 'a', 'a' ] ]

wordPuzzleSolver(board).solve((words)=>{
	console.log(words) // => Array[String]
})
```

## Roadmap

- [ ] Parse board from string
- [ ] Allow boards with rows of different lengths
- [ ] Allow pluging custom word list.
- [ ] Allow pluging custom regex for word matching
- [ ] Optimize, and optimize...

## Version History

* 0.1
    * Initial Release