require('../../Listener');
var db = require('../../dbHandler');

module.exports.index = async (req, res) => {
    var dataForTable = await db.getAll();
    var tempData = await db.getAllSensorType('Human counter');
    var array = [];
    
    tempData.forEach(element => {
        array.push({"Time": element.Time, "Value": element.Value});
    });

    res.render('index', { title: 'Data', dataset: dataForTable, data: JSON.stringify({"data": array}) });
}