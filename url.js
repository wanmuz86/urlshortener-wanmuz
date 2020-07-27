let mongoose = require('mongoose');

let urlSchema = new mongoose.Schema({
	shortenUrl: Number,
	longUrl:String
})

module.exports = mongoose.model('Url', urlSchema);