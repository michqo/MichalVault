const formatBytes = (bytes: number, decimals = 1): string => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (d: Date, now: Date): string => {
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const formatRelativeDate = (rtf: Intl.RelativeTimeFormat, d: Date, now: Date): string => {
  const diffInMs = Math.abs(now.valueOf() - d.valueOf());
  const seconds = diffInMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  if (seconds < 60) {
    return rtf.format(-Math.round(seconds), "seconds");
  } else if (minutes < 60) {
    return rtf.format(-Math.round(minutes), "minutes");
  } else if (hours < 24) {
    return rtf.format(-Math.round(hours), "hours");
  }

  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

export { formatBytes, formatDate, formatRelativeDate };
