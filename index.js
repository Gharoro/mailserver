const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

/** Enable CORS **/
app.use(cors());

/** Express/Bodyparser middleware */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("My mailer");
});

app.post("/send-mail", async (req, res) => {
  const { name, subject, email, message } = req.body;
  if (!name || !subject || !email || !message) {
    return res.status(400).json({
      message: "Hello! Kindly fill all fields.",
    });
  }

  try {
    await axios({
      method: "post",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "api-key": process.env.MAIL_API_KEY,
        "content-type": "application/json",
      },
      data: {
        sender: {
          name: name,
          email: email,
        },
        to: [
          {
            email: "gharoropureheart@gmail.com",
            name: "Pureheart Gharoro",
          },
        ],
        subject: subject,
        htmlContent: message,
      },
    });

    return res.status(200).json({
      message:
        "Thank you for contacting me! I will get back to you as soon as I can!",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message:
        "Hi! I cannot receive emails at the moment. Kindly try again later. Thank you!",
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
