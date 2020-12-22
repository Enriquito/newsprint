const nodemailer = require('nodemailer');

class Mailer{
    constructor(){
        this.from = "Newsprint <noreply@newsprint.app>";
        this.transporter = nodemailer.createTransport({
            host: "mail.newsprint.app",
            port: 465,
            secure: true, // upgrade later with STARTTLS
            auth: {
              user: "noreply@newsprint.app",
              pass: "Qybcz8qRjT%hKL2ujnN9@X"
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