const ContactosModel = require('./ContactosModel');
const nodemailer = require("nodemailer");
require('dotenv').config()
class ContactosController {
  constructor() {
    this.model = new ContactosModel();
    this.model.connect();
  }


  async getFecha() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let dateTime = `${day}-${month}-${year}`;
    let time = `${hours}:${minutes}:${seconds} ${ampm}`;
    return `${dateTime} ${time}`;

  }


  async googleRecaptcha(req, res) {
    const secret_key = process.env.GOOGLEKEYSECRET
    const response_key = req.body["g-recaptcha-response"];
    const url =
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    const fetchRecaptcha = await fetch(url, { method: "post" });
    const responseRecaptcha = await fetchRecaptcha.json();
    return responseRecaptcha
  }


  async ipCountry(ip) {
    const ipFetch = await fetch("http://ipwho.is/" + ip)
    const response = await ipFetch.json();
    return response
  }


  async nodemailerSend(email, name, commentary, ip, ipCountry, fecha) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,            
      auth: {
        user: process.env.EMAIL,  
        pass: process.env.PASSWORD,      
      },
    });

    let message = {
      from: process.env.EMAIL,
      to:'programacion2ais@dispostable.com',
      subject: 'Datos del contacto..',
      text: 'Un nuevo formulario ha sido enviado',
      html: `
      <h2>Datos:</h2>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Comentario:</b> ${commentary}</p>
      <p><b>IP:</b> ${ip}</p>
      <p><b>País:</b> ${ipCountry}</p>
      <p><b>Fecha:</b> ${fecha}</p>
    `,
    };

    try {
      let info = await transporter.sendMail(message);
      console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
      console.log('Error al enviar correo:', error);
    }
}



  async add(req, res) {
    const { email, name, commentary } = req.body;
    const fecha = await this.getFecha();
    const response = await this.googleRecaptcha(req, res);
    const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    const getFetch = await this.ipCountry(ip);
    const ipCountry = getFetch.country;
    if (response.success) {
      this.model.save(email, name, commentary, ip, ipCountry, fecha);
      await this.nodemailerSend(email, name, commentary, ip, ipCountry, fecha);
      res.render('index', { 
        key: process.env.GOOGLEKEYPUBLIC,
        alert: true,
				alertTitle: "Confirmado",
				alertMessage: "Su formulario a sido enviado correctamente.",
				alertIcon:'success',
				showConfirmButton:true,
				ruta:''
      });
    } else {
      res.render('index', { 
        key: process.env.GOOGLEKEYPUBLIC,
        alert: true,
        alert: true,
				alertTitle: "Ha ocurrido un error",
				alertMessage: "Completa el reCATPCHA para enviar el formulario.",
				alertIcon:'error',
				showConfirmButton:true,
				ruta:'#contact'
      });
    }
  }
}


module.exports = ContactosController