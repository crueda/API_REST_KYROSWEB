var mysql = require('mysql'),

// Crear la conexion a la base de datos
connection = mysql.createConnection(
    {
        host: '192.168.3.31',
        user: 'root',
        password: 'dat1234',
        database: 'sumo'
    }
);

// Crear un objeto para ir almacenando todo lo necesario
var vertexModel = {};

// Convertir grados en grados y minutos
function kcoords(px, py) {
    var x  = Math.abs(px);
    var dx = Math.floor(x);
    var mx = Math.floor((x - dx)*60);
    var sx = Math.floor(((x - dx) - (mx/60))*3600);
    if (px < 0) dx = -dx;
    var y  = Math.abs(py);
    var dy = Math.floor(y);
    var my = Math.floor((y - dy)*60);
    var sy = Math.floor(((y - dy) - (my/60))*3600);
    if (py < 0) dy = -dy;
    return (dx + '|' + (mx+sx/60) + ',' + dy + '|' + (my+sy/60));
}

// Obtener todos las vertices
vertexModel.getVertexes = function(callback) {
    if (connection) {
        connection.query('SELECT ID as id, AREA_ID as areaId, DESCRIPTION as description, NUM_VERTEX as numVertex, (POS_LATITUDE_DEGREE + POS_LATITUDE_MIN/60) as latitude, (POS_LONGITUDE_DEGREE + POS_LONGITUDE_MIN/60) as longitude FROM VERTEX ORDER BY id', function(error, rows) {
            if(error) {
                callback(null, null);
            } else {
                callback(null, rows);
            }
        });
    } else {
      callback(null, null);
    }
}

// Obtener un vertice por su id
vertexModel.getVertex = function(id,callback) {
    if (connection) {
        var sql = 'SELECT ID as id, DESCRIPTION as description, AREA_ID as areaId, NUM_VERTEX as numVertex, (POS_LATITUDE_DEGREE + POS_LATITUDE_MIN/60) as latitude, (POS_LONGITUDE_DEGREE + POS_LONGITUDE_MIN/60) as longitude FROM VERTEX WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, row)
        {
            if(error) {
                callback(null, null);
            } else{
                callback(null, row);
            }
        });
    } else {
      callback(null, null);
    }
}

// Actualizar un vertice
vertexModel.updateVertex = function(vertexData, callback)
{
    var coordenadas = kcoords(vertexData.latitude, vertexData.longitude);
    var lat = coordenadas.substring(0, coordenadas.indexOf(','));
    var lon = coordenadas.substring(coordenadas.indexOf(',')+1, coordenadas.length);
    var latdeg = lat.substring(0, lat.indexOf('|'));
    var latmin = lat.substring(lat.indexOf('|')+1, lat.length);
    var londeg = lon.substring(0, lon.indexOf('|'));
    var lonmin = lon.substring(lon.indexOf('|')+1, lon.length);

    if(connection) {
        var sql = 'UPDATE VERTEX SET DESCRIPTION = ' + connection.escape(areaData.description) + ',' +
        'AREA_ID = ' + connection.escape(areaData.areaId) + ',' +
        'NUM_VERTEX = ' + connection.escape(areaData.numVertex) + ',' +
        'POS_LATITUDE_DEGREE = ' + latdeg + ',' +
        'POS_LATITUDE_MIN = ' + latmin + ',' +
        'POS_LONGITUDE_DEGREE = ' + londeg + ',' +
        'POS_LONGITUDE_MIN = ' + londeg + ' ' +
        'WHERE id = ' + vertexData.id;

        connection.query(sql, function(error, result) {
            if(error) {
               callback(null, null);
            } else {
                callback(null,{"message":"success"});
            }
        });
    } else {
      callback(null, null);
    }

}

//añadir una nuevo vertice
vertexModel.insertVertex = function(vertexData,callback){
    var coordenadas = kcoords(vertexData.latitude, vertexData.longitude);
    var lat = coordenadas.substring(0, coordenadas.indexOf(','));
    var lon = coordenadas.substring(coordenadas.indexOf(',')+1, coordenadas.length);
    var latdeg = lat.substring(0, lat.indexOf('|'));
    var latmin = lat.substring(lat.indexOf('|')+1, lat.length);
    var londeg = lon.substring(0, lon.indexOf('|'));
    var lonmin = lon.substring(lon.indexOf('|')+1, lon.length);

    if (connection) {
        var sql = 'INSERT INTO VERTEX SET DESCRIPTION = ' + connection.escape(vertexData.description) + ',' +
        'AREA_ID = ' + connection.escape(vertexData.areaId) + ',' +
        'NUM_VERTEX = ' + connection.escape(vertexData.numVertex) + ',' +
        'POS_LATITUDE_DEGREE = ' + latdeg + ',' +
        'POS_LATITUDE_MIN = ' + latmin + ',' +
        'POS_LONGITUDE_DEGREE = ' + londeg + ',' +
        'POS_LONGITUDE_MIN = ' + lonmin;

        connection.query(sql, function(error, result) {
            if(error) {
               callback(null, null);
            }
            else {
                //devolvemos la última id insertada
                callback(null,{"insertId" : result.insertId});
            }
        });
    }
    else {
      callback(null, null);
    }
}

// Eliminar un vertice pasando la id a eliminar
vertexModel.deleteVertex = function(id, callback) {
    if(connection) {
        var sqlExists = 'SELECT * FROM VERTEX WHERE id = ' + connection.escape(id);
        connection.query(sqlExists, function(err, row) {
            //si existe la id del vertice a eliminar
            if(row) {
                var sql = 'DELETE FROM VERTEX WHERE id = ' + connection.escape(id);
                connection.query(sql, function(error, result) {
                    if(error) {
                      callback(null, null);
                    } else {
                        callback(null,{"message":"deleted"});
                    }
                });
            } else {
                callback(null,{"message":"notExist"});
            }
        });
    }
    else {
      callback(null, null);
    }
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = vertexModel;
