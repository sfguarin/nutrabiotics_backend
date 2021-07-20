
//Importación de libreria de google
const { OAuth2Client } = require('google-auth-library');

//Recordar cambiar el client que viene por default cambiarlo por mi GOOGLE_CLIENT_ID que tengo en mis variables
//de entorno
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Transformar la función normal a una función de flecha y que reciba como argumento el id_token generado por google
const googleVerify = async (id_token) => {

  const ticket = await client.verifyIdToken({
      //Uso del argumento id_token
      idToken: id_token,
      //Aca tambien recordar cambiar el client por mi GOOGLE_CLIENT_ID
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  //Aca en este payload viene toda la información del usuario 
  const payload = ticket.getPayload();

  //Aca extraido lo unico que me interesa del payload para llenar los datos de los usuarios que se registran con una
  //cuenta de google. Como en mi modelo todo los objetos estan definidos en español, extraigo las variables y les
  //cambio el nombre por las variables de mi modelo en este caso en español
  const {name: nombre, 
         picture: img, 
         email: correo} = payload;

  //Para ver toda la información del usuario retornada 
  //return payload
  
  //Retorno la información que me interesa en español
  return { nombre, img, correo }

}

module.exports = {
    googleVerify
}
