import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendApprovalEmail = (order, emailContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.correo,
        subject: 'Tu Pedido fue Aprobado',
        html: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};
