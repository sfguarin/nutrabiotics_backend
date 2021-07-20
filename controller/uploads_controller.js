
//Importaciones para borrar las rutas cuando actualizo
const path = require('path');
const fs = require('fs')

//Importación y conexión con cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");



//Controlador para cargar archivos del endpoint post
const cargarArchivo = async ( req = request, res = response) => {

    //Como estamos manejando un resolve y reject en el metodo subirArchivo se hace un try para si todo sale bien
    //y un catch para si algun reject se dispara capture ese error y lo muestre.
    try {

        //Ejemplo de otros tipo de extension
        // const nombre = await subirArchivo(req.files, ['md', 'txt'], 'textos');
        
        //Extración del path de ubicación donde se cargo el archivo. Se utiliza undefined para dejar los valores
        //por default que estableci en el metodo.
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        //Devuelvo el nombre del archivo que se subio, el path lo podria obtener pero al usuario no le interesa esto
        res.json({
            nombre
        })

    } catch (msg) {
        res.status(400).json({msg})
    }

}

//Actualizar archivo de un usuario. Controlador del endpoint put de uploads 
const actualizarArchivo = async ( req = request, res = response) => {

    //Extracción de params ingresados por el usuario en la URL
    const {coleccion, id} = req.params;

    //Variable que va tomar los valores de si existe un modelo en una coleccion de mongoDB
    let modelo;

    //Casos de actualización de productos o usuarios segun la colección que ingrese el usuario
    switch (coleccion) {

        //caso de usuarios
        case 'usuarios':
            //Busca al usuario si existe por el id, de lo contario arroja un error
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            } 
        break;

        //caso de productos
        case 'productos':
            //Busca un producto si existe por el id, de lo contario arroja un error
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            } 
        break;

        //Disparo de un error en caso de olvidar una validación
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //crear el path de la imagen que voy a borrar del servidor
        const pathImageDelete = path.join(__dirname, '../uploads', coleccion, modelo.img);

        //Si dicho path existe borro el path de la imagen
        if (fs.existsSync(pathImageDelete)){
            //Borro path 
            fs.unlinkSync(pathImageDelete);
        }
    }

    //Actualizar la imagen del usuario y subirla a la colleción establecida
    const nombre = await subirArchivo(req.files, undefined, coleccion);

    //Poner el nombre de la imagen en el objeto encontrado ya sea usuario o producto
    modelo.img = nombre;

    //Guardar el modelo en la base de datos de mongoDB 
    await modelo.save();

    //respuesta
    res.json({
        modelo
    })


}

//Controlador para mostrar la imagen cuando lo soliciten
const mostrarImagen = async ( req = request, res = response) => {

    //Extracción de params ingresados por el usuario en la URL
    const {coleccion, id} = req.params;

    //Variable que va tomar los valores de si existe un modelo en una coleccion de mongoDB
    let modelo;

    //Casos para buscar un producto o un usuario (si existen) dependiendo de la coleccion ingresada por 
    //el usuario
    switch (coleccion) {

        //caso de usuarios
        case 'usuarios':
            //Busca al usuario si existe por el id, de lo contario arroja un error
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            } 
        break;

        //caso de productos
        case 'productos':
            //Busca un producto si existe por el id, de lo contario arroja un error
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            } 
        break;

        //Disparo de un error en caso de olvidar una validación
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Condicional si existe la propiedad img
    if (modelo.img) {
        //crear el path de la imagen que voy a buscar
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        //Mirar si existe el path que cree
        if (fs.existsSync(pathImage)){
            //mostar imagen con el path ingresado
            return res.sendFile(pathImage);
        }
    }

    //Por si no se encontro la imagen, tengo una imagen por default en assets de notFound, busco la ruta 
    //y la implemento
    const pathImageNotFound = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathImageNotFound)
}

//Actualizar archivo de un usuario. Controlador del endpoint put de uploads 
const actualizarArchivoCloudinary = async ( req = request, res = response) => {

    //Extracción de params ingresados por el usuario en la URL
    const {coleccion, id} = req.params;

    //Variable que va tomar los valores de si existe un modelo en una coleccion de mongoDB
    let modelo;

    //Casos de actualización de productos o usuarios segun la colección que ingrese el usuario
    switch (coleccion) {

        //caso de usuarios
        case 'usuarios':
            //Busca al usuario si existe por el id, de lo contario arroja un error
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            } 
        break;

        //caso de productos
        case 'productos':
            //Busca un producto si existe por el id, de lo contario arroja un error
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            } 
        break;

        //Disparo de un error en caso de olvidar una validación
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //Limpiar archivos previos 
    if (modelo.img) {

        //Creación de arreglo donde separo elementos por el / sdjakjn/snlksndf/identificación.extension
        const nombreArr = modelo.img.split('/');
        //Recordar que el ultimo elemento es el id unico de la imagen con la extension 
        const nombre    = nombreArr[nombreArr.length-1];
        //recordar que obtengo identificación.extension y si lo extraido asi por default extraigo el primer
        //elemento del arreglo que en este caso es la identidiciación de la img sin la extension
        const [public_id] = nombre.split('.');
        //Borrar archivo de cloudinary con el identificador que cree previamente
        cloudinary.uploader.destroy(public_id)

    }

    //Extraer el path temporal para subir a cloudinary
    const { tempFilePath } = req.files.archivo

    //subir archivo a cloudinary y extraigo el secure_url que es el id unico de mi archivo que me dirige a el
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    //Poner el nombre de la imagen en el objeto encontrado ya sea usuario o producto
    modelo.img = secure_url;

    //Guardar el modelo en la base de datos de mongoDB 
    await modelo.save(); 

    //respuesta
    res.json({
        modelo
    })


}

module.exports = {
    cargarArchivo, 
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}