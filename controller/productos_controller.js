const { response, request } = require("express");
const { body } = require("express-validator");
const { Producto, Categoria } = require("../models");

//Obtener productos - paginado - total - populate(metodo propio de mongoose-ultimo usuario que modifico el registro)
const obtenerProductos = async ( req = request, res = response) => {

    //Establecer desde y hasta que producto quiero que se muestre
    //Establesco estos valores por default si el usuario no agrega query.params url?limite=10&desde=1
    const {limite = 5, desde = 0} = req.query;

    //Solo mostrar productos que se encuentren activos
    const activos = {estado: true}

    //Definicion del total de productos y productos a mostrar
    const [total, productos] = await Promise.all([

        //Contar total de categorias activas
        Producto.countDocuments(activos),

        //Buscar todos los usuarios activos
        Producto.find(activos)

            //Para mostrar el nombre del usuario que creo el producto y el id 
            .populate('usuario', 'nombre')

            //Para mostrar el nombre de la categoria del producto
            .populate('categoria', 'nombre')

            //Desde que numero se va mostrar teniendo en cuenta
            //los query.params url/categorias?limite=10&desde=0
            .skip(Number(desde))

            //limite de categorias a mostrar
            .limit(Number(limite))


    ]);

    //Respuesta de total de productos y mostrar productos pedidos por el usuario
    res.json({
        total,
        productos
    })
}

//Controlador para crear un producto
const crearProducto = async (req=request, res=response) => {

    //Extracción de lo que me interesa del body
    const {estado, usuario, categoria, ...resto} = req.body

    //Tomo el nombre que viene en el body y lo pongo en mayusculas, porque las categorias las quiero en mayusculas
    const nombreArreglado = resto.nombre.toUpperCase();

    //Buscar si ya existe el producto
    const productoDB = await Producto.findOne({ nombre: nombreArreglado });

    //Si existe arrojar un error que ya existe
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe. `
        })
    }

    //Data que le voy a mandar a la creacion de mi producto
    const data = {
        ...resto,
        nombre: nombreArreglado,
        usuario: req.usuario._id,
        categoria: req.categoria._id
    }

    //Creacion de mi nuevo producto
    const producto = new Producto(data);

    //Guardar mi nuevo producto en la DB
    await producto.save();

    //Respuesta de creación de producto
    res.status(201).json({
        msg: 'Nuevo prodcuto creado',
        producto
    })

}

//Obtener un producto - pupulate -{Solo regresa el objeto de la categoria}
const obtenerUnProducto = async (req = request, res = response) => {

    //Capturar id de los params /782hfhjb727879
    const {id} = req.params;

    //Buscar categoria por el id que capturo y utilizar populate('modelo', lo que quiero extraer de ese modelo)
    const producto = await Producto.findById( id )
                                   .populate('usuario','nombre')
                                   .populate('categoria', 'nombre')

    //Respuesta de categoria encontrada
    res.status(200).json({
        msg: 'Producto encontrado',
        producto
    })

}

//Actualizar producto - de recibe nombre y categoria para poder cambiar el produto
const actualizarProducto = async ( req = request, res = response )=>{
    
    //Captura id de los params
    const {id} = req.params;

    //Extracción de lo que no puede actualizar el usuario
    const {_id, estado, usuario, ...resto} = req.body;

    //Verificar si el producto ingresado ya existe
    if(resto.nombre){

        //Nombre del producto arreglado 
        resto.nombre = resto.nombre.toUpperCase();
    
        //Comprobación que no se repita un producto al actualizar
        const productoDB = await Producto.findOne({nombre: resto.nombre});

        //Si existe arrojar un error que ya existe una categoria con ese nombre
        if ( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe. `
            })
        }

    }

    //Validación si la categoria existe o ya fue eliminada
    if(resto.categoria){

    //Nombre de la categoria arreglado, pasarlo a mayusculas
    resto.categoria = resto.categoria.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre: resto.categoria});

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

    resto.categoria = categoriaDB._id;

    }

    //Data que le voy a mandar a la creacion de mi producto
    const data = {
        ...resto,
        usuario: req.usuario._id
    }

    //Actualización de data, el {new:true} para que mande el documento actualizado y se vea en la respuesta la 
    //categoria actualizada
    const actualizacion = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        msg: 'Actualización realizada con exito',
        actualizacion
    })

}

//Borrar producto - cambiar estado a false
const borrarProducto = async ( req = request, res = response ) => { 
    
    //Captura id de los params
    const {id} = req.params;

    const verificar = await Producto.findById(id);

    if(verificar.estado==false){
        return res.json({
            msg: 'Este usuario ya fue eliminado'
        })
    }

    //Borrar producto y ver los cambios realizados en el resultado 
    const borrar = await Producto.findByIdAndUpdate ( id, {estado: false}, {new:true} );

    //respuesta
    res.status(202).json({
        msg: 'El producto que se elimino fue el siguiente',
        borrar
    })
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerUnProducto,
    actualizarProducto,
    borrarProducto
}
