
//Sacar la función Router del paquete de express 
const { Router } = require('express');

//Importación del metodo check para hacer las validaciones del correo
const { check } = require('express-validator');

//Importaciòn de controladores
const { login, googleSignin } = require('../controller/auth_controller');

//ejecución de los errores que quiero disparar segun la validación de datos 
const { validarCampos } = require('../middlewares/validar-campos');

//función router que me permite hacer las interacciones put, post,delete, etc.
const router = Router();

//creacion de usuario
router.post('/login', [
    //Validación de que sea un correo valido
    check('correo', 'El correo no es válido').isEmail(),

    //Validación de que se escriba una contraseña obligatoriamente
    check('password', 'Tiene que escribir una contraseña').not().isEmpty(),

    //Ejecución de errores
    validarCampos
],login)

//creacion de ruta para manejar el token de google
router.post('/google', [

    //Validación de que se escriba un token de google
    check('id_token', 'El id_token es necesario').not().isEmpty(),

    //Ejecución de errores
    validarCampos

    //controlador del token de google
], googleSignin)


module.exports = router;