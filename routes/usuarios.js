
//Sacar la función Router del paquete de express 
const { Router } = require('express');

//Importación del metodo check para hacer las validaciones del correo
const { check } = require('express-validator');

//Importación de funciones del controlador 
const { usuariosGet, 
        usuariosPut, 
        usuariosPost,  
        usuariosDelete, 
        usuariosPatch } = require('../controller/usuarios_controller');

//helper que me ayuda a validar el rol personalizado que hice en comparación a la colección que cree en la 
//base de datos
const { esRoleValido, emailExiste, idExiste } = require('../helpers/db-validators');

//ejecución de los errores que quiero disparar segun la validación de datos, middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');


//establecer mi constante con la función que extraje y va ser como mi this.app. Asi pues pongo todas
// las peticiones que voy a utilizar con router Ejemplo router.get, router.post, etc. Al Router() de express
//automaticamente se le modifica las rutas y las exporto
const router = Router();

        //GET: Solicita una representación de un recurso en especifico. Se utiliza para recuperar datos
        //En este caso solo se pone '/' ya que la subdirección o path lo mando desde la clase server.js
        //Se utiliza el llamado de la funcion del controlador (controller/usuarios_controller.js). En este caso
        //usuariosGet que es la que contiene la función de mi petición get para los usuarios
        router.get('/', usuariosGet)



        //PUT: Reemplaza todas las representaciones actuales del recurso de destino con la carga util de la
        //petición, actualiza data
        //el :id sirve para hacer validas las dirrecciones URL que me mande el usuario despues de /api/usuarios/10 o 
        //cualquier numero. Tambien capturo ese 10 o lo que me mande el usuario y lo guardo como "id" que fue el nombre
        //que le di para este caso
        router.put('/:id', [

                //Verifica si el id ingresado corresponde a un formato de id de mongo
                check('id', 'No es un ID válido').isMongoId(),
                //Verifica si el id ingresado corresponde a un id de algun usuario registrado, existe en la BD
                check('id').custom(idExiste),
                //Si se desea modificar el rol debe ser una modificación valida, aunque obliga al usuario a 
                //necesariamente a actualizar el rol
                check('rol').custom(esRoleValido),
                //Ejecución de errores acumulados en los check
                validarCampos

        ],
        usuariosPut)


        
        //POST: Sirve para crear nuevos recursos. 
        //Recordar que cuando pongo la función router.post(dirección, controlador) funciona asi cuando solo pongo dos
        //argumentos pero si pongo 3, es decir, router.post(dirección, middleware(donde se hace la validación), controlador)
        //si hay muchos errores en los middleares puesto no se dispara el controlador
        router.post('/',
        //Se manda como un arreglo de middlewares cuando incluyo mas de un middleware
        [       
                //El nombre no puede ser un argumento vacio
                check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                //El password debe tener minimo 6 caracteres
                check('password', 'El password debe ser más de 6 letras').isLength( {min:6} ),
                //check (argumento, mensaje de error) Revisa si viene un correo valido en el body, de lo contrario 
                //almacena un error o prepara un error la función .isEmail es para verificar si es un correo valido
                check('correo', 'El correo no es válido').isEmail(),
                //despues de verificar que sea un correo valido mira si existe o no ya en la base de datos
                check('correo').custom(emailExiste),

                //El rol debe ser alguno de los existente en el arreglo 
                //Se deja este ejemplo por si se necesita escoger entre un arreglo, pero es mejor vincular la información
                //con una base de datos
                //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),

                //Esta es la validación del rol que hago personalizada para el rol con respecto a la colección de mongoDB
                //se supone que esRoleValido recibe un argumento (rol)=>esRoleValido(rol) pero como solo hay un argumento
                //visualstudiocode asume por default que es el argumento que recibe cuando no especifico
                check('rol').custom(esRoleValido),

                //función que ejecuta los errores almacenados en los check, si no existe errores se sigue con el 
                //controlador usuariosPost
                validarCampos
        ] ,usuariosPost)   

        //DELETE: Borrar un recurso en especifico 
        //el :id sirve para hacer validas las dirrecciones URL que me mande el usuario despues de /api/usuarios/10 o 
        //cualquier numero. Capturo el id como parametro. En este caso el usuario lo tiene que poner para el 
        //usuario que desea eliminar 
        router.delete('/:id', [

                //Metodo para recibir y validar mi JWT del header antes de eliminar un usuario
                validarJWT,
                //Verificar que el usuario que desea realizar la acción de eliminar tenga uno de los roles
                //permitidos para realizar la acción
                tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
                 //Verifica si el id ingresado corresponde a un formato de id de mongo
                 check('id', 'No es un ID válido').isMongoId(),
                 //Verifica si el id ingresado corresponde a un id de algun usuario registrado, existe en la BD
                 check('id').custom(idExiste),
                 validarCampos
                 
        ],usuariosDelete)

        //PATCH: Para aplicar modificaciones parciales para un recurso 
        router.patch('/', usuariosPatch)    


//Exportar router con las modificaciones previamente hechas 
module.exports = router;