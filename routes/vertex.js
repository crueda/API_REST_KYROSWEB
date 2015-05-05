var express = require('express');
var router = express.Router();
var AreaModel = require('../models/vertex');

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

/* GET. Obtenemos y mostramos todos las vertices */
/**
 * @api {get} /vertexes Request all vertex information
 * @apiName GetVertexes
 * @apiGroup Vertex
 *
 * @apiSuccess {Object[]} vertex       List of vertexes
 */
router.get('/vertexes/', function(req, res)
{
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

/* POST. Obtenemos y mostramos todos las vertices */
/**
 * @api {post} /areas Request all vertex information
 * @apiName PostVertexes
 * @apiGroup Vertex
 *
 * @apiSuccess {Object[]} vertex       List of vertex
 */
router.post('/vertexes/', function(req, res)
{
    VertexModel.getVertexes(function(error, data)
    {
        //si existen vertices, se envia el json
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

/* POST. Se obtiene un vertice por su id */
/**
 * @api {post} /vertex/:id Request vertex information
 * @apiName PostVertex Request vertex information
 * @apiGroup Vertex
 *
 * @apiParam {Number} id Vertex unique ID
 *
 * @apiSuccess {Number} areaId Identification of the area
 * @apiSuccess {String} description Description of the Vertex
 * @apiSuccess {Number} numVertex Number of the vertex in the area
 * @apiSuccess {Number} longitude Longitude of the vertex (WGS84)
 * @apiSuccess {Number} latitude Latitude of the vertex (WGS84)
 * @apiError VertexNotFound The <code>id</code> of the Vertex was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "notExist"
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
 *
 * @apiParam {Number} id Vertex unique ID
 * @apiParam {String} areaId Identification of the Area
 * @apiParam {String} description Description of the Vertex
 * @apiSuccess {Number} numVertex Number of the vertex in the area
 * @apiSuccess {Number} longitude Longitude of the vertex (WGS84)
 * @apiSuccess {Number} latitude Latitude of the vertex (WGS84)
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Vertex 867 updated",
 *     }
 */
router.put('/vertex/', function(req, res)
{
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
          //si el area se ha actualizado correctamente mostramos un mensaje
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
 *
 * @apiParam {Number} areaId Area identification
 * @apiParam {String} description DEscription of the vertex
 * @apiParam {Number} latitude Vertex latitude
 * @apiParam {Number} longitude Vertex longitude
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Vertex 867 created",
 *     }
 *
*/
router.post("/vertex", function(req,res)
{
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

/* DELETE. Eliminamos un vertice */
/**
 * @api {delete} /vertex Delete vertex
 * @apiName DeleteVertex
 * @apiGroup Vertex
 *
 * @apiParam {Number} id Vertex unique ID
 * @apiSuccess {String} message Result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Vertex 867 deleted",
 *     }
 *
 */
router.delete("/vertex/", function(req, res)
{
    // id del vertice a eliminar
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
