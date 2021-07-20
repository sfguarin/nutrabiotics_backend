const { request, response } = require("express")


//Funcion para validar que el usuario que se autentique tenga el rol de administrador para realizar ciertas
//acciones como la de eliminar un usuario
const esAdminRole = ( req = request, res = response, next ) => {

    //Se tiene que poner despues de que el token ya se haya validado y se haya modificado la request,
    //porque llamo al usuario de la request y si no existe surge un error
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    //Extraer las propiedades del usuario que me interesan para hacer la validación
    const {rol, nombre} = req.usuario;

    //Validación de si el usuario que desea ejecutar la acción tiene el rol de administrador de lo contrario se 
    //arroja un error
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `El usuario ${nombre} no es administrador - No puede hacer esto`
        })
    }

    //si no existe ningun error se corre next
    next();
}

//Funcion para validar que el usuario que se autentique tenga un rol que conincida con una lista de roles que se 
//mandan como argumento (pueden ser 1,2,3 o mas roles los que se mandan como argumento). Esta función es más
//versatil porque permite dar acceso a mas roles si es necesario, no se restringe a un solo rol
const tieneRol = ( ...roles ) => {

    //primero mando los argumentos que recibo en la función y despues el return si con mi req, res y next
    return (req=request, res = response, next ) => {
        
        //Se tiene que poner despues de que el token ya se haya validado y se haya modificado la request,
        //porque si llamo al usuario de la request y si no existe surge un error
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        //Verificar si el usuario que se autentica tiene alguno de los roles mandados por argumento, de
        //lo contrario se arroja un error
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `Para poder realizar la acción el usuario debe tener alguno de los siguientes roles ${roles}`
            })
        }

        next();
    }
}

//exportación de mi función
module.exports = {
    esAdminRole,
    tieneRol
}