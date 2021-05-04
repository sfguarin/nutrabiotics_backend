
//Sacar la función Router del paquete de express 
const { Router } = require('express');
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controller/usuarios_controller');

//establecer mi constante con la función que extraje y va ser como mi this.app. Asi pues pongo todas
// las peticiones que voy a utilizar con router Ejemplo router.get, router.post, etc. Al Router() de express
//automaticamente se lemodifica las rutas y las exporto
const router = Router();

        //GET: Solicita una representación de un recurso en especifico. Se utiliza para recuperar datos
        //En este caso solo se pone '/' ya que la subdirección o path lo mando desde la clase server.js
        //Se utiliza el llamado de la funcion del controlador (controller/usuarios_controller.js). En este caso
        //usuariosGet que es la que contiene la función de mi petición get para los usuarios
        router.get('/',  usuariosGet)

        //PUT: Reemplaza todas las representaciones actuales del recurso de destino con la carga util de la
        //petición, actualiza data
        //el :id sirve para hacer validas las dirrecciones URL que me mande el usuario despues de /api/usuarios/10 o 
        //cualquier numero. Tambien capturo ese 10 o lo que me mande el usuario y lo guardo como "id" que fue el nombre
        //que le di para este caso
        router.put('/:id', usuariosPut)

        //POST: Sirve para crear nuevos recursos 
        router.post('/', usuariosPost)  

        //DELETE: Borrar un recurso en especifico 
        router.delete('/', usuariosDelete)

        //PATCH: Para aplicar modificaciones parciales para un recurso 
        router.patch('/', usuariosPatch)    


//Exportar router con las modificaciones previamente hechas 
module.exports = router;