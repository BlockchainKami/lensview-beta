import { DateType } from "../../config/app-constants.config";

/**
 * Helper function to get a formatted date based on the specified type.
 * @param {string} date - The input date to format.
 * @param {DateType} type - The type of date formatting to apply.
 * @returns {string} - The formatted date.
 */
const getFormattedDateHelperUtil = (
  date: string,
  type: DateType = DateType.RoughDate
): string => {
  if (type === DateType.ExactDate) {
    return getExactDate(date);
  }

  return getRoughDate(date)
};

/**
 * It returns the formatted date based on the date passed
 * If the date is of today, it returns the seconds, minutes or hours
 * If the date is of 1 month from today, it returns the days
 * If the date is of 1 year from today, it returns the months
 * If the date is of more than 1 year from today, it returns the years
 * @param date
 */
const getRoughDate = (date: string) => {
  if (date === undefined || date === null) return "";

  const today = new Date();
  const commentDate = new Date(date);

  const diffTime = Math.abs(today.getTime() - commentDate.getTime());
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(diffTime / oneDay);

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes === 0) {
        const diffSeconds = Math.floor(diffTime / 1000);
        return `${diffSeconds}s ago`;
      } else {
        return `${diffMinutes}m ago`;
      }
    } else {
      return `${diffHours}h ago`;
    }
  } else if (diffDays === 1) {
    return `${diffDays}d ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) {
      return `${diffMonths}mo ago`;
    } else {
      return `${diffMonths}mo ago`;
    }
  } else {
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) {
      return `${diffYears}y ago`;
    } else {
      return `${diffYears}y ago`;
    }
  }
};

const getExactDate = (date: string) => {
  if (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } else {
    return "";
  }
};

export default getFormattedDateHelperUtil;
