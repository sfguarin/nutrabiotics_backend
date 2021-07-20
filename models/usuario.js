
//Importar los metodos de mongoose que necesito para crear un modelo de usuario
const { Schema, model } = require('mongoose');

//definición de mi schema (propiedades o caracteristicas que tiene que completar el usuario para registrase)
const UsuarioSchema = Schema({

    //Todas estas son las propiedades o las caracteristicas que tiene que llenar el usuario para crear su perfil

    //Nombre que es de tipo String y lo tiene que llenar obligatoriamente
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    //unique significa que solo puede existir un correo electronico unico, no puede existir otro igual en la 
    //base de datos
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    //La imagen no es obligatoria 
    img: {
        type: String
    },

    //emun son como los dos roles unicos que puede escoger el usuario, admin o usuario, no puede tener otro mas
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },

    //Si es un usuario activo, es de tipo boolean, que tiene por defecto valor de true
    estado: {
        type: Boolean,
        default: true
    },

    //Si el usuario se registro con una cuenta de google, que tiene por defecto valor de false a menos que se 
    //indique lo contrario
    google: {
        type: Boolean,
        default: false
    }

});


//Esto se crea para restringir que se muestra en la respuesta JSON mostrada en postman (para que no se vea el password
//y la version). Es necesario usar function ya que cuando extraigo las propiedades de un objeto y utilizo this
//necesito que se conserven, mientras que la función flecha mantiene el this fuera de la misma
UsuarioSchema.methods.toJSON =  function() {
    //Aca separo el __v y el password del resto que lo llame (usuario) y solo retorno el usuario
    const {__v, password, _id,...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

//Esta exportación es diferente, se exporta como tal el metodo model ('nombre del objeto que estoy creando',
//'esquema de propiedades de dicho objeto que definimos anteriormente')
module.exports = model( 'Usuario', UsuarioSchema );