import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"WIGVIVAL" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    html
  });
};
