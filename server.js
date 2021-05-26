const express = require('express')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3030

dotenv.config();

app.use(cors())
app.use(morgan('dev'))
app.use(morgan('tiny', {
    stream: fs.createWriteStream(path.join(__dirname, 'logs'))
}))


app.use(express.urlencoded({ extended: false }));


app.get('/', (req,res)=>{
  res.send("hello")
})

app.post('/send', async (req, res, next) => {
  const {name,email,subject,phone,message} = JSON.parse(Object.keys(req.body)[0])
  console.log(JSON.parse(Object.keys(req.body)[0]));
  console.log(name)
  res.json({msg:'success'})
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact</h3>
  <ul>
    <li>Name: ${name}</li>
    <li>Subject: ${subject}</li>
    <li>Email: ${email}</li>
    <li>Phone No: ${phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${message}</p>
  `
  console.log(process.env.PASSWORD);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: 'lordorionrules@gmail.com',
      pass: 'Sashasmeat404'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"BURJTECH LTD 👻" <lordorionrules@gmail.com>', // sender address
    to: "official_preshi@yahoo.com", // list of receivers
    subject: "Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // res.render('contact', { msg: 'Email has been sent' });

//  console.log(req.body);
})



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})