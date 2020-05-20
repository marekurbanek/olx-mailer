const nodemailer = require("nodemailer");

async function sendEmail(email) {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  let info = await transporter.sendMail(email);

  console.log("Message sent: %s", info.messageId);
}

async function sendNewPostEmail(post) {
  const newPostHtml = `
    <div>Nowe ogłoszenie garażu za ${post.price}</div>
    <a href="${post.link}">${post.title}</a>
  `;

  const email = {
    from: '"Marek 👻" marek.urbi@gmail.com', // sender address
    to: process.env.MAILER_RECEIPENTS, // list of receivers
    subject: "Nowy Garaż ✔", // Subject line
    html: newPostHtml, // html body
  };
  return sendEmail(email);
}

module.exports = sendNewPostEmail;
