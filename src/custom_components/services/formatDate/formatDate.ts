export function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const toDoEndDate = `${day}.${month}.${year}`;

  const today: Date = getTodayWithoutHours();
  let formattedDate: string = toDoEndDate;

  if (date.toDateString() === today.toDateString()) {
    formattedDate = `<span style="color: red;">${toDoEndDate}</span>`;
  }
  return formattedDate;
}

export function getTodayWithoutHours(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}