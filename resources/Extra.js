const mongoose = require('mongoose')
    , transform = require('wajez-transform')
    , Schema = mongoose.Schema

const schema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true}
})

const model = mongoose.model('Extra', schema)

model.json = {
	resource: transform({
		id: 'id',
	    name: 'name',
	    price: 'price'
	}),
	collectionItem: transform({
		id: 'id',
	    name: 'name',
	    price: 'price'
	})
}

module.exports = model
