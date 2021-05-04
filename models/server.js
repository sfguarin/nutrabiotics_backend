//Clase que me permite hacer mi webserver y llevarlo a un localhost, lo hago como clase para que no quede tan 
//saturado de información mi archivo de ejecución app.js

//Importo paquete express
const express = require('express')

//Paquete cors que sirve para proteger nuestro servidor y restringir el acceso de sitios web
const cors = require('cors')

//Creación de clase que voy a exportar a app.js
class Server {

    //Constructor donde defino variables y llamo funciones que cree dentro de la clase y se disparan
    //cuando llamo la clase
    constructor() {
        //definicion de variable app
        this.app = express();

        //definición de variable port
        this.port = process.env.PORT;

        //Ruta para los usuarios
        this.usuariosPath = '/api/usuarios'

        //Middlewares: Servidor del contenido de la carpeta publica, restricción de sitios web
        this.middlewares();

        //subrutas de mi aplicación
        this.routes();
    }

    middlewares() {

        //Cors
        this.app.use( cors() );

        //lectura y parseo del body (postman)
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {

        //funcion para llamar las rutas puestas en ../routes/usuarios, con la dirección con la que yo quiero que se
        //encuentre this.usuariosPath
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
          
    }

    //el listen lo ejecuto desde app.js
    listen() {

        this.app.listen(this.port, () => {

            console.log('Servidor corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;