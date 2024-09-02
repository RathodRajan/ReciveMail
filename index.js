const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const HostName = process.env.HOST || "127.0.0.1";


const corsOptions = {
  origin: '*', 
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(express.json({ limit: "400mb" }));


app.post("/send-email", (req, res) => {

  const { name, email, subject, message } = req.body;

  if(name && email && subject && message){

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `[${subject}] , [${email}]`,
      html: `
        <html>
          <body style="color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="padding: 5px;">
              <div style="margin-top: 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                <h4 style="text-align: center; color: #4CAF50; border-bottom: 1px solid #ddd; margin-bottom: 15px;">Customer Detail</h4>
                <p style="font-size: 16px; margin: 10px 0;">
                  <strong style="color: #333;">Customer Name:</strong>
                  <span style="color: green; font-weight: bold;">${name}</span>
                </p>
                <p style="font-size: 16px; margin: 10px 0;">
                  <strong style="color: #333;">Customer Email:</strong>
                  <span style="color: orange; font-weight: bold;">${email}</span>
                </p>
              </div>
  
              <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                <h4 style="text-align: center; color: #4CAF50; border-bottom: 1px solid #ddd; margin-bottom: 15px;">Subject</h4>
                <p style="font-size: 16px; margin: 0;">Subject: ${subject}</p>
              </div>
  
              <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                <h4 style="text-align: center; color: #4CAF50; border-bottom: 1px solid #ddd; margin-bottom: 15px;">Message</h4>
                <p style="font-size: 16px; margin: 0;">${message}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ success: true });
      }
    });
    
  }


});

app.listen(PORT, HostName, () => {
  console.log(`Server is running on http://${HostName}:${PORT}`);
});
