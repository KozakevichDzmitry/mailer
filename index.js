const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require('dotenv').config()

const app = express();


// body parser middleware
app.use(express.json());
app.use(express.urlencoded( { extended: false } )); // this is to handle URL encoded data
// end parser middleware


// enable static files pointing to the folder "public"
// this can be used to serve the index.html file
app.use(express.static(path.join(__dirname, "/")));

app.post("/email", function(request, response) {

    const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // (замените звездочики на название вашего почтового ящика gmail)
                pass: process.env.PASS, // (замените звездочики на название вашего почтового ящика)
            }
        },
        {
            from: `Mailer Test <${process.env.EMAIL}>` // (замените звездочики на название вашего почтового ящика gmail)
        });

    let mail = {
        to: 'kozakevichdm@gmail.com', // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
        subject: "Mail From Contact Form", // Subject line
        text: `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`,
        html: `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`,
    };

    // send mail with defined transport object
    transporter.sendMail(mail, function (err, info) {
        if(err) {
            console.log(err);
            response.json({ message: "message not sent: an error occured; check the server's console log" });
        }
        else {
            response.json({ message: `message sent: ${info.messageId}` });
        }
    });
});


// set port from environment variable, or 8000
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));