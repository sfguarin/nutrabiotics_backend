
const { request, response } = require("express");

//Modelo de categoria para buscar en la DB
const { Categoria } = require("../models");

//Verificar si la categoria ingresada existe
const validarCategoria = async (req = request, res = response, next) => {

    //Extraer nombre de la categoria
    const {categoria} = req.body;

    //Nombre de la categoria arreglado, pasarlo a mayusculas
    const nombre_mayusculas = categoria.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre: nombre_mayusculas});

    //Si no existe arrojar un error que no existe
    if ( !categoriaDB ) {
        return res.status(401).json({
            msg: `La categoria no existe. Cree primero la categoria para luego si poder agregar el producto`
        })
    }

    //Si intenta ingresar una categoria que ya fue eliminada
    if(!categoriaDB.estado){
        return res.status(401).json({
            msg: `La categoria ${categoriaDB.nombre} ya fue eliminada, hable con el administrador para restaurarla`
        })
    }

    req.categoria = categoriaDB;

    next();

}

module.exports = {
    validarCategoria
}