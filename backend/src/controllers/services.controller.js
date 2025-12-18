import serviceService from '../services/service.service.js';

export const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAll();
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};
