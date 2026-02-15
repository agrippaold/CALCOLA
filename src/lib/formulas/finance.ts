/**
 * Finance formulas — pure functions, no UI dependencies.
 */

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/**
 * Monthly mortgage / loan payment (fixed-rate).
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * @param principal  Loan amount (P)
 * @param annualRate Annual interest rate as percentage (e.g. 5 for 5%)
 * @param years      Loan term in years
 */
export function mortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);

  const r = annualRate / 100 / 12;
  const n = years * 12;
  const factor = Math.pow(1 + r, n);
  return principal * (r * factor) / (factor - 1);
}

/**
 * Compound interest future value.
 * Formula: A = P(1 + r/n)^(nt)
 * @param principal         Initial deposit (P)
 * @param annualRate        Annual rate as percentage
 * @param years             Number of years (t)
 * @param compoundsPerYear  Compounding frequency (n), default 12
 */
export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number = 12,
): number {
  if (principal <= 0 || years <= 0) return principal;
  const r = annualRate / 100;
  return principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
}

/**
 * Monthly loan payment — alias for mortgagePayment (same formula).
 */
export function loanPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  return mortgagePayment(principal, annualRate, years);
}

/**
 * Simple interest.
 * Formula: I = P * r * t
 */
export function simpleInterest(
  principal: number,
  annualRate: number,
  years: number,
): number {
  return principal * (annualRate / 100) * years;
}

/**
 * Return on Investment.
 * Formula: ROI = ((gain - cost) / cost) * 100
 */
export function roi(gain: number, cost: number): number {
  if (cost === 0) return 0;
  return ((gain - cost) / cost) * 100;
}

/**
 * Savings growth with regular monthly contributions.
 * Formula: FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
 * @param initialDeposit  Starting amount (P)
 * @param monthlyContrib  Monthly contribution (PMT)
 * @param annualRate      Annual rate as percentage
 * @param years           Number of years
 */
export function savingsGrowth(
  initialDeposit: number,
  monthlyContrib: number,
  annualRate: number,
  years: number,
): number {
  if (years <= 0) return initialDeposit;
  const r = annualRate / 100 / 12;
  const n = years * 12;

  if (r === 0) {
    return initialDeposit + monthlyContrib * n;
  }

  const factor = Math.pow(1 + r, n);
  const compoundedPrincipal = initialDeposit * factor;
  const compoundedContributions = monthlyContrib * ((factor - 1) / r);
  return compoundedPrincipal + compoundedContributions;
}

/**
 * Generate a full amortization schedule.
 */
export function amortizationSchedule(
  principal: number,
  annualRate: number,
  years: number,
): AmortizationRow[] {
  const monthly = mortgagePayment(principal, annualRate, years);
  if (monthly === 0) return [];

  const r = annualRate / 100 / 12;
  const n = years * 12;
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPart = monthly - interest;
    balance = Math.max(balance - principalPart, 0);
    rows.push({
      month: i,
      payment: monthly,
      principal: principalPart,
      interest,
      balance,
    });
  }
  return rows;
}
