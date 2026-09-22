import { useEffect, useState } from "react";

// Port of initializeCountdown(): ticks every second toward config.wedding.isoDate,
// independent of whether the scratch card has been uncovered yet.
export function useCountdown(isoDate) {
  const targetDate = new Date(isoDate).getTime();

  const compute = () => {
    const difference = Math.max(0, targetDate - Date.now());
    return {
      days: String(Math.floor(difference / 86400000)).padStart(2, "0"),
      hours: String(Math.floor((difference / 3600000) % 24)).padStart(2, "0"),
      minutes: String(Math.floor((difference / 60000) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [values, setValues] = useState(compute);

  useEffect(() => {
    if (Number.isNaN(targetDate)) return;
    const id = window.setInterval(() => setValues(compute()), 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return values;
}
