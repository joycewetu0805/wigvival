// Stripe désactivé — webhook volontairement neutre
export default (req, res) => {
  res.status(200).json({ message: 'Stripe webhook disabled (PayPal only)' });
};
