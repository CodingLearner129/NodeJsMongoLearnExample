import nodemailer from 'nodemailer';
import pug from 'pug';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { convert } from 'html-to-text';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// new Email(user, url).sendWelcome();
export default class Email {
    constructor(user, url) {
        this.to = user.email,
        this.firstName = user.name.split(' ')[0],
        this.url = url,
        this.from = process.env.MAIL_FROM_ADDRESS
    }

    newCreateTransport() {
        if (process.env.NODE_ENV.trim() === "production") {
            // SENDGRID
            return nodemailer.createTransport({
                service: 'SendGrid', // we don't need to pass host and port if we use service
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                }
            });

            return 1;
        }
        // 1) Create a transporter
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
            // Activate in gmail "less secure app" option
        });
    }

    // Send the actual template
    async send(template, subject){
        // 1) Render HTML based on a pug template
        // res.render('');
        const html = pug.renderFile(path.join(__dirname, `./../views/emails/${template}.pug`), {
            firstName: this.firstName,
            subject,
            url: this.url
        });

        // 2) Define email options
        const emailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        }

        // 3) create a transport and send email
        await this.newCreateTransport().sendMail(emailOptions);
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!");
    }

    async sendPasswordReset() {
        await this.send("passwordReset", "Your reset password token (valid for only 10 minutes)");
    }
}

// export const sendEmail = async options => {
//     // 1) Create a transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.MAIL_HOST,
//         port: process.env.MAIL_PORT,
//         auth: {
//             user: process.env.MAIL_USERNAME,
//             pass: process.env.MAIL_PASSWORD,
//         }
//         // Activate in gmail "less secure app" option
//     });

//     // 2) Define the email options
//     const emailOptions = {
//         from: process.env.MAIL_FROM_ADDRESS,
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//         // html 
//     }

//     // 3) Actually send the email
//     await transporter.sendMail(emailOptions);
// }