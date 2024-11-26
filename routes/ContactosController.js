const ContactosModel = require('./ContactosModel');

class ContactosController {
    constructor() {
        this.model = new ContactosModel();
        this.model.connect();
      }

      async add(req,res) {
        const { email, name, commentary } = req.body;
        const fecha = new Date();
        const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
        this.model.save(email,name,commentary,ip,fecha);
        res.send({request: 'Formulario enviado'});
      }
}


module.exports = ContactosController