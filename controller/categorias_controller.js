const { request, response } = require("express");
const { Categoria } = require("../models");


//Obtener categorias - paginado - total - populate(metodo propio de mongoose-ultimo usuario que modifico el registro)
const obtenerCategorias = async ( req = request, res = response) => {

    //Establecer desde y hasta que categoria quiero que se muestre
    //Establesco estos valores por default si el usuario no agrega query.params url?limite=10&desde=1
    const {limite = 5, desde = 0} = req.query;

    //Solo mostrar categorias que se encuentren activas
    const activos = {estado: true}

    //Definicion del total de categorias y categorias a mostrar
    const [total, categorias] = await Promise.all([

        //Contar total de categorias activas
        Categoria.countDocuments(activos),

        //Buscar todos los usuarios activos
        Categoria.find(activos)

            //Para mostrar el nombre del usuario que creo la categoria y el id 
            .populate('usuario', 'nombre')

            //Desde que numero se va mostrar teniendo en cuenta
            //los query.params url/categorias?limite=10&desde=0
            .skip(Number(desde))

            //limite de categorias a mostrar
            .limit(Number(limite))


    ]);

    //Respuesta de total de categorias y mostrar categorias pedidas por el usuario
    res.json({
        total,
        categorias
    })
}


//Obtener una categoria - pupulate -{Solo regresa el objeto de la categoria}
const obtenerUnaCategoria = async (req = request, res = response) => {

    //Capturar id de los params /782hfhjb727879
    const {id} = req.params;

    //Buscar categoria por el id que capturo y utilizar populate('modelo', lo que quiero extraer de ese modelo)
    const categoria = await Categoria.findById( id )
                                     .populate('usuario','nombre')

    //Respuesta de categoria encontrada
    res.status(200).json({
        msg: 'Categoria encontrada',
        categoria
    })

}

//Controlador del metodo post de Categorias que permite crear una categoria 
const crearCategoria = async (req = request, res = response) => {

    //Tomo el nombre que viene en el body y lo pongo en mayusculas, porque las categorias las quiero en mayusculas
    const nombre = req.body.nombre.toUpperCase()

    //Buscar si existe una categoria 
    const categoriaDB = await Categoria.findOne({ nombre });
 
    //Si existe arrojar un error que ya existe
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe. `
        })
    }

    //Generar la data para crear la nueva categoria
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //Crear mi nueva categoria
    const categoria = new Categoria(data);

    //Guardar mi nueva categoria
    await categoria.save();

    //Respuesta de creacion de categoria
    res.status(201).json({
        msg: 'Nueva categoria creada', 
        categoria
    })
}

//Actualizar categoria - solo se recibe el nombre para poderlo cambiar
const actualizarCategoria = async ( req = request, res = response )=>{
    
    //Captura id de los params
    const {id} = req.params;

    //Captura del body, la información que desea actualiza el usuario
    const nombre = req.body.nombre.toUpperCase();

    //Comprobación que no se repita una categoria al actualizar
    const categoriaDB = await Categoria.findOne({nombre});

    //Si existe arrojar un error que ya existe una categoria con ese nombre
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe. `
        })
    }

    //Data para actualizar la información
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //Actualización de data, el {new:true} para que mande el documento actualizado y se vea en la respuesta la 
    //categoria actualizada
    const actualizacion = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        msg: 'Actualización realizada con exito',
        actualizacion
    })

}


//Borrar categoria - cambiar estado a false
const borrarCategoria = async ( req = request, res = response ) => { 
    
    //Captura id de los params
    const {id} = req.params;

    //Borrar categoria y ver los cambios realizados en el resultado 
    const borrar = await Categoria.findByIdAndUpdate ( id, {estado: false}, {new:true} );

    //respuesta
    res.status(202).json({
        msg: 'La categoria que se elimino es la siguiente',
        borrar
    })
}


//Exportación de mis controladores
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerUnaCategoria, 
    actualizarCategoria,
    borrarCategoria
}