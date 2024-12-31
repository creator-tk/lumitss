"use client"

import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const initialTime = 24 * 60 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex-center">
      <div className="flex gap-12">
        <div>
          <div className="bg-black text-white w-12 h-12 rounded-lg flex-center">
            {hours.toString().padStart(2, "0")}
          </div>
          <p className="text-sm">HOURS</p>
        </div>
        <div>
          <div className="bg-black text-white w-12 h-12 rounded-lg flex-center">
            {minutes.toString().padStart(2, "0")}
          </div>
          <p className="text-sm">MINUTES</p>
        </div>
        <div>
          <div className="bg-black text-white w-12 h-12 rounded-lg flex-center">
            {seconds.toString().padStart(2, "0")}
          </div>
          <p className="text-sm">SECONDS</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
