var express = require('express');
var router = express.Router();
var AreaModel = require('../models/area');

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

/* Creamos un nuevo area */
/**
 * @api {post} /area/ Create new area
 * @apiName PostNewArea
 * @apiGroup Area
 *
 * @apiDescription Create new areas
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/area
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 * @apiParam {String} description Description of the Area
 * @apiParam {Number} dateInit Init date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiParam {Number} dateEnd End date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiParam {Number} hourInit Init hour for the Area. hhmm format
 * @apiParam {Number} hourEnd End hour for the Area. hhmm format
 * @apiParam {String} typeArea Type of area (A=Allow, F=Forbidden, G=Generic)
 * @apiParam {String} radius Radius of area (in meters)
 *
 * @apiSuccess {Number} id Area unique ID
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 867
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid user"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid token"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Token expired"
 *     }
 */
router.post("/area", function(req,res)
{
    //creamos un objeto con los datos a insertar del area
    var areaData = {
        id : null,
        description : req.body.description,
        initDate : req.body.initDate,
        endDate : req.body.endDate,
        initHour : req.body.initHour,
        endHour : req.body.endHour,
        typeArea : req.body.typeArea,
        radius : req.body.radius,
        username : 'apiAPI'
    };
    AreaModel.insertArea(areaData,function(error, data)
    {
        //si el usuario se ha insertado correctamente mostramos mensaje
        if(data && data.insertId)
        {
            res.json(200,{"message":data.insertId});
        }
        else
        {
            res.json(500,{"message":"Error"});
        }
    });
});

/* PUT. Actualizamos un area existente */
/**
 * @api {put} /area/ Update area
 * @apiName PutNewArea
 * @apiGroup Area
 *
 * @apiDescription Areas of api
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/area
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 * @apiParam {Number} id Area unique ID
 * @apiParam {String} description Description of the Area
 * @apiParam {Number} dateInit Init date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiParam {Number} dateEnd End date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiParam {Number} hourInit Init hour for the Area. hhmm format
 * @apiParam {Number} hourEnd End hour for the Area. hhmm format
 * @apiParam {String} typeArea Type of area (A=Allow, F=Forbidden, G=Generic)
 * @apiParam {String} radius Radius of area (in meters)
 *
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Area 867 updated",
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid user"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid token"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Token expired"
 *     }
 */
router.put('/area/', function(req, res)
{
    //almacenamos los datos del formulario en un objeto
    var areaData = {id:req.param('id'),description:req.param('description'),typeArea:req.param('typeArea')};
    AreaModel.updateArea(areaData,function(error, data)
    {
        //si el area se ha actualizado correctamente mostramos un mensaje
        if(data && data.message)
        {
            res.json(200,{"message":"Area " + req.param('id') + "updated"})
        }
        else
        {
            res.json(500,{"message":"Error"});
        }
    });
});

/* POST. Obtenemos un area por su id */
/**
 * @api {post} /area/:id Request Area information
 * @apiName PostArea Request area information
 * @apiGroup Area
 *
 * @apiDescription Get api area information
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/area
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeader {String} x-key API username
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *       "x-key": "my_username"
 *     }
 *
 * @apiParam {Number} id Area unique ID
 *
 * @apiSuccess {String} description Description of the Area
 * @apiSuccess {Number} dateInit Init date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiSuccess {Number} dateEnd End date for the Area. Milliseconds since january 1 1970 (epoch)
 * @apiSuccess {Number} hourInit Init hour for the Area. Milliseconds since start current date
 * @apiSuccess {Number} hourEnd End hour for the Area. Milliseconds since start current date
 * @apiSuccess {String} typeArea Type of area (A=Allow, F=Forbidden, G=Generic)
 * @apiSuccess {Number} radius Radius of area (in meters)
 * @apiError AreaNotFound The <code>id</code> of the Area was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "notExist"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid user"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid token"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Token expired"
 *     }
 */
router.post('/area/:id', function(req, res)
{
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        AreaModel.getArea(id,function(error, data)
        {
            //si existe el area enviamos el json
            if (typeof data !== 'undefined' && data.length > 0)
            {
                res.json(200,{"message":data})
            }
            //en otro caso mostramos un error
            else
            {
                res.json(404,{"message":"notExist"});
            }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
        res.json(500,{"message":"The id must be numeric"});
    }
});

/* GET. Obtenemos y mostramos todos las areas */
router.get('/areas/', function(req, res)
{
    AreaModel.getAreas(function(error, data)
    {
        //si existe el area, enviamos el json
        if (typeof data !== 'undefined')
        {
            res.json(200,{"results":data})
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404,{"message":"notExist"});
        }
    });
});

/* POST. Obtenemos y mostramos todos las areas */
/**
 * @api {post} /areas Request all areas information
 * @apiName PostAreas
 * @apiGroup Area
 *
 * @apiDescription List all areas
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/areas
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 * @apiSuccess {Object[]} area       List of areas
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid user"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid token"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Token expired"
 *     }
 */
router.post('/areas/', function(req, res)
{
    AreaModel.getAreas(function(error, data)
    {
        //si existe el area, enviamos el json
        if (typeof data !== 'undefined')
        {
            res.json(200,{"results":data})
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404,{"message":"notExist"});
        }
    });
});

/* DELETE. Eliminamos un area */
/**
 * @api {delete} /area Delete area
 * @apiName DeleteArea
 * @apiGroup Area
 * @apiDescription Delete area
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/area
 *
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 * @apiParam {Number} id Area unique ID
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "area 867 deleted",
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid user"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Invalid token"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Not authorized
 *     {
 *       "message": "Token expired"
 *     }
 */
router.delete("/area/", function(req, res)
{
    //id del area a eliminar
    var id = req.param('id');
    AreaModel.deleteArea(id,function(error, data)
    {
        if(data && data.message === "deleted" || data.message === "notExist")
        {
            res.redirect("/areas/");
        }
        else
        {
            res.json(500,{"message":"Error"});
        }
    });
})

module.exports = router;
