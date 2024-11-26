const sqlite3 = require('sqlite3');
const path = require('path');

class ContactosModel {
  constructor() {
    const querydb = path.join(__dirname, "/db", "db.db");
    this.db = new sqlite3.Database(querydb, (err) => {
      let question = err ? 'Error' : 'success';
      console.log(question);
    });
  }
  connect() {
    this.db.run('CREATE TABLE IF NOT EXISTS contactos(correo VARCHAR(255), nombre VARCHAR(255), comentario TEXT,ip TEXT,fecha TEXT)');
  }
  save(correo, nombre, comentario, ip, fecha, pais) {
    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?)", [correo, nombre, comentario, ip, fecha]);
  }
}

module.exports = ContactosModel