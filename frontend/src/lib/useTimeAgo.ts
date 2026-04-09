import { useEffect, useState } from 'react';

function getTimeAgoLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'Last updated just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins === 1) return 'Last updated 1 min ago';
  return `Last updated ${diffMins} mins ago`;
}

export function useTimeAgo(date: Date | null | undefined): string {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!date) return;
    setTimeAgo(getTimeAgoLabel(date));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgoLabel(date));
    }, 30_000);
    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
}
