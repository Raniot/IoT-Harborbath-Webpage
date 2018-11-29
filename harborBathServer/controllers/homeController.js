require('../../Listener');
var db = require('../../dbHandler');

module.exports.index = async (req, res) => {
    var dataForTable = await db.getAll();
    var humanData = await db.getAllSensorType('Human counter', 6);
    var tmpData = await db.getAllSensorType('Temperature', 6);
    var humData = await db.getAllSensorType('Humidity', 6);
    var humanData2h = await db.getAllSensorType('Human counter', 2);
    var tmpData2h = await db.getAllSensorType('Temperature', 2);
    var humData2h = await db.getAllSensorType('Humidity', 2);

    humans = toSensorList(humanData)
    temperature = toSensorList(tmpData)
    humidity = toSensorList(humData)
    humans2h = toSensorList(humanData2h)
    temperature2h = toSensorList(tmpData2h)
    humidity2h = toSensorList(humData2h)

    if(humans2h.length != 0){
        humanCountDiff = getValueDiffFromFirstToLast(humans2h)
        temperatureDiff = getValueDiffFromFirstToLast(temperature2h)
        humidityDiff = getValueDiffFromFirstToLast(humidity2h)

        humanPrediction = humanCountDiff
        amplifier = 1
        if(temperatureDiff > 0)
            amplifier += 0.2
        else
            amplifier -= 0.2
            
        if(humidityDiff < 0)
            amplifier += 0.2
        else{
            amplifier -= 0.2     
        }

        if(humanCountDiff > 0)
            humanPrediction = humanCountDiff*amplifier
        else{
            humanPrediction = humanCountDiff/amplifier
        }
        
        newestListObj = humans2h[humans2h.length-1]
        newestListObj.Value = (parseInt(newestListObj.Value) + humanPrediction).toString()
        var dateTo = new Date(Date.now())
        newestListObj.Time = dateTo.setHours(dateTo.getHours() + 2)

        humans.push(newestListObj)

        // get the time closest to 2 hours ago
        // take humans differens amount
        // get temp change from the last 2 hours, if higher increase the number
        // get humi change from the last 2 hours, if lower increase the number 
    }

    function getValueDiffFromFirstToLast(list){
        newestListObj = list[list.length-1]
        oldestListObj = list[0]

        listObjDiff = newestListObj.Value - oldestListObj.Value
        return listObjDiff 
    }

    function toSensorList(data) {
        var list = [];
        data.forEach(element => {
            list.push({"Time": element.Time, "Value": element.Value});
        });
        return list;
      }

    res.render('index', { title: 'Data', dataset: dataForTable, data: JSON.stringify({"data": humans}), tdata: JSON.stringify({"data": temperature}), humdata: JSON.stringify({"data": humidity})});
}
