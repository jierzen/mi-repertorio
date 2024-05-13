//importamos los paquetes de express
const express = require('express')
const app = express()

//importamos File System para leer el archivo repertorio.json
const fs = require('fs')

//CORS
const cors = require('cors')

//puerto y mensaje de consola
app.listen(3000, console.log("¡Servidor encendido!"))

//Usamos cors
app.use(cors())

//middleware
app.use(express.json())


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
  })


//endpoint tipo GET en direccion /home que devuelve una respuesta String
app.get("/home", (req, res) => {
res.send("Bienvenido a Desafio 2 - Mi Repertorio")
})

//Devuelve un JSON con las canciones registradas en el repertorio
app.get("/canciones", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
    res.json(canciones)
    })

//Recibe los datos correspondientes a una canción y la agrega al repertorio.
app.post("/canciones", (req, res) => {
	// 1 Almaceno cancion proveniente de payload
	const cancion = req.body
	// 2 Obtengo las canciones existentes
	const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
	// 3 Agrego la cancion nueva al JSON
	canciones.push(cancion)
	// 4 Escribo el archivo JSON con la cancion nueva
	fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
	// 5 Envio mensaje de exito al cliente
	res.send("Cancion agregada con éxito!")
})

//Recibe por queryString el id de una canción y la elimina del repertorio.
app.delete("/canciones/:id", (req, res) => {
	// Capturo el id del payload
	const { id } = req.params
	// Obtengo la lista de canciones del archivo json
	const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
	// Filtro el indice de la cancion basado en el id del payload
	const index = canciones.findIndex(p => p.id == id)
	// Elimino la cancion
	canciones.splice(index, 1)
	// Sobreescribo el json
	fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
	  // Envio mensaje al cliente
	res.send("Cancion eliminada con éxito")
})

//Recibe los datos de una canción que se desea editar y la actualiza manipulando el JSON local.
app.put("/canciones/:id", (req, res) => {
	// Se recibe el id desde el payload
	const { id } = req.params
	// Se obtiene el body del payload
	const cancion = req.body
	// Se listan las canciones del json
	const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
	// Se filtra la cancion del json basado en el id
	const index = canciones.findIndex(p => p.id == id)
	// Se reemplaza la cancion por la nueva cancion del payload
	canciones[index] = cancion
	// Se sobreescribe el archivo json
	fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
	// Mensaje al usuario
	res.send("Cancion modificada con éxito")
  })
