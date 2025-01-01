"use client";

import React, { useState, useEffect } from "react";

const FlipCardAnimation = ({ text, interval = 3000 }) => {
  const [displayedText, setDisplayedText] = useState(text[0]);

  useEffect(() => {
    const updateText = () => {
      const randomText = text[Math.floor(Math.random() * text.length)];
      setDisplayedText(randomText);
    };

    const intervalId = setInterval(updateText, interval);

    return () => clearInterval(intervalId);
  }, [text, interval]);

  const renderDiv = (char) => (
    <div className="bg-black rounded-xl h-[80px] w-[80px] flex-center flex-col relative">
      <div className="animate- w-full h-full overflow-hidden bg-lime-300 rounded-xl flex-center">
        <p className="text-black text-5xl">{char}</p>
        <div className="absolute bg-black top-0 w-full overflow-hidden h-1/2 rounded-tr-xl rounded-tl-xl pt-4">
          <p className="text-lime-300 text-5xl text-center">{char}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-center w-[100%]">
      <div className="w-[100%] lg:w-[70%] bg-white rounded-xl grid grid-cols-8 gap-12 mb-6">
        {displayedText.split("").slice(0, 8).map((char) => renderDiv(char))}
      </div>
    </div>
  );
};

export default FlipCardAnimation;
