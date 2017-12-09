const mongoose = require('mongoose')
    , transform = require('wajez-transform')
    , Schema = mongoose.Schema
    , {id, resourceOf} = require('../utils')

const schema = new Schema({
    picture: {type: String, required: true},
    description: {type: String, required: true}
})

const model = mongoose.model('Slide', schema)

model.json = {
	resource: transform({
		id: 'id',
	    picture: 'picture',
	    description: 'description'
	}),
	collectionItem: transform({
		id: 'id',
	    picture: 'picture',
	    description: 'description'
	})
}

module.exports = model
