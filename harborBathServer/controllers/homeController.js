require('../../Listener');
var db = require('../../dbHandler');

module.exports.index = async (req, res) => {
    var data = await db.getAll();
    res.render('index', { title: 'Express', dataset: data });
}