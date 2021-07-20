const { request, response } = require("express");


//Verificar si la categoria ingresada existe
const validarArchivoSubir = (req = request, res = response, next) => {

        //Condicional para verificar que venga un archivo en la carga, de lo contrario arroja un error
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
            return res.status(400).json({
                msg: 'No hay archivo que subir, verifique que si cargo un archivo'
            });
        }

        next();
}

module.exports = {
    validarArchivoSubir
}