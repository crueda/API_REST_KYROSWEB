var express = require('express');
var router = express.Router();
var TrackingModel = require('../models/tracking');

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

/*router.get('/', function(req, res)
{
  res.render('index', { title: 'SUMO Kyros API REST'});
});*/

// Obtener todos los tracking_1
router.get('/trackings1/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando GET de trackings1");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    TrackingModel.getTrackings1(function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          if (typeof data !== 'undefined')
          {
              res.render("showTrackings",{
                  title : "Kyros API REST",
                  trackings : data
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

// Obtener todos los tracking_5
router.get('/trackings5/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando GET de trackings5");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    TrackingModel.getTrackings5(function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          if (typeof data !== 'undefined')
          {
              res.render("showTrackings",{
                  title : "Kyros API REST",
                  trackings : data
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


// Obtener todos los tracking
router.get('/trackings/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando GET de trackings");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    TrackingModel.getTrackings(function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          if (typeof data !== 'undefined')
          {
              res.render("showTrackings",{
                  title : "Kyros API REST",
                  trackings : data
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

/* Obtenemos un tracking por su id y lo mostramos en un formulario para editar */
router.get('/tracking/:id', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando GET de tracking. id="+req.params.id);
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
        TrackingModel.getTracking(id,function(error, data)
        {
            if (data == null) {
              res.render("errorAPI",{
                  title : "Kyros API REST",
                  message : "mmmm ... something went wrong :(" + " .... " +  error
              });
            }
            else {
              //si existe el beacon mostramos el formulario
              if (typeof data !== 'undefined' && data.length > 0)
              {
                  res.render("updateTracking",{
                      title : "Kyros API REST",
                      info : data
                  });
              }
              //en otro caso mostramos un error
              else
              {
                  res.render("errorAPI",{
                      title : "Kyros API REST",
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
          title : "SUMO Kyros API REST",
          message : "mmmm ... something went wrong :("
      });
    }
});

/* Actualizamos un tracking existente */
router.put('/tracking/', function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando PUT de tracking. id="+req.params.id);
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    //almacenamos los datos del formulario en un objeto
    var trackingData = {id:req.param('id'),deviceId:req.param('deviceId'),alertFlag:req.param('alertFlag'),alertDescription:req.param('alertDescription'),altitude:req.param('altitude'),speed:req.param('speed'),heading:req.param('heading'),posDate:req.param('posDate'),latitude:req.param('latitude'),longitude:req.param('longitude')};
    TrackingModel.updateTracking(trackingData,function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          //si el tracking se ha actualizado correctamente mostramos un mensaje
          if(data && data.message)
          {
              res.render("success",{
                  title : "Kyros API REST",
                  message : "Tracking updated!"
              });
          }
          else
          {
              res.render("errorAPI",{
                  title : "Kyros API REST",
                  message : "mmmm ... something went wrong :("
              });
          }
        }
    });
});

/* Nuevo tracking */
router.get('/newtracking/', function(req, res)
{
    res.render("newTracking",{
        title : "Kyros API REST",
      });
});

/* Crear un nuevo tracking */
router.post("/tracking", function(req,res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando POST de tracking");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    // Crear un objeto con los datos a insertar del tracking
    var trackingData = {
        id : null,
        vehicleLicense : req.body.vehicleLicense,
        deviceId : req.body.deviceId,
        alertFlag : req.body.alertFlag,
        alertDescription : req.body.alertDescription,
        altitude : req.body.altitude,
        speed : req.body.speed,
        heading : req.body.heading,
        posDate : req.body.posDate,
        latitude : req.body.latitude,
        longitude : req.body.longitude
    };

    TrackingModel.insertTracking(trackingData,function(error, data) {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        } else {
          // si el beacon se ha insertado correctamente mostramos su info
          if(data && data.insertId) {
              //res.redirect("/webkyrosapi/beacon/" + data.insertId);
              res.render("success",{
                  title : "Kyros API REST",
                  message : "Tracking created!"
              });
          }
          else {
              res.render("errorAPI",{
                  title : "Kyros API REST",
                  message : "mmmm ... something went wrong :("
              });
          }
        }
    });
});

/* Eliminar un tracking */
router.delete("/tracking/", function(req, res)
{
    sess=req.session;
    if(sess.username)
    {
      log.info ("Procesando DELETE de tracking");
    }
    else {
      res.render("errorAPI",{
          title : "Kyros API REST",
          message : "Please, login first"
      });
    }

    // id del tracking a eliminar
    var id = req.param('id');

    TrackingModel.deleteTracking(id,function(error, data) {
        if (data == null) {
          res.render("errorAPI",{
              title : "Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        } else {
            if(data && data.message === "deleted" || data.message === "notExist") {
              //res.redirect("/webkyrosapi/vertex/");
              res.render("success",{
                  title : "Kyros API REST",
                  message : "Tracking deleted!"
              });
            } else {
                res.render("errorAPI",{
                    title : "Kyros API REST",
                    message : "mmmm ... something went wrong :("
                });
              }
        }
    });
})

module.exports = router;
