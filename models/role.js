
//Importar los metodos de mongoose que necesito para crear un modelo de rol
const { Schema, model } = require('mongoose');

//definición de mi schema (propiedades o caracteristicas que tiene que completar el usuario para registrase)
const RoleSchema = Schema({

    //Rol que es de tipo String y lo tiene que llenar obligatoriamente
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});

//Esta exportación es diferente, se exporta como tal el metodo model ('nombre del objeto que estoy creando',
//'esquema de propiedades de dicho objeto que definimos anteriormente')
module.exports = model( 'Role', RoleSchema );