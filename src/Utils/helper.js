import { format, parseISO, subHours } from "date-fns";

export const handleLocalStorageClear = () => {
  const savedLanguage = localStorage.getItem("i18nextLng") || "en";
  localStorage.clear();
  localStorage.setItem("i18nextLng", savedLanguage);
};

export const formatDateDayMonthYear = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateMonthDayYearTime = (isoString) => {
  const date = parseISO(isoString);
  const adjustedDate = subHours(date, 5); // Subtract 5 hours
  return format(adjustedDate, "MMM dd yyyy, h:mm a");
};

export const clearCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function formatLastUpdated(updatedAt, isLive) {
  const updatedDate = new Date(updatedAt);
  let newUpdate;
  if (isLive) {
    newUpdate = new Date(
      // updatedDate.setTime(

      updatedDate.getTime() - 8 * 60 * 60 * 1000
      // )
    );
  } else {
    newUpdate = new Date(
      // updatedDate.setTime(

      updatedDate.getTime() - 5 * 60 * 60 * 1000
      // )
    );
  }

  const now = new Date();
  const timeDifference = now - newUpdate;
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  console.log(
    "isLive",
    isLive,
    "updatedDate.getTime()",
    updatedDate.getTime(),
    updatedDate.getTime() - 5 * 60 * 60 * 1000,
    "updatedAt",
    updatedAt,
    "updatedDate",
    updatedDate,
    "newUpdate",
    newUpdate,
    "now",
    now,
    "timeDifference",
    timeDifference,
    "minutesDifference",
    minutesDifference
  );

  if (minutesDifference < 1) {
    return "just now";
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minutes ago`;
  } else if (minutesDifference < 1440) {
    const hoursDifference = Math.floor(minutesDifference / 60);
    return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
  } else {
    const daysDifference = Math.floor(minutesDifference / 1440);
    return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
  }
}

export const truncateText = (text, length) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};
