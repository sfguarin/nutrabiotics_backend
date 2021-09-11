//Clase que me permite hacer mi webserver y llevarlo a un localhost, lo hago como clase para que no quede tan 
//saturado de información mi archivo de ejecución app.js

//Importo paquete express para manejar el despliegue, digamos que sustituye el front
const express = require('express')

//Paquete cors que sirve para proteger nuestro servidor y restringir el acceso de sitios web
const cors = require('cors');

//Función que importo para hacer la conexión con mongo
const { dbConnection } = require('../DB/config');

//Paquete para realizar la carga de archivos
const fileUpload = require('express-fileupload');

const path = require('path');

//Creación de clase que voy a exportar a app.js
class Server {

    //Constructor donde defino variables y llamo funciones que cree dentro de la clase y se disparan
    //cuando llamo la clase
    constructor() {
        //definicion de variable app
        this.app = express();

        //definición de variable port, el puerto que voy a utilizar
        this.port = process.env.PORT;

        //Rutas para que los usuarios puedan acceder a mis interacciones get, post, put, delete
        //Esto se usa para cuando existen muchas rutas y se vea mas ordenado
        this.paths = {
            
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads'
        }

        //Ruta para los usuarios, donde voy hacer mis interacciones get, post, put, delete
        //Esto se deja para fines didacticos para cuando se tienen pocas direcciones url
        //this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares: Servidor del contenido de la carpeta publica, restricción de sitios web
        this.middlewares();

        //subrutas de mi aplicación
        this.routes();
    }

    async conectarDB() {

        await dbConnection();
    }

    //Función que se ejecuta antes de llamar ya sea un controlador o seguir con la ejecución de mis peticiones
    middlewares() {

        // Cors - Permite proteger nuestro servidor 
        this.app.use( cors() );

        //lectura y parseo del body (postman)
        this.app.use( express.json() );

        //Directorio publico, para hacer uso del html que se ubica en la carpeta public (encargado del front)
        this.app.use( express.static('public') );

        this.app.get( '*', (req, res) =>{
            res.sendFile( path.resolve('./public/index.html'));
        });

        //Middleware para realizar la carga de archivos usando el paquete express-fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            //Para crear carpetas si el usuario manda el argumento dentro del path, por default esta en false y 
            //tocaria crear las carpetas manualmente, esto puede ser bueno o malo dependiendo del problema
            createParentPath: true
        }));
        
    }

    routes() {

        //funcion para llamar los endpoints puestos en ../routes/auth, con la dirección con la que yo quiero que 
        //se encuentren. this.app.use(url, ubicación donde se encuentra los endpoints. 
        //Esto con el fin de hacer la autenticación del usuario.
        this.app.use(this.paths.auth, require('../routes/auth'));

        //funcion para llamar los endpoints puestos en ../routes/buscar con el url /api/buscar
        this.app.use(this.paths.buscar, require('../routes/buscar'));

        //funcion para llamar los endpoints puestos en ../routes/productos con el url /api/productos
        this.app.use(this.paths.productos, require('../routes/productos'));

        
        //funcion para llamar los endpoints puestos en ../routes/usuarios, con la dirección con la que yo quiero que 
        //se encuentren. this.app.use(url, ubicación donde se encuentra los endpoints. 
        //Esto con el fin de hacer interacciones con los usuarios
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));

        //funcion para llamar los endpoints puestos en ../routes/uploads con el url /api/uploads
        this.app.use(this.paths.uploads, require('../routes/uploads'));

          
    }

    //el listen lo ejecuto desde app.js
    listen() {

        this.app.listen(this.port, () => {

            console.log('Servidor corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;