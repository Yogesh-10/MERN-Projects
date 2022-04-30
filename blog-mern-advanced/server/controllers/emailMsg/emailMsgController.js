const expressAsyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const Filter = require('bad-words');
const EmailMsg = require('../../models/emailMsg/EmailMessagingModel');

/*
@Author - Yogesh
@Desc   - Send Email to other Users
@Route  - POST/api/email
@Access - Private
*/
const sendEmailMsg = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  //get the message
  const emailMessage = subject + ' ' + message;
  //prevent profanity/bad words
  const filter = new Filter();

  const isProfane = filter.isProfane(emailMessage);
  if (isProfane)
    throw new Error('Email sent failed, because it contains profane words.');

  try {
    //build up msg
    const msg = {
      to,
      subject,
      text: message,
      from: '"Blog-MERN-Advanced" <blog-mern-advanced@gmail.com>',
    };

    //send msg
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    transporter.sendMail(msg);

    //save to DB
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });

    res.json('Mail sent');
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsg };
