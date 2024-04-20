const nodemailer = require("nodemailer");

const transporterGmail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "fabricio.rossi@gmail.com",
    pass: "fuwlnvbbhtgdnuoc",
  },
});

const transporterYahoo = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "planetaguru@yahoo.com.ar",
      pass: "lvrbitccvgoewyns",
    },
  });
  
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporterYahoo.sendMail({
    from: '"Fabricio" <planetaguru@yahoo.com.ar>', // sender address
    to: "fabricio.rossi@gmail.com", // list of receivers
    subject: "Probando nodemailer", // Subject line
    text: "Siempre seremos profugos!", // plain text body
    html: "<b>Siempre seremos Profugos!!!</b>", // html body
  });

console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
