// /utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = (user, token) => {
    const emailContent = `
        <h1>Cambio de Contraseña</h1>
        <p>Utiliza el siguiente código para cambiar tu contraseña:</p>
        <h2>${token}</h2>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Código de Verificación para Cambio de Contraseña',
        html: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};
