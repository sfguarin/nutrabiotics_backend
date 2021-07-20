
//Paquete para manejar el directorio donde quiero subir mis archivos de carga
const path = require('path');

//Paquete para darl eun nombre unico a cada archivo subido
const { v4: uuidv4 } = require('uuid');

//Metodo para subir cualquier archivo que recibe como argumentos (archivo a cargar, extensiones validas, 
//subcarpeta dentro de uploads para subir archivo), se establecen valores por default si el usuario no ingresa nada.
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    
    //Cuando hago un helper que necesita request y response, que necesita saber cuando algo sale bien o mal utilizo 
    //el retorno de una new Promise
    return new Promise ((resolve, reject) => {

        //Sacar el archivo de files
        const {archivo} = files;

        //Crear un arreglo donde se dividieron los elementos por el '.' Esto se hace con el fin de obtener la extensión,
        //recordar que la extension de los archivos vienen calculo.txt imagen.jpg y asi, es decir que el ultimo elemento
        //de este arreglo siempre va ser la extensión
        const nombreCortado = archivo.name.split('.');

        //Extraigo la extension del arreglo creado previamente
        const extension = nombreCortado[nombreCortado.length-1];

        //Validar extensiones
        if(!extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, solo se permite archivos ${extensionesValidas}`);
        }

        //Creación de nombre unico con extensión
        const nombreTemp = uuidv4() + '.' + extension;

        
        //Construcción del path donde quiero colocar el archivo
        //path.join(ubicacion de donde estoy(en este caso helpers), ubicación donde quiero mandar el archivo, 
        //subcarpeta de uploads, nombre con que quiero guardar el archivo)
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        //Mover el archivo subido al path que cree anteriormente y en caso de error arrojar el error 
        archivo.mv(uploadPath, (err) => {
            
            //Mensaje de error en caso de existir
            if (err) {
                reject(err);
            }

            //Mensaje si todo sale bien
            //Se supone que si todo sale bien el archivo debe aparecer en uploads despues de subir
            resolve(nombreTemp);

         });
    });
}

module.exports = {
    subirArchivo
}