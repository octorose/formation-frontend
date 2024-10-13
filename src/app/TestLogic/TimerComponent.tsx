import { useEffect } from "react";
import { FaRegClock } from "react-icons/fa";

const Timer = ({ timeLeft, setTimeLeft, onTimeOut }:any) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime:any) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeOut();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimeLeft, onTimeOut]);

  return (
    <div className="timer-box">
      <div className="timer-container">
        <FaRegClock className="timer-icon" />
        <div className="timer-bar">
          <div
            className="timer-bar-inner"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>
      </div>
      <div
        className="timer"
        style={{ color: timeLeft < 10 ? "red" : "inherit" }}
      >
        Time left: {timeLeft} seconds
      </div>
    </div>
  );
};

export default Timer;
