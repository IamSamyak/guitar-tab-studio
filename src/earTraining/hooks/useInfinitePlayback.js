import { useEffect, useRef } from "react";
import { playInterval } from "../services/intervalPlayer";

function useInfinitePlayback({
  running,
  interval,
  mode,
  speed,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running || !interval) return;

    // play immediately
    playInterval(interval, mode);

    timerRef.current = setInterval(() => {
      playInterval(interval, mode);
    }, speed);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [running, interval, mode, speed]);
}

export default useInfinitePlayback;