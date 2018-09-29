const config = require('config')
const mongoose = require('mongoose')
const {Category, Extra, Info, Meal, Slide, User} = require('./resources')
const {createReadStream, createWriteStream} = require('fs')

const index = list => list.reduce((result, item) => {
  result[item.id] = item
  return result
}, {})

const categoriesIndex = index(require('./data/categories.json'))
const mealsIndex = index(require('./data/meals.json'))
const extrasIndex = index(require('./data/extras.json'))

const picture = () => {
  const id = mongoose.Types.ObjectId().toString('hex')
  createReadStream(`${config.get('root')}/${config.get('pictures_path')}/none`)
    .pipe(createWriteStream(`${config.get('root')}/${config.get('pictures_path')}/${id}`))
  return `${config.get('domain')}/pictures/${id}`
}

const insertCategory = async ({meals, name, description, showOnNavbar, showOnHomePage}) => {
  const {id} = await Category.create({
    picture: picture(),
    name, description, showOnNavbar, showOnHomePage
  })
  const mealsIds = []
  for (const mealId of meals) {
    if (mealsIndex[mealId]) {
      const meal = await insertMeal({
        ... (mealsIndex[mealId]),
        category: id
      })
      mealsIds.push(meal.id)
    } 
  }
  return Category.findOneAndUpdate({_id: id}, {meals: mealsIds}, {new: true, runValidators: true})
}

const insertMeal = async ({category, extras, name, description, price, featured}) => {
  const extrasIds = []
  for (const extra of (extras || [])) {
    if (extrasIndex[extra.id]) {
      const {id} = await Extra.create(extrasIndex[extra.id])
      extrasIds.push(id)
    }
  }
  return Meal.create({
    picture: picture(), extras: extrasIds,
    category, name, description, price, featured
  })
}

const connect = async () => {
  mongoose.Promise = global.Promise
  return mongoose.connect(config.get('database'), {useNewUrlParser: true})
}

const disconnect = async () => mongoose.connection.close()

const seed = async () => {
  await Category.remove({})
  await Extra.remove({})
  await Info.remove({})
  await Meal.remove({})
  await Slide.remove({})
  await User.remove({})

  await User.create({name: 'admin', password: 'admin-naans'})

  const info = await Info.create({
    halal: "Viandes Halal",
    address: "42 Bld Wilson, 06600 Antibes",
    phone: "04 83 15 35 78",
    openingTime: "Du mardi au dimanche de 11h a 14h30 et de 18h15 a 22h15",
    shipping: "Livraison de 19h a 22h15 gratuit a partir de 12 euros",
    payment: "Cartes bancaires, especes et cheques restaurant",
    facebook: "https://www.facebook.com/Naansfood/",
    google: "https://www.google.fr/maps/place/Naan's/@43.5771401,7.1179202,15z/data=!4m2!3m1!1s0x0:0x5bc5bc1b4122c7a1?sa=X&ved=0ahUKEwjj6caS4fzXAhVIIOwKHfvcDHEQ_BIIzwEwFw"
  })
  console.log({infoId: info.id})

  await Slide.insertMany([
    {description: 'Bienvenue ...', picture: picture()},
    {description: 'Bon appetit!', picture: picture()}
  ])

  for (const id in categoriesIndex) {
    await insertCategory(categoriesIndex[id])
  }

  console.log('Done!')
}

const init = async () => {
  await connect()
  await seed()
  await disconnect()
}

init()