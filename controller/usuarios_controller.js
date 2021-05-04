
//esto se hace para que pueda tener acceso a las funciones de response por ejemplo que se autocomplete el 
//res.json
const {response, request} = require('express');

//constante que controla las rutas de usuarios.js en este caso es el Get de usuarios 
const usuariosGet = (req = request, res = response) => {
    //.send se utiliza para regresar sitio web
    // res.send('Hello World')

    //extracción de query params ?q=hola&nombre=stiven&apellido=guarin (solo extraje los que necesito mediante
    //desestructuración). Agregue el "No name" para que si el usuario no agrega ese query params ese sea su valor
    //por defecto
    const {q, nombre = "No name"} = req.query;

    //.json regresa información (formato mas utilizado y estandar) generalmente se manda como un objeto
    res.json({

        //Para mandar el status, aunque esto es redundante ya que postman lo manda automaticamente
        //ok: true,
        msg: 'Get API - controlador',

        //mostrar la extracción de query params en la respuesta
        q,
        nombre

    })
  }


const usuariosPost =  (req, res) => {

    //para extraer la información del body
    const { nombre } = req.body;

    res.json({

    msg: 'post API - controlador',
    //mando la información extraida del body
    nombre

    })
}

const usuariosPut =  (req = request, res) => {

    //para extraer el id que es mandado por el usuario en los parametros de segmento
    const {id} = req.params

    res.json({

    msg: 'put API - controlador',
    //utilizo el id que extraje
    id

    })
}

const usuariosPatch =  (req, res) => {

    res.json({

    msg: 'patch API - controlador'

    })
}

const usuariosDelete = (req, res) => {

    res.json({

    msg: 'delete API - controlador'

    })
}

//Exportar las constantes creadas de las peticiones HTTP para utilizarlas en usuarios.js
  module.exports = {
      usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosPatch,
      usuariosDelete
  }