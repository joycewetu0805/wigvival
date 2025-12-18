export const generateReference = (prefix = 'WIG') =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const formatMoney = (amount) =>
  Number(amount).toFixed(2);

export const isFutureDate = (date) =>
  new Date(date) > new Date();
