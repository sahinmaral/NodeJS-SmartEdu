const nodemailer = require('nodemailer');

exports.sendInputToEmail = async (contact) => {
  const outputMessage = `
    <h1>Mail Details </h1>
    <ul>
        <li>Name : ${contact.name} </li>
        <li>Email : ${contact.email} </li>
    </ul>
    <h1>Message</h1>
    <p>${contact.message}</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAILSERVICE_SENDEREMAIL,
    port: 2587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILSERVICE_USER, // generated ethereal user
      pass: process.env.MAILSERVICE_PASSWORD, // generated ethereal password
    },
  });

  await transporter.sendMail({
    from: `"SMART EDU Contact Form" <${contact.email}>`,
    to: process.env.MAILSERVICE_RECEIVEREMAIL,
    subject: `SMART EDU Contact Form New Message from ${contact.name}`,
    html: outputMessage,
  });
};
