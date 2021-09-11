
//Sacar la función Router del paquete de express 
const { Router } = require('express');

//Importación del metodo check para hacer las validaciones del correo
const { check } = require('express-validator');

//Importacion de los controladores
const { crearProducto,
        obtenerProductos,
        obtenerUnProducto,
        actualizarProducto,
        borrarProducto 
       } = require('../controller/productos_controller');

//Funcion para saber si existe un producto ingresado por un ID
const { existeProducto } = require('../helpers/db-validators');

// Importación de middlewares para validar JWT y validar campos en caso de exitir un error
const { validarJWT,
        validarCampos
       } = require('../middlewares');


//función router que me permite hacer las interacciones put, post,delete, etc.
const router = Router();

//Obtener todas los productos - Publico
router.get('/', obtenerProductos)

//Obtener un producto por un id - Publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerUnProducto)

//Crear producto - privado - cualquier persona con un token valido
router.post('/',[
    // validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos,
], crearProducto)

//Actualizar un producto - privado - con un token valido
router.put('/:id', [
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
], actualizarProducto) 

//Borrar un producto - ADMIN
router.delete('/:id', [
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto) 

module.exports = router;
