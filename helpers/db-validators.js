
//importación del modelo rol que cree para hacer la validación del rol ingresado por el usuario
const { Categoria, Producto } = require('../models');
const Role = require('../models/role');

//Importación del modelo Usuario que se creo para hacer la validación del email ingresado por el usuario
const Usuario = require('../models/usuario');


const esRoleValido = async(rol='')=>{
    //pregunto si el rol ingresado existe en la base de datos (colección que se creo previamente) e
    //importo el modelo para el rol que cree Role
    const existeRol = await Role.findOne({rol});
    //si no existe el rol dentro de la base de datos arrojo un mensaje de error 
    if(!existeRol){
            throw new Error (`El rol ${rol} no está en la BD`)
    }
}


const emailExiste = async( correo='' ) => {

    //Verificar si el correo existe, esto es un boolean que busca si existe en la base de datos un correo repetido
    //por otro usuario que ya se registro {correo:correo} = {correo} significa lo mismo
    const existeEmail = await Usuario.findOne({ correo });
    //Se pone el if para que en caso de que ya exista el correo en la base de datos se retorne un error y se pare
    //la ejecución de la función arrojando el error  
    if (existeEmail) {
      throw new Error (`El correo ${correo} ya existe`)
    }

}

//validación personalizada de si el id que manda el usuario existe o no dentro de la base de datos
const idExiste = async( id ) => {

    //Verificar si el id existe para el modelo Usuarios, esto es un boolean que busca si existe en la base de datos el id ingresado
    const existeId = await Usuario.findById(id);
    //Se pone el if para que en caso de que no exista el id en la base de datos se retorne un error y se pare
    //la ejecución de la función arrojando el error  
    if (!existeId) {
      throw new Error (`El id ${id} no existe para ningun usuario`)
    }

}

//Para ver si existe la categoria en la DB
const existeCategoria = async( id ) => {

  //Verificar si el id existe para el modelo Categorias, esto es un boolean que busca si existe en la base de datos el id ingresado
  const existeId = await Categoria.findById(id);
  //Se pone el if para que en caso de que no exista el id en la base de datos se retorne un error y se pare
  //la ejecución de la función arrojando el error  
  if (!existeId) {
    throw new Error (`El id ${id} no existe para ninguna categoria`)
  }

}

//Para ver si existe el producto en la DB
const existeProducto = async( id ) => {

  //Verificar si el id existe para el modelo Producto, esto es un boolean que busca si existe en la base de datos el id ingresado
  const existeId = await Producto.findById(id);
  //Se pone el if para que en caso de que no exista el id en la base de datos se retorne un error y se pare
  //la ejecución de la función arrojando el error  
  if (!existeId) {
    throw new Error (`El id ${id} no existe para ningun producto`)
  }

}

const validarCategoria = async (categoria) => {

    //Nombre de la categoria arreglado, pasarlo a mayusculas
    const nombre_mayusculas = categoria.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre: nombre_mayusculas});

    //Si no existe arrojar un error que no existe
    if ( !categoriaDB ) {
        throw new Error (`La categoria no existe. Cree primero la categoria para luego si poder agregar el producto`)
    }

    //Si intenta ingresar una categoria que ya fue eliminada
    if(!categoriaDB.estado){
        throw new Error (`La categoria ${categoriaDB.nombre} ya fue eliminada, hable con el administrador para restaurarla`)
    }
    
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = ( coleccion = '', coleccionesPermitidas = [] ) => {

  //Verificar si la coleccion existe dentro de las colecciones permitidas
  const incluida = coleccionesPermitidas.includes(coleccion);

  //Mensaje de error si no existe la coleccion dentro de las colecciones permitidas 
  if(!incluida){
    throw new Error (`La colección ${coleccion} no es permitida, colecciones permitidas ${coleccionesPermitidas}`)
  }

  //Como lo llamo en un custom tengo que devolver true para poder continuar
  return true;

}


module.exports = {
    esRoleValido,
    emailExiste,
    idExiste,
    existeCategoria,
    existeProducto,
    validarCategoria,
    coleccionesPermitidas
}