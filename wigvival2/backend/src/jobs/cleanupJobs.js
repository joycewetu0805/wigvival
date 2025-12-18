import prisma from '../config/prisma.js';

export const cleanupExpiredAppointments = async () => {
  const now = new Date();

  await prisma.appointment.deleteMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: new Date(now.getTime() - 1000 * 60 * 60 * 24)
      }
    }
  });

  console.log('Expired appointments cleaned');
};
