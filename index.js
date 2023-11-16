// Módulos utilizados
const progressBar = require("progress");
const https = require("https");
const fs = require("fs");

// Petición de descargar a este host y esta ruta
const req = https.get({
    host: "jquerymobile.com",
    port: 443,
    path: "/resources/download/jquery.mobile-1.4.5.zip",
});

// Creación de la barra según se va descargando el archivo
req.on("response", function (res) {
    const len = parseInt(res.headers["content-length"], 10);

    // Barra de progreso de la descarga
    const bar = new progressBar(
        "Downloading file >>> [:bar] :rate/bps :percent :etas",
        {
            complete: "=",
            incomplete: " ",
            width: 20,
            total: len,
        }
    );

    // Creo un array vacío para ir añadiendo los chunks
    let data = [];

    res.on("data", function (chunk) {
        bar.tick(chunk.length); // Formación visual de la línea
        data.push(chunk); // Añade chunks al array
    });
    
    res.on("end", function () {
        // Como los chunks que se reciben en un stream suelen ser de tipo Buffer, utilizo el método 'concat' para juntar el array
        const buffer = Buffer.concat(data);

        // Escribe el archivo y si ya hay uno, lo sobreescribe
        fs.writeFile("jquery.mobile-1.4.5.zip", buffer, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Download completed successfully!");
            }
        });
    });

});

// Fin de la petición
req.end();
