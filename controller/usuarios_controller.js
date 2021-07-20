
//esto se hace para que pueda tener acceso a las funciones de response por ejemplo que se autocomplete el 
//res.json
const {response, request} = require('express');

//Paquete para encriptar contraseñas 
const bcryptjs = require('bcryptjs');

//Aca estoy importando el modelo de usuario que cree en modelos>usuario.js todo el esquema con sus caracteristicas
const Usuario = require('../models/usuario');

//Almacenador de errores de las validaciones hechas en routes>usuarios.js
const { validationResult } = require('express-validator');



//constante que controla las rutas de usuarios.js en este caso es el Get de usuarios 
const usuariosGet = async (req = request, res = response) => {
    //.send se utiliza para regresar sitio web
    // res.send('Hello World')

    //extracción de query params ?q=hola&nombre=stiven&apellido=guarin (solo extraje los que necesito mediante
    //desestructuración). Agregue el "No name" para que si el usuario no agrega ese query params ese sea su valor
    //por defecto. {{url}}/api/usuarios?q=hola. Recordar que todos los query params por default son ingresados
    //como tipo String asi yo lo ponga como numero {{url}}/api/usuarios?q=5 en este caso q="5" un string, asi que 
    //si necesito transformarlos pongo Number etc 
    //const {q, nombre = "No name"} = req.query;

    //query params que quiero extraer y sus valores por defecto
    const {limite = 5, desde = 0} = req.query;

    //Es para que solo se muestren los usuarios que estan activos, ¿por que? algunas veces
    //eliminamos unos usuarios pero simplemente le cambiamos el estado a false porque 
    //queremos conservar su data y si no especificamos esto cuando buscamos me va a mostrar todos
    //los usuarios asi esnten en false o true y para este caso solo queremos los activos
    const activos = { estado: true };

    //TODO: se deja para fines educativos ya que la suma de dos await no es la mas optima en tiempo, se demora mas en ejecutar
    //Esto me permite mostra TODOS los usuarios, muy importante el await 
    //const usuarios = await Usuario.find()
        
        //Desde donde quiero que se empiecen a mostrar los usarios del 0-5 o del 6-10, etc
        //.skip(Number(desde))
        //limite de usuarios que quiero que se muestren en la consulta, se muestran los 2 primeros 
        //o los 3 primeros, etc. Recordar transformar el query params en un number
        //.limit(Number(limite))

    //Total de usuarios regisrados
    //const total = await Usuario.countDocuments();

    //Esperar para que se tenga todos los await al tiempo y ejecutar un unico gran await para hacerlo mas 
    //optimo, esto se hace cuando se tiene muchos await. Asi mismo se desestructura y se le pone el nombre 
    //de las variables en el orden que se ponen en el arreglo para despues ejecutarlas mas ordenadamente
    const [total, usuarios] = await Promise.all([
        //contar total de usuarios activos
        Usuario.countDocuments(activos),
        //buscar los usuarios activos teniendo en cuenta el desde y el limite de usuarios a mostrar
        Usuario.find(activos)
            //Desde que usuario se va a mostrar
            .skip(Number(desde))
            //Cuantos usuarios se van a mostrar
            .limit(Number(limite))
    ]);

    //.json regresa información (formato mas utilizado y estandar) generalmente se manda como un objeto
    res.json({

        //Para mandar el status, aunque esto es redundante ya que postman lo manda automaticamente
        //ok: true,
        //msg: 'Get API - controlador',

        //mostrar la extracción de query params en la respuesta
        //q,
        //nombre
        
        //resultados del gran await
        total,
        usuarios

    })
  }




