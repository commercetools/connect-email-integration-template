export function getTimeDiffInMinute(startDateString, endDateString) {
  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);
  startDate.setMilliseconds(0);
  endDate.setMilliseconds(0);

  const timeDiffInMinute =
    (endDate.getTime() - startDate.getTime()) / 1000 / 60;
  return timeDiffInMinute;
}
