"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const searchParams = useSearchParams();
  const mazeParam = searchParams.get("maze");

  let maze_final;
  if (mazeParam) {
    maze_final = JSON.parse(mazeParam);
  }

  const [train, setTrain] = useState(false);
  const [test, setTest] = useState(false);
  const [maze, setMaze] = useState(maze_final);
  const [steps, setSteps] = useState<any>([]);

  const handletrain = async () => {
    try {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      console.log(res);
      setTrain(true);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handletest = async () => {
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      console.log(res);
      setTest(true);
      fetchlog();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const fetchlog = async () => {
    try {
      const response = await fetch("/api/getlogs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const step = await response.json();
      setSteps(step.log);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const updateMaze = async () => {
    for (let step of steps) {
      const newMaze = maze.map((row: any) => row.slice());

      for (let i = 0; i < newMaze.length; i++) {
        for (let j = 0; j < newMaze[i].length; j++) {
          if (newMaze[i][j] === 2) {
            newMaze[i][j] = 0;
          }
        }
      }

      // Set the new car position
      const [stepRow, stepCol] = step;
      newMaze[stepRow][stepCol] = 2;

      setMaze(newMaze);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the delay as needed
    }
  };

  useEffect(() => {
    if (test && steps.length > 0) {
      updateMaze();
    }
  }, [test, steps]);

  return (
    <div className="flex flex-row min-h-screen w-full overflow-hidden justify-between  p-12">

    <div className="flex text-white space-y-4 h-full flex-col items-center overflow-hidden w-full">
      <div className="flex flex-col items-center w-full p-2">
        {maze.map((row: any, rowIndex: any) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((cell: any, cellIndex: any) => (
              <div
                key={cellIndex}
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
                {cell === 3 && <div className="absolute text-4xl">🏁</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Button
        size="lg"
        onClick={!train ? handletrain : !test ? handletest : fetchlog}
        color="primary"
        className="p-4 text-2xl"
      >
        {!train ? "Train" : !test ? "Test" : "Get Log"}
      </Button>
    </div>
     <div className="flex flex-col w-1/2 min-h-screen space-y-4 overflow-hidden">
     <h1 className="text-4xl text-center text-white">Progress</h1>
     <div className="text-2xl text-gray-400 space-y-2">
      
     </div>
     </div>
     </div>
  );
}
