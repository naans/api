const mongoose = require('mongoose')

/**
 * Converts an asynchromous function `f` which accepts a callback
 * to a function `g` which returns a Promise. The callback should
 * be the last argument of `f` with signature callback(err, data)
 *
 * @param  {Function} fn
 * @return {Function}
 */
const promisify = fn => (...args) => {
    const callback = (resolve, reject) => {
        return (err, data) => {
            if (err)
                return reject(err)
            return resolve(data)
        }
    }

    return new Promise((resolve, reject) => fn(...args, callback(resolve, reject)))
}

const nullable = fn =>
	arg => arg ? fn(arg) : arg

const id = nullable(resource => {
	if (! resource.id)
		return resource.toString('hex')
	return resource.id.toString('hex')
})

const ids = nullable(collection => collection.map(id))

const collectionOf = modelName => 
	nullable(collection => collection.map(mongoose.model(modelName).json.collectionItem))

const resourceOf = modelName =>
	nullable(resource => mongoose.model(modelName).json.collectionItem(resource))


module.exports = {id, ids, collectionOf, resourceOf, promisify}
