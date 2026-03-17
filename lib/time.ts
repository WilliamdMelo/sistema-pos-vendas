export function calculateBusinessMinutes(start: Date, end: Date) {
  const startHour = 8;
  const endHour = 18;

  let minutes = 0;
  const current = new Date(start);

  while (current < end) {
    const hour = current.getHours();

    if (hour >= startHour && hour < endHour) {
      minutes++;
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return minutes;
}
