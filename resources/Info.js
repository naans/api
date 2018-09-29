const mongoose = require('mongoose')
    , transform = require('wajez-transform')
    , Schema = mongoose.Schema

const schema = new Schema({
  halal: String,
	address: String,
	phone: String,
	openingTime: String,
	shipping: String,
	payment: String,
	facebook: String,
	google: String
})

const model = mongoose.model('Info', schema)

const serialize = transform({
	id: 'id',
	halal: 'halal',
	address: 'address',
	phone: 'phone',
	openingTime: 'openingTime',
	shipping: 'shipping',
	payment: 'payment',
	facebook: 'facebook',
	google: 'google'
})

model.json = {
	resource: serialize,
	collectionItem: serialize
}

module.exports = model
