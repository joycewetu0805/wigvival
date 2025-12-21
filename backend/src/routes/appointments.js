import { Router } from 'express';

const router = Router();

// Liste des rendez-vous (placeholder)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Création rendez-vous (placeholder)
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Rendez-vous créé (placeholder)'
  });
});

export default router;
