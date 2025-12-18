import * as serviceService from '../../services/service.service.js';

export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
