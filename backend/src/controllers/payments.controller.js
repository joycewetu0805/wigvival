import paymentService from '../services/payment.service.js';

export const createDepositPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createDeposit(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};
