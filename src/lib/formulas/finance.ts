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
 * Calculate tip amount and total bill.
 * @param billAmount   Bill before tip
 * @param tipPercent   Tip percentage (e.g. 20 for 20%)
 * @param splitWays    Number of people splitting the bill (default 1)
 */
export function tipCalculation(
  billAmount: number,
  tipPercent: number,
  splitWays: number = 1,
): { tipAmount: number; totalBill: number; perPerson: number } {
  if (billAmount <= 0 || tipPercent < 0) {
    return { tipAmount: 0, totalBill: billAmount, perPerson: billAmount };
  }
  const tipAmount = billAmount * (tipPercent / 100);
  const totalBill = billAmount + tipAmount;
  const split = Math.max(splitWays, 1);
  return { tipAmount, totalBill, perPerson: totalBill / split };
}

/**
 * Calculate sales tax and total price.
 * @param price     Price before tax
 * @param taxRate   Sales tax rate as percentage
 */
export function salesTax(
  price: number,
  taxRate: number,
): { taxAmount: number; totalPrice: number } {
  if (price <= 0 || taxRate < 0) {
    return { taxAmount: 0, totalPrice: price };
  }
  const taxAmount = price * (taxRate / 100);
  return { taxAmount, totalPrice: price + taxAmount };
}

/**
 * Calculate VAT (Value Added Tax).
 * Supports both adding VAT to a net price and extracting VAT from a gross price.
 * @param amount    The amount (net or gross depending on mode)
 * @param vatRate   VAT rate as percentage (e.g. 20 for 20%)
 * @param mode      'add' = add VAT to net, 'extract' = extract VAT from gross
 */
export function vatCalculation(
  amount: number,
  vatRate: number,
  mode: 'add' | 'extract' = 'add',
): { netPrice: number; vatAmount: number; grossPrice: number } {
  if (amount <= 0 || vatRate < 0) {
    return { netPrice: amount, vatAmount: 0, grossPrice: amount };
  }
  if (mode === 'add') {
    const vatAmount = amount * (vatRate / 100);
    return { netPrice: amount, vatAmount, grossPrice: amount + vatAmount };
  }
  // extract: amount is gross
  const netPrice = amount / (1 + vatRate / 100);
  const vatAmount = amount - netPrice;
  return { netPrice, vatAmount, grossPrice: amount };
}

/**
 * US CPI data (annual average, base 1982-84=100).
 * Source: Bureau of Labor Statistics, CPI-U All Items.
 */
export const US_CPI_DATA: Record<number, number> = {
  1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8, 1918: 15.0,
  1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1,
  1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.2, 1929: 17.2, 1930: 16.7,
  1931: 15.2, 1932: 13.6, 1933: 12.9, 1934: 13.4, 1935: 13.7, 1936: 13.9,
  1937: 14.4, 1938: 14.1, 1939: 13.9, 1940: 14.0, 1941: 14.7, 1942: 16.3,
  1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3, 1948: 24.0,
  1949: 23.8, 1950: 24.1, 1951: 26.0, 1952: 26.6, 1953: 26.8, 1954: 26.9,
  1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.2, 1960: 29.6,
  1961: 29.9, 1962: 30.3, 1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.5,
  1967: 33.4, 1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8,
  1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2,
  1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9,
  1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0, 1990: 130.7,
  1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9,
  1997: 160.5, 1998: 163.0, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9,
  2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.3, 2008: 215.3,
  2009: 214.5, 2010: 218.1, 2011: 224.9, 2012: 229.6, 2013: 233.0, 2014: 236.7,
  2015: 237.0, 2016: 240.0, 2017: 245.1, 2018: 251.1, 2019: 255.7, 2020: 258.8,
  2021: 271.0, 2022: 292.7, 2023: 304.7, 2024: 313.0, 2025: 319.0,
};

/**
 * Calculate historical inflation between two years using CPI data.
 */
export function historicalInflation(
  amount: number,
  fromYear: number,
  toYear: number,
): { adjustedValue: number; cumulativeRate: number; avgAnnualRate: number } | null {
  const fromCPI = US_CPI_DATA[fromYear];
  const toCPI = US_CPI_DATA[toYear];
  if (!fromCPI || !toCPI || amount <= 0) return null;

  const adjustedValue = amount * (toCPI / fromCPI);
  const cumulativeRate = ((toCPI - fromCPI) / fromCPI) * 100;
  const years = Math.abs(toYear - fromYear);
  const avgAnnualRate = years > 0
    ? (Math.pow(toCPI / fromCPI, 1 / years) - 1) * 100
    : 0;

  return { adjustedValue, cumulativeRate, avgAnnualRate };
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
