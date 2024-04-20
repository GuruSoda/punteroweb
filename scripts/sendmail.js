const config = require('../config')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fabricio" <planetaguru@yahoo.com.ar>', // sender address
    to: "fabricio.rossi@gmail.com", // list of receivers
    subject: "Probando nodemailer", // Subject line
    text: "Siempre seremos profugos!", // plain text body
    html: "<b>Siempre seremos Profugos!!!</b>", // html body
  });

console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
