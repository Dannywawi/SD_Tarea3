
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
//cassandra conection

const cassandra = require('cassandra-driver')
const client = new cassandra.Client({
  contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
  localDataCenter: 'datacenter1',
  credentials: { username: 'cassandra', password: 'cassandra' }
})
// cassandra create tables
const c = async() => await client.connect()

client.connect(function (err,result) {
  if (!err) {
    console.log("new keyspace pacientes created");
    var query = "CREATE KEYSPACE IF NOT EXISTS paciente WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 2};" 
    client.execute(query, [],function(err) {
    if (!err) {
        ////////////////////       crear la tabla PACIENTES
        const client1 = new cassandra.Client({
          contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
          keyspace: 'paciente',
          localDataCenter: 'datacenter1',
          credentials: { username: 'cassandra', password: 'cassandra' }
        })
        client1.connect(function (err,result) {
          console.log("DENTRO DEL CONNECT DE CREATE TABLE pacientes");
          if (!err) {
            var query = "CREATE TABLE IF NOT EXISTS pacientes(id int PRIMARY KEY, nombre text, apellido text, rut text, email text, fecha_nacimiento text );"
            client1.execute(query, [],function(err) {
            if (!err) {
                console.log("new table pacientes created");
            }
            else{
                console.log("error in keyspace creation");
                console.log((err));
            }
            });
          }
          else{
            console.log(err);
          }
        })
    }
    else{
        console.log("error in keyspace creation");
    }
    });
  }
  else{
    console.log(err);
  }
})


client.connect(function (err,result) {
  if (!err) {
    var query = "CREATE KEYSPACE IF NOT EXISTS receta WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3};" 
    client.execute(query, [],function(err) {
    if (!err) {
        ////////////////// /     CREAR LA TABLA RECETAS
        console.log("new keyspace receta created");
        const client2 = new cassandra.Client({
          contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
          keyspace: 'receta',
          localDataCenter: 'datacenter1',
          credentials: { username: 'cassandra', password: 'cassandra' }
        })
        client2.connect(function (err,result) {
          console.log("DENTRO DEL CONNECT DE CREATE TABLE recetas");
          if (!err) {
            var query = "CREATE TABLE IF NOT EXISTS recetas(id int PRIMARY KEY, id_paciente int, comentario text, farmacos text, doctor text) ;"
            client2.execute(query, [],function(err) {
            if (!err) {
                console.log("new table recetas created");
            }
            else{
                console.log("error in keyspace creation");
                console.log((err));
            }
            });
          }
          else{
            console.log(err);
          }
        })
    }
    else{
        console.log("error in keyspace creation");
    }
    });

  }
  else{
    console.log(err);
  }
})

app.get("/", async (req,res) => {
  console.log("En el get");
  res.send("hola")
})
var count = 1;
app.post("/create", async (req,res) => {
  // comprobar si el paciente existe
  const client1 = new cassandra.Client({
    contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
    keyspace: 'paciente',
    localDataCenter: 'datacenter1',
    credentials: { username: 'cassandra', password: 'cassandra' }
  })
  
  const query = 'Select * from pacientes where rut = ? allow filtering';
  try {
    await client1.execute(query, [req.body.rut]).then(result => {
      // si el row resultante es > 0 ejecutar el insert de la receta
      if (result.rowLength > 0) {
        console.log("paciente encontrado");
        const client2 = new cassandra.Client({
          contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
          keyspace: 'receta',
          localDataCenter: 'datacenter1',
          credentials: { username: 'cassandra', password: 'cassandra' }
        })
        client2.connect(function (err,result1) {
          if (!err) {
            var query = "INSERT INTO recetas(id,comentario,doctor,farmacos,id_paciente) values("+count+",?,?,?,"+result.rows[0].id+") ;"
            count = count + 1;
            client2.execute(query, [req.body.comentario, req.body.doctor, req.body.farmacos],function(err) {
            if (!err) {
                console.log("Receta creada");
            }
            else{
                console.log("error creacion de la receta");
                console.log((err));
            }
            });
          }
          else{
            console.log(err);
          }
        })
      }
      if (result.rowLength == 0) {
        // si el row resultante es 0, crear el paciente y luego la receta
        console.log("paciente no encontrado");
        client1.connect(function (err,result2) {
          if (!err) {
            var query = "INSERT INTO pacientes(apellido,email,fecha_nacimiento,nombre,rut,id) VALUES(?,?,?,?,?,"+count+");"
            client1.execute(query, [req.body.apellido, req.body.email,req.body.fecha_nacimiento,req.body.nombre,req.body.rut],function(err) {
            if (!err) {
              console.log("Paciente creado");
              const client2 = new cassandra.Client({
                contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
                keyspace: 'receta',
                localDataCenter: 'datacenter1',
                credentials: { username: 'cassandra', password: 'cassandra' }
              })
              client2.connect(function (err,result3) {
                if (!err) {
                  var query = "INSERT INTO recetas(id,comentario,doctor,farmacos,id_paciente) values("+count+",?,?,?,"+count+") ;"
                  client2.execute(query, [req.body.comentario,req.body.doctor,req.body.farmacos],function(err) {
                  if (!err) {
                    count = count + 1;
                    console.log("receta creada");
                  }
                  else{
                      console.log("error en la creacion de la receta");
                      console.log((err));
                  }
                  });
                }
                else{
                  console.log(err);
                }
              })
            }
            else{
              console.log("error in keyspace creation");
              console.log((err));
            }
            });
          }
          else{
            console.log(err);
          }
        })
      }
      res.send("<h1>Pagina para crear recetas</h1>")
    });
  } catch (error) {
    console.log("print error");
    console.log(error);
  }
})

app.post("/edit", async(req,res) => {
  console.log("Edit Page");
  const client2 = new cassandra.Client({
    contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
    keyspace: 'receta',
    localDataCenter: 'datacenter1',
    credentials: { username: 'cassandra', password: 'cassandra' }
  })
  const query = 'UPDATE recetas SET comentario=?, farmacos=?, doctor=? where id=? IF EXISTS;';
  try {
    await client2.execute(query, [req.body.comentario,req.body.farmacos,req.body.doctor, req.body.id],{prepare: true}).then(result => {
      if (result.rows.wasApplied == true) {
        console.log("Receta actualizada");
      }
      else{
        console.log("Error al actualizar receta");
      }
    })
  } catch (error) {
    console.log("error de actu");
    console.log(error)
  }
  res.send("<h1>Pagina para editar la receta</h1>")
})

app.post("/delete", (req,res) => {
  console.log("Delete Page");
  //Deletear la receta segun id
  const client2 = new cassandra.Client({
    contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
    keyspace: 'receta',
    localDataCenter: 'datacenter1',
    credentials: { username: 'cassandra', password: 'cassandra' }
  })
  client2.connect(function (err,result1) {
    if (!err) {
      var query = "DELETE FROM recetas WHERE id ="+req.body.id+";"
      client2.execute(query, [],function(err,result) {
      if (!err) {
          console.log("Receta Eliminada");
      }
      else{
          console.log("error eliminacion de la receta");
          console.log((err));
      }
      });
    }
    else{
      console.log(err);
    }
  })

  res.send("<h1>Pagina para eliminar la receta</h1>")
})

app.listen(3000, ()=>{
  console.log("server in port 3000");
})
