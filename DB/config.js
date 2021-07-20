
//Importar el paquete mongoose
const mongoose = require('mongoose');

//Metodo de conexión con mongoDB Atlas, debe ser un async
const dbConnection = async() => {

    //Tiene que haber un try y catch por si algo sale mal con la conexión saberlo
    try {
        
        //El await que tiene la función para hacer la conexión usando la variable de entorno que tiene 
        //la URL de la conexión con mongoAtlas
        await mongoose.connect(process.env.MONGODB_ATLAS, { 

            //Parametros que toca poner con esos valores para permitir la conexión 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            //esto se deja en false para poder actualizar la data
            useFindAndModify: false
        });

        //Mensaje que se imprime si todo sale bien 
        console.log('Base de datos online');

    } 
    
    //Error que se imprime si algo sale mal al hacer la conexión con la base de datos
    catch (error) {

        //Impresión del error 
        console.log(error);
        throw new Error ('Error al iniciar la base de datos');
        
    }


}

//exportar el metodo de conexión para utilizarlo en el server.js
module.exports = {
    dbConnection
}