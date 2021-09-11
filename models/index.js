
// Llamado de mis modelos, los llamo siempre la primera con mayuscula y como se llaman en el archivo
const Producto = require('./producto')
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');


// Exportacion de mis modelos
module.exports = {
    Producto,
    Role,
    Server,
    Usuario
}