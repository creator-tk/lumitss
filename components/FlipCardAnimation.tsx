"use client";

import React, { useState, useEffect } from "react";

const FlipCardAnimation = ({ text, interval = 3000 }) => {
  const [displayedText, setDisplayedText] = useState(text[0]);

  useEffect(() => {
    const updateText = () => {
      const randomText = text[Math.floor(Math.random() * text.length)];
      const currentDate = new Date().toLocaleDateString(); 

      const formatDate = (date) => {
        const parts = date.split('/'); 

        const formattedDate = parts.map(part => part.padStart(2, '0')) 
        
        return formattedDate.join('-');
      };
  
      if (randomText === currentDate) {
        setDisplayedText(formatDate(currentDate)); 
        return;
      }
  
      setDisplayedText(randomText); 
    };
  
    const intervalId = setInterval(updateText, interval);
  
    return () => clearInterval(intervalId);
  }, [text, interval]);
  

  const renderDiv = (char, index) => (
    <div key={index} className="bg-black lg:rounded-xl h-[38px] w-[38px] sm:h-[80px] sm:w-[80px] flex-center flex-col relative rounded-md">

      <div className=" w-full h-full overflow-hidden bg-gray-6
      00 rounded-xl flex-center">

        <p className="text-xl sm:text-5xl font-bold text-gray-200">{char}</p>

        <div className="absolute bg-gray-800 top-0 w-full overflow-hidden h-1/2  rounded-tr-xl rounded-tl-xl sm:pt-4 pt-[5px]">

          <p className="bg-gray-800 text-xl sm:text-5xl text-center font-bold text-gray-100">{char}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-center w-full">
      <div className="bg-white rounded-xl grid grid-cols-11 justify-items-center align-items-center sm:gap-4 gap-0 m-0 ml-6 sm:ml-0">
        {displayedText.split("").slice(0, 11).map((char, index) => renderDiv(char, index))}
      </div>
    </div>
  );
};

export default FlipCardAnimation;
