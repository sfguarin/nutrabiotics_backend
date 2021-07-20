const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

//Crear arreglo con las colecciones permitidas
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    //Roles no deberia ser permitido pero es para manejar el error 
    'roles'
]

//Se crea funciones independientes para cada case que el usuario pueda elegir, se manda como argumento el
//termino que ingresa el usuario que lo inicializo vacio, y el argumento res para de una vez arrojar la
//respuesta desde aca. OJO no agregar req porque tambien se lo tendria que mandar cuando llame mi funcion
const buscarUsuarios = async (termino='', res = response ) => {

    //Para ver si el id ingresado pertenece a un id de mongo estas dos opciones son validas, se deja la segunda
    //ya que es la usada en el ejercicio
    // const esMongoID = isValidObjectId(termino)
    const esMongoID = ObjectId.isValid( termino );

    //Condicional para que arroje un resultado si es un mongoId
    if( esMongoID ){

        //Busqueda del usuario por el id ingresado por el usuario
        const usuario = await Usuario.findById(termino);

        //Respuesta 
        return res.json({
            //Ternario: basicamente dice (usuario) <- (si esto es verdad) ? (da como resultado esto ) [usuario] : <-(de lo contario esto) []
            results : (usuario) ? [usuario] : []
        })
    }

    //Si el usuario no agrego un mongoId y realizo la busqueda por el nombre o correo se ejecuta lo siguiente

    //Definir la expresion regular, la expresion regular significa que al buscar este termino en postman o en el 
    //navegador asi lo escriba en mayusculas o minusculas el lo va a reconocer.
    //RegExp es el metodo para convertirlo a expresion regular (variable que quiero pasar a expresion regular,
    //'i' la i es para que sea insensible a las mayusculas o minusculas, que se pueda leer por cualquiera)
    const regex = new RegExp (termino, 'i');

    //Buscar todos los usuarios que coincidan con el termino pasado a expesion regular. El find tambien se puede 
    //mandar como un objeto
    const usuarios = await Usuario.find({

        //$or: sirve para buscar por cualquiera de las dos condiciones ya sea que el nombre o  correo 
        //coincida con la regex. Desde que el nombre o correo tenga algo de la expresion regular (termino ingresado
        //por el usuario) no va agragar como resultado de busqueda
        $or: [{ nombre: regex }, {correo: regex }],
        //Aparte se pone el $and: para que solo muestre los usuarios que esten activos osea que cumpla cualquiera
        //de los terminos puestos en el $or y su estado debe ser true 
        $and: [{ estado: true }]
    })

    //Mostrar el resultado de los usuarios encontrados
    res.json({
        results: usuarios
    })


}

const buscarCategoria = async ( termino = '', res = response ) => {

    //Mirar si el termino ingresado por el usuario es un mongoId
    const esMongoID = ObjectId.isValid( termino );

    //Condicional para que arroje un resultado si es un mongoId
    if( esMongoID ){

        //Busqueda de la categoria por el id ingresado por el usuario y muestra del nombre del usuario con populate()
        const categoria = await Categoria.findById(termino)
                                         .populate('usuario', 'nombre')

        //Respuesta 
        return res.json({
            //Si la categoria no es nula muestra la categoria de lo contrario []
            results : (categoria) ? [categoria] : []
        })
    }

    //Definición de expresión regular segun el termino ingresado por el usuario, para que sea encontrada por 
    //cualquier coincidencia insensible
    const regex = new RegExp(termino, 'i' );

    //Busqueda de categorias que coincida su nombre con la regex y su estado sea true
    const categorias = await Categoria.find({
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    })
    //populate() para mostrar el nombre del usuario de todas las categorias encontradas
    .populate('usuario', 'nombre')

    //Mostrar el resultado de las categorias encontradas 
    res.json({
        results: categorias
    })


}

const buscarProducto = async ( termino = '', res = response ) => {

    //Mirar si el termino ingresado por el usuario es un mongoId
    const esMongoID = ObjectId.isValid( termino );

    //Condicional para que arroje un resultado si es un mongoId
    if( esMongoID ){

        //Busqueda del producto por el id ingresado por el usuario, mostrar el nombre del usuario y categoria 
        //encontrada por el is
        const producto = await Producto.findById(termino)
                                       .populate('usuario', 'nombre')
                                       .populate('categoria', 'nombre')

        //Respuesta 
        return res.json({
            //Si el producto es nulo muestra la categoria, de lo contrario []
            results : (producto) ? [producto] : []
        })
    }

    //Definición de expresión regular segun el termino ingresado por el usuario, para que sea encontrada por 
    //cualquier coincidencia insensible
    const regex = new RegExp(termino, 'i' );

    //Busqueda de productos que coincida su nombre con la regex y su estado sea true
    const productos = await Producto.find({
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    })
    //populate() para mostrar el nombre del usuario y categoria de todas los productos encontrados
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

    //Mostrar el resultado de los productos encontrados 
    res.json({
        results: productos
    })


}

//Controlador para la url api/buscar
const buscar = ( req = request, res = response ) => {

    //Extraccion de la coleccion y termino ingresado por el usuario
    const {coleccion, termino} = req.params;

    //Condicional para ver si la coleccion ingresada por el usuario se encuentra dentro de las colecciones permitidas
    //Si no se incluye se arroja un error
    if(!coleccionesPermitidas.includes( coleccion )){

        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    //Opciones que puede ingresar el usuario en la coleccion y dependiento del case se ejecutan acciones 
    //diferentes
    switch (coleccion) {

        //En caso que la coleccion ingresada por el usuario sea 'usuarios'
        case 'usuarios':

            //Ejecuto mi metodo de buscada para usuarios previamente creado que recibe el termino y la response
            buscarUsuarios(termino, res);

        break;

        //Caso si la coleccion es categorias
        case 'categorias':

            //Ejecución del metodo para buscar categorias si el usuario manda en coleccion 'categorias'
            // y el termino de busqueda
            buscarCategoria(termino, res);

        break;

        //Caso si la coleccion es productos
        case 'productos':

            //Ejecución del metodo para buscar productos si el usuario manda la coleccion 'productos'
            // y el termino de busqueda
            buscarProducto(termino, res);

        break;


        //Por si sucede algun error 
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })


    }

}

module.exports = {
    buscar
}

