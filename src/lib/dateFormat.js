const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toValidDate(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function formatDate(dateInput, fallback = "-") {
  const date = toValidDate(dateInput);
  if (!date) {
    return fallback;
  }
  return DATE_FORMATTER.format(date);
}

export function formatDateTime(dateInput, fallback = "-") {
  const date = toValidDate(dateInput);
  if (!date) {
    return fallback;
  }
  return DATETIME_FORMATTER.format(date);
}

export function formatInputDateValue(inputDateValue, fallback = "-") {
  if (!inputDateValue) {
    return fallback;
  }

  const value = String(inputDateValue);
  const parts = value.split("-");
  if (parts.length !== 3) {
    return formatDate(value, fallback);
  }

  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return fallback;
  }

  return `${day}/${month}/${year}`;
}
