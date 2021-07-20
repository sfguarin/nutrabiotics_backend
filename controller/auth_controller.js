//esto se hace para que pueda tener acceso a las funciones de response por ejemplo que se autocomplete el 
//res.json
const {response, request} = require('express');

//Importación de paquete para manejar contraseñas
const bcryptjs = require('bcryptjs');

//Importación del modelo usuario para hacer la busqueda de todos los usuarios registrados en la base de datos
//con sus respectivas propiedades
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { usuariosGet } = require('./usuarios_controller');

//metodo del controlador que voy a utilizar para la autenticación, para una petición post
const login =  async (req = request, res = response) => {

    //Capturo las variables que necesito del body
    const {correo, password} = req.body;

    //try y catch por si algo sale mal 
    try {

        //Verificar si el usuario existe con el email suministrado, para buscar siempre se utilizan corchetes
        const usuario = await Usuario.findOne({correo});

        // Si el usuario no existe haga lo siguiente
        if (!usuario){

            return res.status(400).json({
                msg: 'El email ingresado no corresponde a ningún usuario'
            })
        }

        //Verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'El usuario ingresado no se encuentra activo'
            })
        }

        //Verificar la contraseña. Aca importo mi paquete bcryptjs y utilizo el metodo compareSync que permite
        //comparar la contraseña que ingresa el usuario al momento de logearse (password) y la contraseña con la 
        //que se registro el usuario (usuario.password)
        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if( !validPassword ){
            return res.status(400).json({
                msg: 'La contraseña ingresada no corresponde al usuario'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        //Respuesta cuando todo se ejecuta correctamente
        res.json({
            msg: 'Auth funcionando',
            usuario,
            token
        })
        
    } catch (error) {
        //Error por si sucede un error imprevisto, se supone que este catch no se debe disparar pero se pone 
        //por si acaso
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

//Controlador de la ruta que administra el token de google, async para que pueda verificar el token recibido
const googleSignin = async (req = request, res = response) => {

    //try por si el id_token de GOOGLE ingresado no es válido
    try {
        
        //Captura del id_token mandado en el body 
        const {id_token} = req.body;
    
        //Verificación del token de GOOGLE con la función que cree e importe, si la verificación es correcta
        //retorna los datos del usuario que necesito
        const {nombre, img, correo} = await googleVerify(id_token);

        //Verificar si el usuario ingresado con ese correo existe o no existe
        let usuario = await Usuario.findOne({correo});

        //Si no existe el usuario creo un nuevo usuario con los datos de GOOGLE
        if ( !usuario ) {

            const data = {
                nombre, 
                img, 
                correo, 
                google: true, 
                // No importa que se almacene, pero es necesario mandar algo porque es un campo obligatorio
                //No importa que mande y asi alguien se sepa la contraseña que yo pongo por default nunca va 
                //poder logearse con ella porque por el hash que requiere la base de datos al logearse, esta
                //nunca va poder hacer match ya que en mongo se guarda pero no en formato hash 
                password: ':P'
            };

            //Crear el usuario con la nueva data
            usuario = new Usuario ( data );

            //Guardar el usuario en la DB de mongo 
            await usuario.save();
        }

        //Si el usuario digamos ya se habia registrado hace unos años y borro la cuenta, no puede ingresar con
        //ese mismo correo ya que se encuentra en la base de datos pero su estado es false
        if ( !usuario.estado ) {

            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            }); 
        }

        //Generar el JWT 
        const token = await generarJWT(usuario.id);
 

        res.json({

            msg: 'Todo ok! Google Sign-In',

            //Impresion en la consola del navegador el usuario con sus datos
            usuario,
            //Para mostrarlo en postman y en la consola del navegador para verificar si si se esta recibiendo
            //Se deja como ejemplo educativo porque en realidad no es necesario mostrarlo
            // id_token

            // token generado en la creacion del usuario
            token


        });
        
    } catch (error) {
        
        //Error si el token de google no es valido 
        res.status(400).json({
            msg: 'Token de GOOGLE no es válido'
        })
    }


}

//Exportación de los controladores
module.exports = {
    login,
    googleSignin
}