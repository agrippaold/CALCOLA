/**
 * Date calculation formulas — pure functions, no UI dependencies.
 */

/**
 * Calculate age from birth date to a reference date (defaults to today).
 * Returns years, months, days.
 */
export function calculateAge(
  birthDate: Date | string,
  referenceDate?: Date | string,
): { years: number; months: number; days: number; totalDays: number } {
  const birth = new Date(birthDate);
  const ref = referenceDate ? new Date(referenceDate) : new Date();

  if (isNaN(birth.getTime()) || isNaN(ref.getTime())) {
    return { years: 0, months: 0, days: 0, totalDays: 0 };
  }

  const totalDays = Math.floor(
    (ref.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
  );

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, totalDays: Math.max(0, totalDays) };
}

/**
 * Calculate the difference between two dates.
 * Returns years, months, days, weeks, and total days.
 */
export function dateDifference(
  startDate: Date | string,
  endDate: Date | string,
): { years: number; months: number; days: number; totalDays: number; weeks: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { years: 0, months: 0, days: 0, totalDays: 0, weeks: 0 };
  }

  const age = calculateAge(start, end);
  const weeks = Math.floor(age.totalDays / 7);

  return { ...age, weeks };
}
