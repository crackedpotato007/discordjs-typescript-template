function msToTime(ms: number) {
  let day, hour, minute, seconds;
  seconds = Math.floor(ms / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return day
    ? hour
      ? `${day}d ${hour}h ${minute}m ${seconds}s`
      : minute
      ? `${day}d ${minute}m ${seconds}s`
      : `${day}d ${seconds}s`
    : hour
    ? `${hour}h ${minute}m ${seconds}s`
    : minute
    ? `${minute}m ${seconds}s`
    : `${seconds}s`;
}

export { msToTime };
