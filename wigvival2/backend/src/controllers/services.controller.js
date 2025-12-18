import serviceService from '../services/service.service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAll();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('❌ getAllServices error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services',
    });
  }
};
