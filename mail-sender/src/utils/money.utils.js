export function convertMoneyToText(money) {
  if (
    money.type === 'centPrecision' &&
    money.centAmount &&
    money.fractionDigits
  ) {
    let amount = money.centAmount / Math.pow(10, money.fractionDigits);
    return money.currencyCode + ' ' + amount;
  }
  return '';
}
