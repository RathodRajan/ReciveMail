

const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;
const HostName = process.env.HOST || "127.0.0.1";

// CORS configuration
const corsOptions = {
  origin: '*', 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true })); // To handle form data
app.use(bodyParser.json({ limit: "400mb" })); // To handle JSON data

// Home route to display the form
app.get("/", (req, res) => {
  res.send(`
    <form action="https://recive-mail.vercel.app/send-email" method="post">
      <label for="name">Name:</label>
      <input type="text" name="name" placeholder="Enter name" required><br>
      <label for="email">Email:</label>
      <input type="email" name="email" placeholder="Enter email" required><br>
      <label for="subject">Subject:</label>
      <input type="text" name="subject" placeholder="Enter subject" required><br>
      <label for="message">Message:</label>
      <textarea name="message" placeholder="Enter message" required></textarea><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Route to handle email sending
app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(email);
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Create a transporter object using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
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

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email." });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ success: true, message: "Email sent successfully!" });
    }
  });
});

// Start the server
app.listen(PORT, HostName, () => {
  console.log(`Server is running on http://${HostName}:${PORT}`);
});
