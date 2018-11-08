const sql = require("mssql");
var tableName = 'harborbath';

var sqlConfig = {
    server: "raniot.database.windows.net",
    database: "raniot_haborbath",
    user: "raniotAdmin",
    password: "Kodeord123",
    port: 1433,
    options: {
          encrypt: true
      }
   };

module.exports.save = async (sensorMessurement) => {
    try {
        var pool = await new sql.ConnectionPool(sqlConfig).connect();
        const request = await pool.request()

        sensorMessurement.body.Sensors.forEach((sensor, i) => {
            request.input('sensorType' + i, sql.NVarChar, sensor.Type)
            request.input('messurementUnit' + i, sql.NVarChar, sensor.Unit)
            request.input('messurement' + i, sql.NVarChar, sensor.Value)
        
            request.query(`INSERT INTO ${tableName}(timeRecorded, sensorType, messurementUnit, messurement) VALUES(CURRENT_TIMESTAMP, @sensorType${i}, @messurementUnit${i}, @messurement${i})`)
            });
    } catch (error) {
        console.log(error);
    }finally{
        sql.close();
    }
}

module.exports.getAll = async () => {
    try {
        var pool = await new sql.ConnectionPool(sqlConfig).connect();
        const request = await pool.request()
        var list = [];

        var data = await request.query(`SELECT timerecorded, sensorType, messurementUnit, messurement FROM ${tableName} ORDER BY timerecorded`);
        data.recordset.forEach(element => {
            list.push({TimeRecorded: String(element.timerecorded), SensorType: element.sensorType, MessurementUnit: element.messurementUnit, Messurement: element.messurement});
        });
        
        return list;

    } catch (error) {
        console.log(error);
    }finally{
        sql.close();
    }
}