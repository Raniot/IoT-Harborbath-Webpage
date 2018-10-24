const sql = require("mssql");

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

module.exports.save = async (message) => {
    try {
        var pool = await sql.connect(sqlConfig);
        const request = await pool.request()
        request.input('inmessage', sql.VarChar, JSON.stringify(message.body))
        await request.query("INSERT INTO test(id, message) VALUES(1, @inmessage)")
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
        return await request.query("SELECT message FROM test")
    } catch (error) {
        console.log(error);
    }finally{
        sql.close();
    }
}