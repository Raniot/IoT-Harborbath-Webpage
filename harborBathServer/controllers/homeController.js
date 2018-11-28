require('../../Listener');
var db = require('../../dbHandler');

module.exports.index = async (req, res) => {
    var dataForTable = await db.getAll();
    var humanData = await db.getAllSensorType('Human counter');
    var tmpData = await db.getAllSensorType('Temperature');
    var humData = await db.getAllSensorType('Humidity');
    var humans = [];
    var temperature = [];
    var humidity = [];

    humanData.forEach(element => {
        humans.push({"Time": element.Time, "Value": element.Value});
    });
    tmpData.forEach(element => {
        temperature.push({"Time": element.Time, "Value": element.Value});
    });
    humData.forEach(element => {
        humidity.push({"Time": element.Time, "Value": element.Value});
    });
    
    res.render('index', { title: 'Data', dataset: dataForTable, data: JSON.stringify({"data": humans}), tdata: JSON.stringify({"data": temperature}), humdata: JSON.stringify({"data": humidity})  });
}