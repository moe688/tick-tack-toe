import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // const [squares, setSquares] = useState(Array(9).fill(null));
  // this returns:
  // squares = [null, null, null, null, null, null, null, null, null];
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      // when I call the function calculateWinner(square), I get a return value, either X, O, or null. X and O are truthy, null is falthy. This means the return value is either truth or false (bolean). This is basically part of the condition "the if statement we are currently at".
      return;
    } // if the value is already "X" or "O", skip.
    const nextSqaures = squares.slice();
    if (xIsNext) {
      nextSqaures[i] = "X";
    } else {
      nextSqaures[i] = "O";
    }
    onPlay(nextSqaures);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  /*
so when I basically write:

const [squares, setSquares] = useState(Array(9).fill(null));

useState returns :
a) an array called "squares" that contains nine entries, each is "null"
b) a function called "setSquares" that React made for me whose job is to update "squares" array and triggers a re-render.
then I define :

const nextSquare = squares.slice();

so nextSquare is an exact copy of squares (in which changes will be made)

nextSquares[0] = "X";

is already the first change.

lastly:
I call setSquares (which update my "state" (squares), and pass nextSquares as an argument

setSquare(nextSquare)
so setSquare will update the old state "square" with the new state that I passed as an argument "nextState"

*/

  return (
    <>
      <div>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        {/*
          I didn't write just onSquareClick={handleClick(0)}, because this would have made a loophole.
          the code would have executed handleClick(0) immediately "even before the click event happens", which would trigger setSquare(...) inside it.
          setSquares would then trigger a state change, which requires the Board to re-render.
          Board re-renders, it reaches this line 
          <Square value={squares[0]} onSquareClick={handleClick(0)} />
          which again will run handleClick immediately, and the loop goes on.
          therefore I wrap handleClick(0) inside an arrow function. then this function is only passed and not immediately executed.
          so when onClick is triggered, it runs the arrow function that was passed as a reference, which is this:
          () => handleClick(0)
          and this function on the other hand, will run the function handleClick, and pass the argument 0
          handleClick(0)
          since the original handleClick is formed like this:
          handleClick(i)
          it will automatically replace the "i" with the "0"that we passed already.
          then it will execute:
          nextSquares[0]="X"
          and then call setSquares to update squares with nextSquares, it will be re-rendered.
          */}
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSqaures) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSqaures];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
