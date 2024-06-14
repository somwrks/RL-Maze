'use client';
import { useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Home() {
  const [maze, setMaze] = useState([
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ]);

  const [carPosition, setCarPosition] = useState({ row: null, col: null });
  const [flagPosition, setFlagPosition] = useState({ row: null, col: null });

  const handleCellClick = (rowIndex:any, cellIndex:any) => {
    const newMaze = maze.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          return cell === 0 ? 1 : 0;
        }
        return cell;
      })
    );
    setMaze(newMaze);
  };

  const handleDrop = (event :any, rowIndex:any, cellIndex:any) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");

    if (maze[rowIndex][cellIndex] !== 0) {
      return;
    }

    const newMaze = maze.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          if (data === "car") {
            return 2;
          } else if (data === "flag") {
            return 3;
          }
        }
        return cell;
      })
    );

    if (data === "car") {
      if (carPosition.row !== null && carPosition.col !== null) {
        newMaze[carPosition.row][carPosition.col] = 0;
      }
      setCarPosition({ row: rowIndex, col: cellIndex });
    } else if (data === "flag") {
      if (flagPosition.row !== null && flagPosition.col !== null) {
        newMaze[flagPosition.row][flagPosition.col] = 0;
      }
      setFlagPosition({ row: rowIndex, col: cellIndex });
    }

    setMaze(newMaze);
  };

  const handleDragOver = (event:any) => {
    event.preventDefault();
  };

  const handleDragStart = (event :any, type:any) => {
    event.dataTransfer.setData("text", type);
  };

  const handlesubmit = async () => {
    if (carPosition.row === null || flagPosition.row === null) {
      alert("Please set both the starting and ending points in the maze.");
      return;
    }

    const starting = [carPosition.row, carPosition.col];
    const ending = [flagPosition.row, flagPosition.col];

    const newMaze = maze.map((row) =>
      row.map((cell) => (cell === 2 || cell === 3 ? 0 : cell))
    );
    console.log("New Maze : ", newMaze)
    console.log("starting point : ", starting)
    console.log("ending point : ", ending)

    try {
      const response = await fetch('/api/python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maze: newMaze, starting, ending }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="flex text-white space-y-4 min-h-screen flex-col items-center w-full p-12">
      <div className="flex flex-col items-center w-full p-2">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                onDrop={(event) => handleDrop(event, rowIndex, cellIndex)}
                onDragOver={handleDragOver}
                className={`flex items-center justify-center w-32 h-32 border ${
                  cell === 0
                    ? "bg-white"
                    : cell === 1
                    ? "bg-black"
                    : cell === 2
                    ? "bg-white relative"
                    : "bg-white relative"
                } cursor-pointer`}
              >
                {cell === 2 && <div className="absolute">🚗</div>}
                {cell === 3 && <div className="absolute">🏁</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <h1 className="text-3xl text-center text-white">
        Drag the car on to the block to make the starting point!
        <div
          draggable
          onDragStart={(event) => handleDragStart(event, "car")}
          className="cursor-pointer"
        >
          🚗
        </div>
      </h1>
      <h1 className="text-3xl text-center text-white">
        Drag the race flag on to the block to make the end point!
        <div
          draggable
          onDragStart={(event) => handleDragStart(event, "flag")}
          className="cursor-pointer"
        >
          🏁
        </div>
      </h1>
      <Button
        onClick={handlesubmit}
        size="lg"
        color="primary"
        className="p-4 text-2xl"
      >
        Start
      </Button>
    </div>
  );
}
