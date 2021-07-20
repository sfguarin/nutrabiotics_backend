

const { Router } = require('express');

const { buscar } = require('../controller/buscar_controller');

const router = Router();


router.get('/:coleccion/:termino', buscar )


//Esto siempre se tiene que exportar como una clase, no como una funcion porque sino no sirve
module.exports = router