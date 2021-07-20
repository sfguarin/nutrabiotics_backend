
//Utilizar variables de entorno
require('dotenv').config()


//Importartar modelo que voy a ejecutar
const Server = require('./models/server')


//creación y ejecución del modelo que ejecuto 
const server = new Server();

//Despliegue en el servidor 
server.listen();