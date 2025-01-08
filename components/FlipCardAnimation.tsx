"use client";

import React, { useState, useEffect } from "react";

const FlipCardAnimation = ({ text, interval = 3000 }) => {
  const [displayedText, setDisplayedText] = useState(text[0]);

  useEffect(() => {
    const updateText = () => {
      const randomText = text[Math.floor(Math.random() * text.length)];
      const currentDate = new Date().toLocaleDateString(); // Get the current date
  
      // Function to format the date and replace '/' with '-'
      const formatDate = (date) => {
        const parts = date.split('/'); // Split the date into [month, day, year]
        
        // Check if the day and month are single digits
        const formattedDate = parts.map(part => part.length === 1 ? `0${part}` : part); // Ensure two digits
        
        // Replace '/' with '-'
        return formattedDate.join('-');
      };
  
      // Check if randomText matches today's date
      if (randomText === currentDate) {
        setDisplayedText(formatDate(currentDate)); // Format the date
        return;
      }
  
      setDisplayedText(randomText); // Use the randomText otherwise
    };
  
    const intervalId = setInterval(updateText, interval);
  
    return () => clearInterval(intervalId);
  }, [text, interval]);
  

  const renderDiv = (char, index) => (
    <div key={index} className="bg-black lg:rounded-xl h-[40px] w-[40px] sm:h-[80px] sm:w-[80px] flex-center flex-col relative rounded-md">

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
    <div className="flex-center w-[100%] ">
      <div className="bg-white rounded-xl grid grid-cols-11 md:gap justify-items-center align-items-center mb-6 gap-4 ">
        {displayedText.split("").slice(0, 11).map((char, index) => renderDiv(char, index))}
      </div>
    </div>
  );
};

export default FlipCardAnimation;
