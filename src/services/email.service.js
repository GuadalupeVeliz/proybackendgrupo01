const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"Turismo del Norte" <' + process.env.EMAIL_USER + '>',
            to,
            subject,
            text,
        });
        console.log(`Correo enviado exitosamente a: ${to}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo de notificación.');
    }
};

module.exports = { sendEmail };
