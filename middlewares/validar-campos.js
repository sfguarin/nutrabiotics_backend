//request y response de express
const { request, response } = require("express");

//Almacenador de errores de las validaciones hechas en routes>usuarios.js
const { validationResult } = require("express-validator");


//Todos los middlewares deben tener el argumento next
const validarCampos = (req = request, res = response, next) => {


    //Constante que almacena mis errores en la validación que hice con los middlewares en 
    //routes>usuarios.js>router.post.  Siempre tiene que recibir como argumento el request
    const errors = validationResult(req);
    //Si la constante errors no esta vacia, es decir tiene errores, va a retornar un error
    if( !errors.isEmpty() ){
        //retorno del error, con los mensajes almacenados en errors
        return res.status(400).json(errors);
    }

    //Si no existe ningun error, ejecuto la función next() para que siga con el siguiente middleware o en caso
    //de no haber mas middlewares que siga con el controlador
    next();

}

//Funcion que utilizo para validar campos y no estar copiando lo mismo en cada controlador
module.exports = {
    validarCampos
}