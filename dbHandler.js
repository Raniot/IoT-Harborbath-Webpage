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
        var pool = await sql.connect(sqlConfig);
        const request = await pool.request()

        request.input('sensorType', sql.NVarChar, sensorMessurement.body.sensorType)
        request.input('messurementUnit', sql.NVarChar, sensorMessurement.body.messurementUnit)
        request.input('messurement', sql.NVarChar, sensorMessurement.body.messurement)


        await request.query(`INSERT INTO ${tableName}(timeRecorded, sensorType, messurementUnit, messurement) VALUES(CURRENT_TIMESTAMP, @sensorType, @messurementUnit, @messurement)`)
    } catch (error) {
        console.log(error);
    }finally{
        sql.close();
    }
}

module.exports.getAll = async () => {
    try {
        var pool = await sql.connect(sqlConfig);
        const request = await pool.request()
        var list = [];

        var data = await request.query(`SELECT timerecorded, sensorType, messurementUnit, messurement FROM ${tableName}`);
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