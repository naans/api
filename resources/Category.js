const mongoose = require('mongoose')
    , transform = require('wajez-transform')
    , Schema = mongoose.Schema
    , {id, ids, collectionOf, resourceOf} = require('../utils')

const schema = new Schema({
    meals: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Meal',
    	default: []
    }],
    picture: {
        type: String,
    	required: true
    },
    name: {
    	type: String,
    	unique: true,
    	required: true
    },
    description: {
    	type: String,
    	required: true
    },
    showOnNavbar: {
    	type: Boolean,
    	default: true
    },
    showOnHomePage: {
    	type: Boolean,
    	default: true
    }
})

const model = mongoose.model('Category', schema)

model.json = {
	resource: transform({
	    meals: ['meals', collectionOf('Meal')],
        id: 'id',
        name: 'name',
	    picture: 'picture',
	    description: 'description',
	    showOnNavbar: 'showOnNavbar',
	    showOnHomePage: 'showOnHomePage'	
	}),
	collectionItem: transform({
	    meals: ['meals', ids],
        id: 'id',
        name: 'name',
	    picture: 'picture',
	    description: 'description',
	    showOnNavbar: 'showOnNavbar',
	    showOnHomePage: 'showOnHomePage'	
	})
}

module.exports = model
