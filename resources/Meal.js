const mongoose = require('mongoose')
    , transform = require('wajez-transform')
    , Schema = mongoose.Schema
    , {id, ids, collectionOf, resourceOf} = require('../utils')

const schema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    extras: [{type: Schema.Types.ObjectId, ref: 'Extra'}],
    name: {type: String, required: true},
    picture: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    featured: {type: Boolean, default: false}
})

const model = mongoose.model('Meal', schema)

model.json = {
	resource: transform({
		id: 'id',
	    category: ['category', resourceOf('Category')],
	    extras: ['extras', collectionOf('Extra')],
	    name: 'name',
	    picture: 'picture',
	    description: 'description',
	    price: 'price',
	    featured: 'featured'
	}),
	collectionItem: transform({
		id: 'id',
	    category: ['category', resourceOf('Category')],
	    extras: ['extras', collectionOf('Extra')],
	    name: 'name',
	    picture: 'picture',
	    description: 'description',
	    price: 'price',
	    featured: 'featured'
	})
}

module.exports = model
