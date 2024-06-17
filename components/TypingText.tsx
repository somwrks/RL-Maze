import React, { useState, useEffect } from 'react';

const TypingText = ({ text }: { text: string[] }) => {
    const [displayedText, setDisplayedText] = useState<any>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentSentenceIndex < text.length) {
      if (currentCharIndex < text[currentSentenceIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev:any) => {
            const newDisplayedText = [...prev];
            if (!newDisplayedText[currentSentenceIndex]) {
              newDisplayedText[currentSentenceIndex] = '';
            }
            newDisplayedText[currentSentenceIndex] += text[currentSentenceIndex][currentCharIndex];
            return newDisplayedText;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 0.1); // Typing delay in ms

        return () => clearTimeout(timeout);
      } else if (currentSentenceIndex < text.length - 1) {
        setCurrentSentenceIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }
  }, [currentCharIndex, currentSentenceIndex, text]);

  return (
    <div>
      {displayedText.map((e:any, i:any) => (
        <div style={{ whiteSpace: "pre-wrap" }} key={i} className="p-1">
          {e}
        </div>
      ))}
    </div>
  );
};

export default TypingText