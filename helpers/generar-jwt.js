

const jwt = require('jsonwebtoken');


//Metodo para generar mi JWT, recibe como argumento el uid (user indentify)
const generarJWT = ( uid = '' ) => {

    //Este metodo trabaja basado en promesas
    return new Promise ((resolve, reject) => {

        //la información que voy a grabar en el payload
        const payload = { uid };

        //funcion para generar el jwt----jwt.sign(payload que quiero codificar, secretOrPrivateKey, options, callback)
        //secretOrPrivateKey: LLave secreta que permite firmar tokens,esto es de absoluta confidencialidad
        //porque si cualquier persona la sabe, puede crear tokens como si nada. Dicho esto se deja como una 
        //variable de entorno y tal como la conexion de mongoAtlas se deja vacia para que solo una persona
        //tenga acceso o el encargado de la seguridad
        //Options: Para poner en cuanto tiempo quiero que expire el token
        //Callback: recibo como argumentos un error en caso de suceder y un token que es la respuesta del jwt.sign si 
        //todo sale bien (err,token) la defino como una funcion donde si existe un error disparo el reject con un
        //mensaje de error y de lo contrario mando el resolve con el token de respuesta
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            //expiración de 4 horas para este caso
            expiresIn: '4h'
        },(err, token) => {
            //Si existe un error
            if (err){
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                //Si todo funciona correctamente ejecuto el token
                resolve(token)
            }
        })

    }) 

}


module.exports = {
    generarJWT
}