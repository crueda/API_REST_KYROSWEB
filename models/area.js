var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./api.properties');

// Definición del log
var fs = require('fs');
var Log = require('log');
var log = new Log('debug', fs.createWriteStream(properties.get('main.log.file')));

//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql'),
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
    {
        host: properties.get('bbdd.mysql.ip') ,
        user: properties.get('bbdd.mysql.user') ,
        password: properties.get('bbdd.mysql.passwd') ,
        database: properties.get('bbdd.mysql.name')
    }
);

//creamos un objeto para ir almacenando todo lo que necesitemos
var areaModel = {};

//obtenemos todos las areas
areaModel.getAreas = function(callback)
{
    if (connection)
    {
        connection.query('SELECT ID as id, DESCRIPTION as description, DATE_INIT as initDate, DATE_END as endDate, HOUR_INIT as initHour, HOUR_END as endHour, TYPE_AREA as typeArea, RADIUS as radius, USER_NAME as username FROM AREA ORDER BY id', function(error, rows) {
            if(error)
            {
                callback(error, null);
            }
            else
            {
                callback(null, rows);
            }
        });
    }
    else {
      callback(null, null);
    }
}

//obtenemos un area por su id
areaModel.getArea = function(id,callback)
{
    if (connection)
    {
        var sql = 'SELECT ID as id, DESCRIPTION as description, DATE_INIT as initDate, DATE_END as endDate, HOUR_INIT as initHour, HOUR_END as endHour, TYPE_AREA as typeArea, RADIUS as radius, USER_NAME as username  FROM AREA WHERE id = ' + connection.escape(id);

        log.debug ("Query: "+sql);

        connection.query(sql, function(error, row)
        {
            if(error)
            {
                callback(error, null);
            }
            else
            {
                callback(null, row);
            }
        });
    }
    else {
      callback(null, null);
    }
}

//añadir una nueva area
areaModel.insertArea = function(areaData,callback)
{
    if (connection)
    {
        var sql = 'INSERT INTO AREA SET DESCRIPTION = ' + connection.escape(areaData.description) + ',' +
        'DATE_INIT = ' + connection.escape(areaData.initDate) + ',' +
        'DATE_END = ' + connection.escape(areaData.endDate) + ',' +
        'HOUR_INIT = ' + connection.escape(areaData.initHour) + ',' +
        'HOUR_END = ' + connection.escape(areaData.endHour) + ',' +
        'TYPE_AREA = ' + connection.escape(areaData.typeArea) + ',' +
        'RADIUS = ' + connection.escape(areaData.radius) + ',' +
        'USER_NAME = \'sumoAPI\'';

        log.debug ("Query: "+sql);

        connection.query(sql, function(error, result)
        {
            if(error)
            {
                callback(error, null);
            }
            else
            {
                //TODO. insertar en tabla ROUTE_FLEET
                var areaId = result.insertId;



                //devolvemos la última id insertada
                callback(null,{"insertId" : areaId});
            }
        });
    }
    else {
      callback(null, null);
    }
}

//actualizar un area
areaModel.updateArea = function(areaData, callback)
{
    if(connection)
    {
        var sql = 'UPDATE AREA SET DESCRIPTION = ' + connection.escape(areaData.description) + ',' +
        'TYPE_AREA = ' + connection.escape(areaData.typeArea) + ',' +
        'DATE_INIT = ' + connection.escape(areaData.initDate) + ',' +
        'DATE_END = ' + connection.escape(areaData.endDate) + ',' +
        'HOUR_INIT = ' + connection.escape(areaData.initHour) + ',' +
        'HOUR_END = ' + connection.escape(areaData.endHour) + ',' +
        'RADIUS = ' + connection.escape(areaData.radius) + ' ' +
        'WHERE id = ' + areaData.id;

        log.debug ("Query: "+sql);

        connection.query(sql, function(error, result)
        {
            if(error)
            {
                callback(error, null);
            }
            else
            {
                callback(null,{"message":"success"});
            }
        });
    }
    else {
      callback(null, null);
    }
}

//eliminar un area pasando la id a eliminar
areaModel.deleteArea = function(id, callback)
{
    if(connection)
    {
        var sqlExists = 'SELECT * FROM AREA WHERE ID = ' + connection.escape(id);

        log.debug ("Query: "+sqlExists);

        connection.query(sqlExists, function(err, row)
        {
            //si existe la id del area a eliminar
            if(row)
            {
                var sql = 'DELETE FROM AREA WHERE ID = ' + connection.escape(id);

                log.debug ("Query: "+sql);

                connection.query(sql, function(error, result)
                {
                    if(error)
                    {
                        callback(error, null);                    }
                    else
                    {
                        // Borrar de la tabla ROUTE_FLEET
                        var sqlHas = 'DELETE FROM AREA_FLEET WHERE AREA_ID = ' + connection.escape(id);

                        log.debug ("Query: "+sqlHas);

                        connection.query(sqlHas, function(error, result)
                        {
                            if(error)
                            {
                                callback(error, null);                    }
                            else
                            {
                                callback(null,{"message":"deleted"});
                            }
                        });
                    }
                });
            }
            else
            {
                callback(null,{"message":"notExist"});
            }
        });
    }
    else {
      callback(null, null);
    }
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = areaModel;
