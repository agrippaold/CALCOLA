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
 * Auto loan monthly payment with down payment and trade-in.
 * @param vehiclePrice  Total vehicle price
 * @param downPayment   Down payment amount
 * @param tradeInValue  Trade-in value of existing vehicle
 * @param annualRate    Annual interest rate as percentage
 * @param years         Loan term in years
 */
export function autoLoanPayment(
  vehiclePrice: number,
  downPayment: number,
  tradeInValue: number,
  annualRate: number,
  years: number,
): number {
  const loanAmount = vehiclePrice - downPayment - tradeInValue;
  if (loanAmount <= 0) return 0;
  return mortgagePayment(loanAmount, annualRate, years);
}

/**
 * Investment future value with initial amount and regular contributions.
 * @param initialAmount   Starting investment
 * @param monthlyContrib  Monthly contribution
 * @param annualReturn    Expected annual return as percentage
 * @param years           Investment horizon in years
 */
export function investmentGrowth(
  initialAmount: number,
  monthlyContrib: number,
  annualReturn: number,
  years: number,
): number {
  return savingsGrowth(initialAmount, monthlyContrib, annualReturn, years);
}

/**
 * Adjust a value for inflation (what today's amount will buy in the future).
 * Formula: adjustedValue = presentValue / (1 + rate/100)^years
 */
export function inflationAdjust(
  presentValue: number,
  annualRate: number,
  years: number,
): number {
  if (years <= 0 || annualRate === 0) return presentValue;
  return presentValue / Math.pow(1 + annualRate / 100, years);
}

/**
 * Future cost of something accounting for inflation.
 * Formula: futureValue = presentValue * (1 + rate/100)^years
 */
export function inflationFutureValue(
  presentValue: number,
  annualRate: number,
  years: number,
): number {
  if (years <= 0 || annualRate === 0) return presentValue;
  return presentValue * Math.pow(1 + annualRate / 100, years);
}

/**
 * Convert currency using an exchange rate.
 * @param amount  Amount in source currency
 * @param rate    Exchange rate (1 source = rate target)
 */
export function currencyConvert(amount: number, rate: number): number {
  if (rate <= 0) return 0;
  return amount * rate;
}

/**
 * Calculate discount price and savings.
 * @param originalPrice  Original price
 * @param discountPct    Discount percentage (e.g. 20 for 20%)
 */
export function discountPrice(
  originalPrice: number,
  discountPct: number,
): { finalPrice: number; savings: number } {
  if (originalPrice <= 0 || discountPct <= 0) {
    return { finalPrice: originalPrice, savings: 0 };
  }
  const savings = originalPrice * (discountPct / 100);
  return { finalPrice: originalPrice - savings, savings };
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
