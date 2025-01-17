# ✅Implementación de Funcionalidades

A continuación se describen las funcionalidades que se han implementado en este proyecto, que incluyen la verificación de Google reCAPTCHA, la obtención de información geográfica basada en la dirección IP, el envío de correos electrónicos utilizando **Nodemailer** y la integración con **Google Analytics**.

## 1. Función `async googleRecaptcha(req, res)`

### Descripción:
Esta función se encarga de verificar el token generado por **Google reCAPTCHA** en el lado del servidor para garantizar que el usuario es humano.

### Parámetros:
- `req`: La solicitud HTTP recibida que contiene el token de reCAPTCHA enviado por el frontend.
- `res`: La respuesta HTTP que será enviada al cliente.

### Proceso:
1. Obtiene la clave secreta de reCAPTCHA desde la variable de entorno `GOOGLEKEYSECRET`.
2. Extrae el token generado en el frontend desde `req.body["g-recaptcha-response"]`.
3. Envía una solicitud HTTP a la API de Google para verificar el token.
4. Recibe y procesa la respuesta de la API de Google.
5. Devuelve un objeto JSON con el resultado de la verificación de reCAPTCHA.

### Ejemplo:
```js
const secret_key = process.env.GOOGLEKEYSECRET;
const response_key = req.body["g-recaptcha-response"];
const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

const fetchRecaptcha = await fetch(url, { method: "post" });
const responseRecaptcha = await fetchRecaptcha.json();
return responseRecaptcha;
```
## 2. Función `async ipCountry(ip)`

### Descripción:
Esta función se encarga de obtener la información geográfica relacionada con una dirección IP específica mediante la API pública de **ipwho.is**.

### Parámetros:
- `ip`: La dirección IP a partir de la cual se extraerá la información geográfica.

### Proceso:
1. Realiza una solicitud HTTP a la API de **ipwho.is** utilizando la dirección IP proporcionada.
2. Recibe y procesa la respuesta, que contiene información detallada como el país, la región y otros datos de la IP.
3. Devuelve un objeto JSON con los datos geográficos de la IP.

### Ejemplo:
```js
const ipFetch = await fetch("http://ipwho.is/" + ip);
const response = await ipFetch.json();
return response;
```

## 3. Función `async nodemailerSend(email, name, commentary, ip, ipCountry, fecha)`

### Descripción:
Esta función utiliza el paquete **Nodemailer** para enviar un correo electrónico con los datos del formulario de contacto.

### Parámetros:
- `email`: Dirección de correo electrónico del remitente.
- `name`: Nombre del remitente.
- `commentary`: Comentario o mensaje enviado.
- `ip`: Dirección IP del remitente.
- `ipCountry`: País asociado a la dirección IP del remitente.
- `fecha`: Fecha y hora en que se envió el formulario.

### Proceso:
1. Crea una configuración de transporte para **Nodemailer** utilizando el servicio de **Gmail**.
2. Define el contenido del correo electrónico en formato HTML y texto plano.
3. Intenta enviar el correo electrónico con la función `sendMail()`.
4. Si el envío es exitoso, se registra en la consola el identificador del mensaje.
5. En caso de error, el error se registra en la consola.

### Ejemplo:
```js
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

let message = {
  from: process.env.EMAIL,
  to: 'programacion2ais@dispostable.com',
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
```

## 4. Integración de Google Analytics

### Descripción:
Se ha añadido el código de seguimiento de **Google Analytics** para obtener métricas sobre el uso del sitio web y el comportamiento de los usuarios.

### Código:
```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());

  gtag('config', 'G-KBCQPSN0S2');
</script>
```
