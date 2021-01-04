const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

class Mailer{
    constructor(){
        this.from = "Newsprint <noreply@newsprint.app>";
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: true, // upgrade later with STARTTLS
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
            }
          });
    }

    checkTransporter(){
        
    }

    send(data){
        this.transporter.verify()
        .then(result => {
            if(result === false)
                return;

            let message = {
                from: this.from,
                to: data.to,
                subject: data.subject,
                text: data.plainText,
                html: data.html
            };

            this.transporter.sendMail(message, (error, info) => {
                if(error){
                    console.log(error);
                    return;
                }
            });
        })
        .catch(error => {
            console.log(error);
            return false;
        })
    }
}

module.exports = Mailer;