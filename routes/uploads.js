
//Sacar la función Router del paquete de express 
const { Router } = require('express');

//Importación del metodo check para hacer las validaciones del correo
const { check } = require('express-validator');
const { cargarArchivo, actualizarArchivo, mostrarImagen, actualizarArchivoCloudinary } = require('../controller/uploads_controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

//ejecución de los errores que quiero disparar segun la validación de datos 
const { validarCampos } = require('../middlewares/validar-campos');

//función router que me permite hacer las interacciones put, post,delete, etc.
const router = Router();

//Endpoint para subir un archivo
router.post('/', [
    validarArchivoSubir
],cargarArchivo);

//Endpoint para actualizar un archivo, pido coleccion e id al usuario en la URL
router.put('/:coleccion/:id', [
    validarArchivoSubir,
    //validación mongoId
    check('id', 'El id debe ser de  mongo').isMongoId(),
    //Metodo para validar que la coleccion exista que yo cree llamado 'colecciones permitidas'. (c es la coleccion 
    //que ingresa el usuario, [arreglo de colecciones permitidas])
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos

],actualizarArchivoCloudinary)

router.get('/:coleccion/:id', [

        //validación mongoId
        check('id', 'El id debe ser de  mongo').isMongoId(),
        //Colecciones permitidas
        check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos

], mostrarImagen)

module.exports = router;