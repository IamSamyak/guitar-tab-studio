import { useEffect } from "react";

import {
  playInterval,
} from "../../../audio/interval/intervalPlayer";

export default function useInfinitePlayback({
  running,
  interval,
  mode,
  speed,
}) {
  useEffect(() => {
    if (!running) return;

    let mounted = true;

    let timeoutId;

    async function loop() {
      if (!mounted) return;

      await playInterval(
        interval,
        mode
      );

      timeoutId = setTimeout(
        loop,
        speed
      );
    }

    loop();

    return () => {
      mounted = false;

      clearTimeout(timeoutId);
    };
  }, [
    running,
    interval,
    mode,
    speed,
  ]);
}