const nodemailer = require('nodemailer');
require('dotenv').config();

const user = process.env.MAIL_USER;

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return await transporter.sendMail({ from: `Convos <${user}>`, to, subject, html });
}

async function sendPasswordReset(to, link) {
  return await sendEmail(to, 'Convos Password Reset', `
    <p>Good day!</p>
    <p>Please click on this <a href="${link}">link</a> to reset your password!</p>
    <p>The link will expire in 1 hour.</p>
  `);
}

module.exports = {
  sendEmail,
  sendPasswordReset,
};