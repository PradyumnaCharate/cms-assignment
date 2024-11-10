const calculateShiftDuration = (
  startsAt,
  endsAt,
  breakStartsAt = null,
  breakEndsAt = null
) => {
  const startTime = new Date(`2000-01-01T${startsAt}`);
  const endTime = new Date(`2000-01-01T${endsAt}`);

  // If end time is before start time, add one day to end time
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  let shiftDuration = endTime - startTime;

  // If break times are provided, subtract break duration
  if (breakStartsAt !== null && breakEndsAt !== null) {
    const breakStartTime = new Date(`2000-01-01T${breakStartsAt}`);
    const breakEndTime = new Date(`2000-01-01T${breakEndsAt}`);

    // If break end time is before break start time, add one day to break end time
    if (breakEndTime < breakStartTime) {
      breakEndTime.setDate(breakEndTime.getDate() + 1);
    }

    const breakDuration = breakEndTime - breakStartTime;
    shiftDuration -= breakDuration;
  }

  // If shift duration is negative (night shift), add one day
  if (shiftDuration < 0) {
    shiftDuration += 24 * 60 * 60 * 1000; // Add one day in milliseconds
  }

  const totalSeconds = Math.floor(shiftDuration / 1000);
  return totalSeconds;
};

module.exports = calculateShiftDuration;
