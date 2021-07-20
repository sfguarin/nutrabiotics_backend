
//Sacar la función Router del paquete de express 
const { Router } = require('express');

//Importación del metodo check para hacer las validaciones del correo
const { check } = require('express-validator');

//Importación de los controladores
const { crearCategoria,
        obtenerCategorias,
        obtenerUnaCategoria,
        actualizarCategoria,
        borrarCategoria 
       } = require('../controller/categorias_controller');


const { existeCategoria } = require('../helpers/db-validators');


// Importación de middlewares para validar JWT y validar campos en
//caso de exitir un error
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');



//función router que me permite hacer las interacciones put, post,delete, etc.
const router = Router();

//Obtener todas las categorias - Publico
router.get('/', obtenerCategorias)

//Obtener una categoria por un id - Publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerUnaCategoria)

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    validarCampos
], crearCategoria)

//Actualizar un registro - privado - con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio para poder actualizar la información').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

//Borrar una categoria - ADMIN
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    tieneRol('ADMIN_ROLE'),
    validarCampos
], borrarCategoria) 

module.exports = router;
