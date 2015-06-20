var express = require('express');
var router = express.Router();
var VertexModel = require('../models/vertex');

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./api.properties');

// Definición del log
var fs = require('fs');
var log = require('tracer').console({
    transport : function(data) {
        //console.log(data.output);
        fs.open(properties.get('main.log.file'), 'a', 0666, function(e, id) {
            fs.write(id, data.output+"\n", null, 'utf8', function() {
                fs.close(id, function() {
                });
            });
        });
    }
});

router.get('/', function(req, res)
{
  res.render('index', { title: ' Kyros API REST'});
});

// Obtener todos los vertices
router.get('/vertexes/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
        log.info ("Procesando GET de vertexes");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }


    VertexModel.getVertexes(function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          if (typeof data !== 'undefined')
          {
              res.render("showVertexes",{
                  title : " Kyros API REST",
                  vertexes : data
              });
          }
          else
          {
            res.status(404);
            res.json({
              "message":"notExist"
            });

          }
        }
    });
});

/* Obtenemos un vertice por su id y lo mostramos en un formulario para editar */
router.get('/vertex/:id', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
        log.info ("Procesando GET de vertex");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    var id = req.params.id;
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        VertexModel.getVertex(id,function(error, data)
        {
            if (data == null) {
              res.render("errorAPI",{
                  title : " Kyros API REST",
                  message : "mmmm ... something went wrong :(" + " .... " +  error
              });
            }
            else {
              //si existe el vertice mostramos el formulario
              if (typeof data !== 'undefined' && data.length > 0)
              {
                  res.render("updateVertex",{
                      title : " Kyros API REST",
                      info : data
                  });
              }
              //en otro caso mostramos un error
              else
              {
                  res.render("errorAPI",{
                      title : " Kyros API REST",
                      message : "mmmm ... something went wrong :("
                  });
              }
            }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
      res.render("errorAPI",{
          title : " Kyros API REST",
          message : "mmmm ... something went wrong :("
      });
    }
});

/* Actualizamos un vertice existente */
router.put('/vertex/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
        log.info ("Procesando PUT de vertex");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    //almacenamos los datos del formulario en un objeto
    var vertexData = {id:req.param('id'),description:req.param('description'),areaId:req.param('areaId'),numVertex:req.param('numVertex'),latitude:req.param('latitude'),longitude:req.param('longitude')};
    VertexModel.updateVertex(vertexData,function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          //si el vertice se ha actualizado correctamente mostramos un mensaje
          if(data && data.message)
          {
              //res.redirect("/webkyrosapi/vertex/" + req.param('id'));
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Vertex updated!"
              });
          }
          else
          {
              res.render("errorAPI",{
                  title : " Kyros API REST",
                  message : "mmmm ... something went wrong :("
              });
          }
        }
    });
});

/* Nuevo vertice */
router.get('/newvertex/', function(req, res)
{
    res.render("newVertex",{
        title : " Kyros API REST",
      });
});

/* Crear un nuevo vertice */
router.post("/vertex", function(req,res)
{
    sess=req.session;
    if(sess.username)
    {
        log.info ("Procesando POST de vertex");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    // Crear un objeto con los datos a insertar del vertice
    var vertexData = {
        id : null,
        areaId : req.body.areaId,
        description : req.body.description,
        numVertex : req.body.numVertex,
        latitude : req.body.latitude,
        longitude : req.body.longitude
    };

    VertexModel.insertVertex(vertexData,function(error, data) {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        } else {
          // si el vertice se ha insertado correctamente mostramos su info
          if(data && data.insertId) {
              //res.redirect("/webkyrosapi/vertex/" + data.insertId);
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Vertex created!"
              });
          }
          else {
              res.render("errorAPI",{
                  title : " Kyros API REST",
                  message : "mmmm ... something went wrong :("
              });
          }
        }
    });
});

/* Eliminar un vertice */
router.delete("/vertex/", function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
        log.info ("Procesando DELETE de vertex");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    // id del vertice a eliminar
    var id = req.param('id');

    VertexModel.deleteVertex(id,function(error, data) {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        } else {
            if(data && data.message === "deleted" || data.message === "notExist") {
              //res.redirect("/webkyrosapi/vertex/");
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Vertex deleted!"
              });
            } else {
                res.render("errorAPI",{
                    title : " Kyros API REST",
                    message : "mmmm ... something went wrong :("
                });
              }
        }
    });
})

module.exports = router;
