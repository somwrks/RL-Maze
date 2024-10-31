"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  
  const [maze, setMaze] = useState([
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
  const [reward, setReward] = useState(10);
  const [train_epoch, setTrain_epoch] = useState(100);
  const [test_epoch, setTest_epoch] = useState(1);
  const [wallpenalty, setWallpenalty] = useState(-10);
  const [steppenalty, setSteppenalty] = useState(-1);
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

  const handleDrop = (event:any, rowIndex:any, cellIndex:any) => {
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

  const handleDragStart = (event:any, type:any) => {
    event.dataTransfer.setData("text", type);
  };

  const router = useRouter();

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

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maze: newMaze,
          starting,
          ending,
          reward,
          wallpenalty,
          train_epoch,
          test_epoch,
          steppenalty,
        }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      const url = `/main?maze=${encodeURIComponent(JSON.stringify(maze))}`;
      router.push(url);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const checkMazeForTwo = (num:any) => {
    for (const row of maze) {
      for (const cell of row) {
        if (cell === num) {
          return true;
        }
      }
    }
    return false;
  };
  return (
    <div className="flex text-white md:flex-nowrap flex-wrap  min-h-screen flex-row items-center w-full p-12">
      <div className="flex flex-col items-center w-full">
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
                  {cell === 2 && <div className="absolute text-4xl">🚗</div>}
                  {cell === 3 && <div className="absolute  text-4xl">🏁</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <h1 className="text-xl text-center text-white">
        Toggle the blocks to define paths
        </h1>
        <h1 className="text-xl text-center text-white">
          Drag the car on to the block to make the starting point!
          <div
            draggable
            onDragStart={(event) => handleDragStart(event, "car")}
            className="cursor-pointer text-4xl"
          >
            {!checkMazeForTwo(2) && "🚗"}
          </div>
        </h1>
        <h1 className="text-xl text-center text-white">
          Drag the race flag on to the block to make the end point!
          <div
            draggable
            onDragStart={(event) => handleDragStart(event, "flag")}
            className="cursor-pointer text-4xl"
          >
            {!checkMazeForTwo(3) && "🏁"}
          </div>
        </h1>

      </div>



      <div className="flex flex-col  text-xl w-1/2 space-y-4">
        
        
        <label htmlFor="reward">Reward</label>
        <input
          type="text"
          required
          value={reward}
          multiple={false}
          className="text-white bg-gray-900  p-2 text-xl text-center "
          placeholder="Reward"
          onChange={(e: any) => setReward(e.target.value)}
        />
        <label htmlFor="wallpenalty">Wall Penalty</label>
        <input
          type="text"
          className="text-white bg-gray-900  p-2 text-xl text-center"
          required
          value={wallpenalty}
          placeholder="Wall Penalty"
          onChange={(e: any) => setWallpenalty(e.target.value)}
        />
        <label htmlFor="steppenalty">Step Penalty</label>
        <input
          type="text"
          className="text-white bg-gray-900  p-2 text-xl text-center"
          required
          value={steppenalty}
          placeholder="Step Penalty"
          onChange={(e: any) => setSteppenalty(e.target.value)}
        />
        <label htmlFor="train_epoch">Training Epoch</label>
        <input
          type="text"
          className="text-white bg-gray-900  p-2 text-xl text-center"
          required
          value={train_epoch}
          placeholder="train_epoch"
          onChange={(e: any) => setTrain_epoch(e.target.value)}
        />
        <label htmlFor="test_epoch">Testing Epoch</label>
        <input
          type="text"
          className="text-white bg-gray-900  p-2 text-xl text-center"
          required
          value={test_epoch}
          placeholder="test_epoch"
          onChange={(e: any) => setTest_epoch(e.target.value)}
        />
        
        <Button
          onClick={handlesubmit}
          size="lg"
          color="primary"
          className="p-4 border text-xl"
        >
          Start
        </Button>
        <SignOutButton>
        <Button
          size="lg"
          color="primary"
          className="p-4 border text-xl"
        >
          Logout
        </Button>

        </SignOutButton>
      </div>
    </div>
  );
}
