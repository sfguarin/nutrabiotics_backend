

const { request, response } = require('express');

//Paquete para validar el JWT
const jwt = require('jsonwebtoken');

//Aca estoy importando el modelo de usuario que cree en modelos>usuario.js todo el esquema con sus caracteristicas
const Usuario = require('../models/usuario');



const validarJWT = async (req=request, res=response, next) => {

    //Como extraer el token desde el header que es generalmente donde se recibe el token en postman
    //req.header(nombre como me tienen que mandar en postman mi variable para poderlo entender y procesar)
    const token = req.header('x-token');

    //Error si no se manda token
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        //Verifica que sea un token valido teniendo en cuenta mi SECRETORPRIVATEKEY
        //Asi que en postman, cuando meto el header x-token tiene que ser un token valido como los que genero 
        //en login, de lo contrario arroja de una vez un error y no sigue con next()
        //Ademas de hacer la verificacion me arroja como resultado {uid, iat, exp}={id usuario, fecha que se creo, fecha expiración}
        //Aca extraigo el uid si el token es valido
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid de la base de datos
        const usuario = await Usuario.findById(uid);

        //verificar si el usuario que quiere autenticar existe
        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario que intenta autenticar no existe'
            })
        }

        //Verificar si el usuario tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'El usuario que intenta autenticar ya fue eliminado'
            })
        }

        //darle el valor de usuario a la request que llega al controlador
        req.usuario = usuario;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}