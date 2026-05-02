require('dotenv').config({quiet: true})
const nodemailer = require("nodemailer");
const user = process.env.SMTP_USER
const password = process.env.SMTP_PASSWORD

// Create a transporter using SMTP
const EmailSend = async (EmailTo, EamilText, EamilSubject) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: password
        },
    });

    let mailOption = {
        from: `"Multiple Blogging App Solution" <${user}>`,
        to: EmailTo,
        subject: EamilSubject,
        text: EamilText
    }

    return await transport.sendMail(mailOption)
}

module.exports = EmailSend
