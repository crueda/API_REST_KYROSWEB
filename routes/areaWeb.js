var express = require('express');
var router = express.Router();
var AreaModel = require('../models/area');

router.get('/', function(req, res)
{
  res.render('index', { title: ' Kyros API REST'});
});


/* Creamos un nuevo area */
router.post("/area", function(req,res)
{
    //creamos un objeto con los datos a insertar del area
    var areaData = {
        id : null,
        description : req.body.description,
        initDate : req.body.initDate,
        endDate : req.body.endDate,
        initHours : req.body.initHours,
        endHour : req.body.endHour,
        typeArea : req.body.typeArea,
        radius : req.body.radius,
        username : 'API'
    };
    AreaModel.insertArea(areaData,function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          //si el area se ha insertado correctamente mostramos su info
          if(data && data.insertId)
          {
              //res.redirect("/webapiweb/area/" + data.insertId);
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Area created!"
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

/* Actualizamos un area existente */
router.put('/area/', function(req, res)
{
    // Almacenar los datos del formulario en un objeto
    var areaData = {id:req.param('id'),description:req.param('description'),typeArea:req.param('typeArea'),initDate:req.param('initDate'),endDate:req.param('endDate'),initHour:req.param('initHour'),endHour:req.param('endHour'),radius:req.param('radius')};
    AreaModel.updateArea(areaData,function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          //si el area se ha actualizado correctamente mostramos un mensaje
          if(data && data.message)
          {
              //res.redirect("/webkyrosapi/area/" + req.param('id'));
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Area updated!"
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


/* Nuevo area */
router.get('/newarea/', function(req, res)
{
    res.render("newArea",{
        title : " Kyros API REST",
      });
});

/* Obtenemos un area por su id y lo mostramos en un formulario para editar */
router.get('/area/:id', function(req, res)
{
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        AreaModel.getArea(id,function(error, data)
        {
            if (data == null) {
              res.render("errorAPI",{
                  title : " Kyros API REST",
                  message : "mmmm ... something went wrong :("
              });
            }
            else {
              //si existe el area mostramos el formulario
              if (typeof data !== 'undefined' && data.length > 0)
              {
                  res.render("updateArea",{
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
      //res.json(500,{"message":"The id must be numeric"});
    }
});

/* Obtenemos y mostramos todos las areas */
router.get('/areas/', function(req, res)
{
    AreaModel.getAreas(function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :("
          });
        }
        else {
          // Mostar la lista
          if (typeof data !== 'undefined')
          {
              res.render("showAreas",{
                  title : " Kyros API REST",
                  areas : data
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
});

/* Eliminar un area */
router.delete("/area/", function(req, res)
{
    //id del area a eliminar
    var id = req.param('id');

    AreaModel.deleteArea(id,function(error, data)
    {
        if (data == null) {
          res.render("errorAPI",{
              title : " Kyros API REST",
              message : "mmmm ... something went wrong :(" + " .... " +  error
          });
        }
        else {
          if(data && data.messege === "deleted" || data.messege === "notExist")
          {
              //res.redirect("/webkyrosapi/areas/");
              res.render("success",{
                  title : " Kyros API REST",
                  message : "Area deleted!"
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
})

module.exports = router;
