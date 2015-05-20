var express = require('express');
var router = express.Router();
var AreaModel = require('../models/vertex');

// Fichero de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./api.properties');


function kcoords(px, py) {
    var x  = Math.abs(x);
    var dx = Math.floor(x);
    var mx = Math.floor((x - dx)*60);
    //var sx = Math.floor(((x - dx) - (mx/60))*3600);
    if (px < 0) dx = -dx;
    var y  = Math.abs(py);
    var dy = Math.floor(y);
    var my = Math.floor((y - dy)*60);
    //var sy = Math.floor(((y - dy) - (my/60))*3600);
    if (py < 0) dy = -dy;
    //return (dx + '°' + mx + 'min ' + sx + 'seg ' + dy + '°' + my + 'min ' + sy + 'seg');
    return (dx + ',' + mx + '-' + dy + ',' + my);
}

/* POST. Obtenemos y mostramos todos los vertices */
/**
 * @api {post} /vertexes Request all vertex information
 * @apiName GetVertexes
 * @apiGroup Vertex
 * @apiDescription List of vertexes
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/vertexes
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 *
 * @apiSuccess {Object[]} vertex       List of vertexes
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "notExist"
 *     }
 */
router.post('/vertexes/', function(req, res)
{
    log.info ("Procesando POST de vertexes");

    VertexModel.getVertexes(function(error, data)
    {
        //si existen vertices, se envia el json
        if (typeof data !== 'undefined')
        {
            res.json(200,{"results":data})
        }
        //en otro caso se muestra un error
        else
        {
            res.json(404,{"message":"notExist"});
        }
    });
});

/* POST. Se obtiene un vertice por su id */
/**
 * @api {post} /vertex/:id Request vertex information
 * @apiName PostVertex Request vertex information
 * @apiGroup Vertex
 * @apiDescription Vertex information
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/vertex
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 *
 * @apiParam {Number} id Vertex unique ID
 *
 * @apiSuccess {Number} areaId Identification of the area
 * @apiSuccess {String} description Description of the vertex
 * @apiSuccess {Number} numVertex Number of the vertex in the area
 * @apiSuccess {Number} longitude Longitude of the vertex (WGS84)
 * @apiSuccess {Number} latitude Latitude of the vertex (WGS84)
 * @apiError VertexNotFound The <code>id</code> of the vertex was not found.
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
router.post('/vertex/:id', function(req, res)
{
    var id = req.params.id;
    //solo actualizamos si el id es un número
    if(!isNaN(id))
    {
        VertexModel.getVertex(id,function(error, data)
        {
          if (data == null)
          {
            res.json(500,{"message":"mmmm ... something went wrong :("});
          }
          else
          {
            //si existe el vertice enviamos el json
            if (typeof data !== 'undefined' && data.length > 0)
            {
                res.json(200,{"message":data})
            }
            //en otro caso mostramos un error
            else
            {
                res.json(404,{"message":"notExist"});
            }
          }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
        res.json(500,{"message":"The id must be numeric"});
    }
});

/* PUT. Actualizamos un vertice existente */
/**
 * @api {put} /vertex/ Update vertex
 * @apiName PutNewVertex
 * @apiGroup Vertex
 * @apiDescription Update vertex
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/vertex
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 *
 * @apiParam {Number} id Vertex unique ID
 * @apiParam {String} areaId Identification of the area
 * @apiParam {String} description Description of the vertex
 * @apiParam {Number} numVertex Number of the vertex in the area
 * @apiParam {Number} longitude Longitude of the vertex (WGS84)
 * @apiParam {Number} latitude Latitude of the vertex (WGS84)
 *
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Vertex 867 updated",
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
router.put('/vertex/', function(req, res)
{
    log.info ("Procesando PUT de vertex");

    //almacenamos los datos del formulario en un objeto
    var vertexData = {id:req.param('id'),description:req.param('description'),areaId:req.param('areaId'),numVertex:req.param('numVertex'),latitude:req.param('latitude'),longitude:req.param('longitude')};
    VertexModel.updateVertex(vertexData,function(error, data)
    {
        if (data == null)
        {
          res.json(500,{"message":"mmmm ... something went wrong :("});
        }
        else
        {
          //si el vertex se ha actualizado correctamente mostramos un mensaje
          if(data && data.message)
          {
              res.json(200,{"message":"Vertex " + req.param('id') + "updated"})
          }
          else
          {
            res.json(500,{"message":"mmmm ... something went wrong :("});
          }
        }
    });
});


/**
 * @api {post} /vertex/ Create new vertex
 * @apiName PostNewVertex
 * @apiGroup Vertex
 * @apiDescription Create new vertex
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/vertex
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 *
 * @apiParam {Number} areaId Area identification
 * @apiParam {String} description Description of the vertex
 * @apiParam {Number} latitude Vertex latitude
 * @apiParam {Number} longitude Vertex longitude
 *
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 867
 *     }
 *
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
router.post("/vertex", function(req,res)
{
    log.info ("Procesando POST de vertex");

    // Crear un objeto con los datos a insertar del vertice
    var vertexData = {
        id : null,
        areaId : req.body.areaId,
        description : req.body.description,
        numVertex : req.body.numVertex,
        latitude : req.body.latitude,
        longitude : req.body.longitude
    };

    VertexModel.insertVertex(vertexData,function(error, data)
    {
        if (data == null)
        {
          res.json(500,{"message":"mmmm ... something went wrong :("});
        }
        else
        {
          // si el vertice se ha insertado correctamente mostramos su messaje de exito
          if(data && data.insertId)
          {
              res.json(200,{"message":data.insertId});
          }
          else
          {
             res.json(500,{"message":"mmmm ... something went wrong :("});
          }
        }
    });
});

/* DELETE. Eliminar un vertice */
/**
 * @api {delete} /vertex Delete vertex
 * @apiName DeleteVertex
 * @apiGroup Vertex
 * @apiDescription Delete vertex
 * @apiSampleRequest http://api.kyroslbs.com:3000/kyrosapi/vertex
 * @apiHeader {String} x-access-token JSON Web Token (JWT)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzIyMTg2ODc1ODksImlzcyI6InN1bW8iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9._tYZLkBrESt9FwOccyvripIsZR5S0m8PLZmEgIDEFaY"
 *     }
 *
 *
 * @apiParam {Number} id Vertex unique ID
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Vertex 867 deleted",
 *     }
 *
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
router.delete("/vertex/", function(req, res)
{
   log.info ("Procesando DELETE de vertex");

    // id del elemento a eliminar
    var id = req.param('id');
    VertexModel.deleteVertex(id,function(error, data)
    {
        if (data == null)
        {
          res.json(500,{"message":"mmmm ... something went wrong :("});
        }
        else
        {
            if(data && data.message === "deleted" || data.message === "notExist")
            {
              res.json(200,{"message":"Vertex " + req.param('id') + "deleted"})
            }
            else
            {
              res.json(500,{"message":"mmmm ... something went wrong :("});
            }
        }
    });

});

module.exports = router;
