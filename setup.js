const mongoose = require('mongoose')
	, config = require('config')
	, User = require('./resources/User')
    , Info = require('./resources/Info')
    , Meal = require('./resources/Meal')
    , Extra = require('./resources/Extra')
    , Category = require('./resources/Category')
    , {createReadStream, createWriteStream} = require('fs')

const pathOf = id => `${config.get('root')}/${config.get('pictures_path')}/${id}`
const urlOf = id => `${config.get('domain')}/pictures/${id}`

const picture = () => {
	const id = mongoose.Types.ObjectId().toString('hex')

	createReadStream(pathOf('none'))
	.pipe(createWriteStream(id))

	return urlOf(id)
}

const category = name => ({
	name: name,
	picture: picture(),
	description: '...',
	showOnNavbar: false,
	showOnHomePage: false
})

const clean = () => Promise.all([
	User.remove({}),
	Category.remove({}),
	Extra.remove({}),
	Info.remove({}),
	Meal.remove({})
])

const addUser = () =>
	User.create({name: 'admin', password: 'admin'})
	.then(console.log)

const addInfos = () =>
	Info.create({})
	.then(console.log)

const addMeals = () => Promise.all([
	Category.create(category('Sandwitches'))
	.then()

])

module.exports = () => clean()
	.then(Promise.all([addUser(), addInfos()]))
	.then(console.log('Done !'))
	.catch(console.error)
