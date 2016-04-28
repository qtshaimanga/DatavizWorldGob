var path = require('path');
var low = require('lowdb');

var db = low(path.resolve(__dirname, './data/diplomas.json'));
console.log(db)

module.exports = db('selection');