//Sirve para crear nuevos recursos, usuarios o cualquier tipo de data. Es la información que me manda el usuario
//en el body, raw en formato json
const usuariosPost =  async (req = request, res = response) => {


    //para extraer la información del body, puedo extraerla toda o desestructurarla const {nombre} = req.body
    //si son muchas propiedades tambien puedo poner {google, ...resto} y se pone el resto en la creación del usuario
    //new Usuario(resto). Pero en este caso se desestructuro uno a uno
    const {nombre, correo, password, rol} = req.body;

    //Aca utilizo el esquema que cree en models>usuario.js para la creación del usuario, que recibe como 
    //argumento el body que ingreso el usuario. Los parametros que no existan en el esquema y los haya metido
    //el usuario se ignoran automaticamente.
    // Mando solo los argumentos que necesito y que permito que el usuario pueda modificar, digamos el de google
    //no quiero que tenga control de modificarlo, por eso no lo mando 
    const usuario = new Usuario({nombre, correo, password, rol});


    //Encriptar la contraseña 
    //La función bcryptjs.genSaltSync() permite determinar el numero de vueltas para encriptar una contraseña
    //por default es 10 pero si se quiere algo mas complejo y dificil de decifrar se puede poner hasta 100
    const salt = bcryptjs.genSaltSync(10);
    //bcryptjs.hashSync (contraseña que quiero encriptar, salt o numero de vueltas para encriptar) es la función
    //como tal que se encarga de encriptar la contraseña en una sola via
    usuario.password = bcryptjs.hashSync(password, salt);

    //función para guardar los cambios en mongoDB o base de datos
    //IMPORTANTE: recordar que al utilizar esta función deben estar todos los argumentos obligatorios
    //que se plantearon en el modelo, de hacer falta alguno en el body, simplemente ocurre un error mostrado
    //en la terminal que faltan unos argumentos obligatorios, en postman se queda como pensando y no se guarda
    //el usuario en mongo. Por esta razón se debe cumplir con todo lo propuesto en el modelo, tambien ocurre error
    //cuando hay problemas de duplicidad, es decir, que se repite el correo.

    await usuario.save();

    //el id del usuario se genera automaticamente en mongoDB


    res.json({

    msg: 'post API - controlador',


    //mando la información extraida del body segun el modelo de usuario que cree
    usuario

    })
}

const usuariosPut =  async (req = request, res) => {

    //para extraer el id que es mandado por el usuario en los parametros de segmento, este id es el que genera
    //mongo db al momento de crear el usuario en post y es unico para cada usuario y necesario saberlo 
    //si quiero actualizar la data, si no existe el id ingresado sucede un error
    const {id} = req.params;

    //extraigo las propiedades que quiere actualizar el usuario y yo necesito tener manejo de ellas por aparte
    //digamos el google asi me lo envie el usuario este el no lo puede modificar. El correo tambien se saca porque
    //si es el mismo no dejaria actualizar la data. Esto como tal es lo que entra en el body
    //el unico id que me sirve es el que se manda en los params no en el body por eso lo extraigo tambien en caso de
    //venir
    const {_id, password, google, correo, estado, ...resto} = req.body;


    //actualización de contraseña
    if(password){

        const salt = bcryptjs.genSaltSync(10);

        //Aca es resto porque al resto es al que le voy a establecer el nuevo password
        resto.password = bcryptjs.hashSync(password, salt);
    }

    //Esto lo que hace es buscar el usuario por el id que yo le mando y que debe existir, si encuentra al usuario
    //actualiza la data de ese usuario segun las propiedades que haya en resto
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({

    msg: 'put API - controlador',
    //imprime como quedo el usuario actualizado
    usuario

    })
}

const usuariosPatch =  (req, res) => {

    res.json({

    msg: 'patch API - controlador'

    })
}

const usuariosDelete = async(req = request, res = response) => {

    //Captura el id que viene de los params 
    const { id } = req.params;

    //Este metodo me borra TODO lo que tenga que ver con este usuario, lo cual no es muy recomendado
    //porque si el dia de mañana necesito alguna información que este usuario haya hecho en el pasado o
    //una consulta ya no podre saberlo. Se deja para fines educativos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Este metodo solo me cambia el estado de mi usuario a false, lo cual es muy recomendado ya que igual se sigue 
    //conservando en la base de datos toda la información relacionada a este usuario y si a futuro se necesita
    //hacer una consulta aun se puede consultar
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} );


    //Recibir usuario autenticado - fines educativos
    //const usuarioAutenticado = req.usuario;

    res.json({

    msg: 'El usuario que se elimino fue el siguiente',
    usuario

    });
}

//Exportar las constantes creadas de las peticiones HTTP para utilizarlas en usuarios.js
  module.exports = {
      usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosPatch,
      usuariosDelete
  }