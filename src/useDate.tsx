import * as React from 'react';

export default function useDate(interval: number = 1000) {
  const [date, setDate] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return date;
}
