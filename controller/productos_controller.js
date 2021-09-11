const { response, request } = require("express");
const { body } = require("express-validator");
const { Producto, Categoria } = require("../models");

//Obtener productos - paginado - populate(metodo propio de mongoose-ultimo usuario que modifico el registro)
const obtenerProductos = async ( req = request, res = response) => {

    //Establecer desde y hasta que producto quiero que se muestre
    //Establesco estos valores por default si el usuario no agrega query.params url?limite=10&desde=1
    const {limite = 10, desde = 0} = req.query;

    //Solo mostrar productos que se encuentren activos
    const activos = {estado: true}

    //Definicion del total de productos y productos a mostrar
    const [productos] = await Promise.all([

        //Buscar todos los usuarios activos
        Producto.find(activos) 

            // //Para mostrar el nombre del usuario que creo el producto y el id 
            // .populate('usuario', 'nombre')

            // //Para mostrar el nombre de la categoria del producto
            // .populate('categoria', 'nombre')

            //Desde que numero se va mostrar teniendo en cuenta
            //los query.params url/categorias?limite=10&desde=0
            .skip(Number(desde))

            //limite de categorias a mostrar
            .limit(Number(limite))


    ]);

    //Respuesta mostrar productos pedidos por el usuario
    res.json(productos)
}

//Controlador para crear un producto
const crearProducto = async (req=request, res=response) => {

    //Extracción de lo que me interesa del body
    const {estado, usuario, ...resto} = req.body

    //Tomo el nombre que viene en el body y lo pongo en mayusculas, porque las categorias las quiero en mayusculas
    const nombreArreglado = resto.nombre.toUpperCase();

    const categoriaArreglada = resto.categoria.toUpperCase();

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
        categoria: categoriaArreglada
    }

    //Creacion de mi nuevo producto
    const producto = new Producto(data);

    //Guardar mi nuevo producto en la DB
    await producto.save();

    //Respuesta de creación de producto
    res.status(201).json(producto)

}

//Obtener un producto - pupulate -{Solo regresa el objeto de la categoria}
const obtenerUnProducto = async (req = request, res = response) => {

    //Capturar id de los params /782hfhjb727879
    const {id} = req.params;

    //Buscar categoria por el id que capturo y utilizar populate('modelo', lo que quiero extraer de ese modelo)
    const producto = await Producto.findById( id )
                                //    .populate('usuario','nombre')
                                //    .populate('categoria', 'nombre')
    //Respuesta de categoria encontrada
    res.status(200).json(producto)

}

//Actualizar producto - de recibe nombre y categoria para poder cambiar el produto
const actualizarProducto = async ( req = request, res = response )=>{
    
    //Captura id de los params
    const {id} = req.params;

    //Extracción de lo que no puede actualizar el usuario
    const {_id, estado, ...resto} = req.body;

    //Verificar si el producto ingresado ya existe
    // if(resto.nombre){

    //     //Nombre del producto arreglado 
    //     resto.nombre = resto.nombre.toUpperCase();
    
    //     //Comprobación que no se repita un producto al actualizar
    //     const productoDB = await Producto.findOne({nombre: resto.nombre});

    //     //Si existe arrojar un error que ya existe una categoria con ese nombre
    //     if ( productoDB ) {
    //         return res.status(400).json({
    //             msg: `El producto ${productoDB.nombre} ya existe. `
    //         })
    //     }

    // }

    //Data que le voy a mandar a la creacion de mi producto
    const data = {
        ...resto
    }

    //Actualización de data, el {new:true} para que mande el documento actualizado y se vea en la respuesta la 
    //categoria actualizada
    const actualizacion = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json(actualizacion)

}

//Borrar producto - cambiar estado a false
const borrarProducto = async ( req = request, res = response ) => { 
    
    //Captura id de los params
    const {id} = req.params;

    // const verificar = await Producto.findById(id);

    // if(verificar.estado==false){
    //     return res.json({
    //         msg: 'Este usuario ya fue eliminado'
    //     })
    // }

    //Borrar producto y ver los cambios realizados en el resultado 
    const borrar = await Producto.findByIdAndDelete ( id );

    //respuesta
    res.status(202).json(borrar)
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerUnProducto,
    actualizarProducto,
    borrarProducto
}
