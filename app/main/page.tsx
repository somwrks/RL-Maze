// Frontend modifications

"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TypingText  from "../../components/TypingText"
export default function Main() {
  const searchParams = useSearchParams();
  const mazeParam = searchParams.get("maze");
  
  let maze_final;
  if (mazeParam) {
    maze_final = JSON.parse(mazeParam);
  }
  const [text, setText] = useState<any>([]);
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
      if (res ){ setTrain(true)}
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
      setTest(true);
      fetchlog();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const fetchtext = async () => {
    try {
      const response = await fetch("/api/gettext", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const text_message = await response.json();
      setText((prevText: any) => [...prevText, text_message.text]);
      return text_message.text;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return "";
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
  const [mazeImage, setMazeImage] = useState("");
  const [mazeImage1, setMazeImage1] = useState("");

  const fetchImage = async (type:any) => {
    try {
      const response = await fetch(`/api/getimage?type=${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const imageData = await response.json();
      const imgBase64 = imageData.image;
      const imgUrl = `data:image/png;base64,${imgBase64}`;
      if (type =="test"){
        setMazeImage1(imgUrl);
      }
      else{

        setMazeImage(imgUrl);
      }
    } catch (error) {
      console.error("There was a problem with fetching the image:", error);
    }
  };
  const updateMaze = async () => {
    let allTextsFetched = false;
  
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
      if (newMaze && stepRow !== undefined && stepCol !== undefined) {
        newMaze[stepRow][stepCol] = 2;
      } else {
        console.error("Invalid newMaze or stepRow/stepCol");
      }
  
      setMaze(newMaze);
      await new Promise((resolve) => setTimeout(resolve, 25));
      await fetchtext();
      await fetchImage('train');
    }
  
    while (!allTextsFetched && !quit) {
      const textMessage = await fetchtext();
      if (textMessage === "") {
        fetchImage('test');
        allTextsFetched = true;
      }
    }
  };
  const [quit, setQuit] = useState(false)

  useEffect(() => {
    if (!quit && test && steps.length > 0) {
      updateMaze();
      }
  }, [test, steps]);

  const downloadchat = () => {
    // This function will download all the text fetched and the images fetched from the progress chat
    const allTexts = text.join("\n");
    const element = document.createElement("a");
    const file = new Blob([allTexts], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "progress_chat.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };


  
  return (
    <div className="flex md:flex-row min-h-screen bg-black md:flex-nowrap flex-wrap   w-full overflow-hidden justify-between p-12">
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
          onClick={!train ? handletrain : !test ? handletest : downloadchat}
          color="primary"
          className="p-4 text-2xl"
        >
          {!train ? "Train" : !test ? "Test" : "Download  Log"}
        </Button>
        <Button
          size="lg" onClick={()=> setQuit(true)}
          color="primary"
          className="p-4 text-2xl"
        >
          <Link href={"/"}>
          Reset
          </Link>
        </Button>
      </div>
      <div className="flex flex-col w-1/2 min-h-screen space-y-4 overflow-hidden">
        <h1 className="text-4xl text-center text-white">Progress</h1>
        <div className="text-md flex h-[50vw] overflow-y-scroll flex-col text-gray-400 space-y-2">
    <TypingText text={text}/>
    {mazeImage && (
          <div className="flex justify-center items-center">
            <img src={mazeImage} alt="Maze Image" className="max-w-full max-h-96" />
          </div>
        )}
    {mazeImage1 && (
          <div className="flex justify-center items-center">
            <img src={mazeImage1} alt="Maze Image" className="max-w-full max-h-96" />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
