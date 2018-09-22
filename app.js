const R    = require('ramda')
    , wz   = require('wajez-api')
    , config = require('config')
    , express = require('express')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , Category = require('./resources/Category')
    , Extra = require('./resources/Extra')
    , Info = require('./resources/Info')
    , Meal = require('./resources/Meal')
    , Slide = require('./resources/Slide')
    , User = require('./resources/User')
    , pictures = require('./routes/pictures')
    , users = require('./routes/users')
    , {ids, id} = require('./utils')

mongoose.Promise = global.Promise
mongoose.connect(config.get('database'), {useNewUrlParser: true})

const app = express()
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}))
app.use((req, res, next) => {
    console.log(req)
    next()
})
app.use('/photos', express.static(`${config.get('root')}/${config.get('pictures_path')}`))

const resources = [Category, Extra, Info, Meal, Slide, User]
const relations = [
    wz.oneMany('Category', 'meals', 'Meal', 'category'),
    wz.oneMany('Meal', 'extras', 'Extra', null)
]
const auth = wz.auth({secret: config.get('secret')}, User)
app.use(wz.router([
  wz.login(config.get('secret'), User, ['name', 'password'], {uri: '/auth'})
]))

app.use(wz.api(resources, relations, {
    _all: {
        add: {actions: [wz.beforeQuery(auth)]},
        edit: {actions: [wz.beforeQuery(auth)]},
        destroy: {actions: [wz.beforeQuery(auth)]}
    }
}))

app.use(pictures)
app.use(users)

app.use((err, req, res, next) => {
    let error = {}, status = 500
    switch (err.name) {
        case 'ValidationError':
            status = 400
            for(let name in err.errors)
                error[name] = err.errors[name].message
            error._error = 'Erreur de validation'
        break
        case 'MongoError':
            status = 400
            error._error = 'Erreur de validation'
        break

        case 'UnauthorizedError':
            status = 401
            error._error = 'Acces Refuse'
        break
        case 'WrongCredentialsError':
            status = 401
            error._error = 'Nom ou mot de passe incorrect'
            error.name = true
            error.password = true
        break
        default:
            status = 500
            error._error = 'Unknkown Error'
    }
    console.error(err)
    res.status(status).json(error)
})

/*
app.resource(Category, {
    json: Category.json,
    children: [{
        field: 'meals',
        Model: Meal,
        json: Meal.json,
        reference: 'category'
    }],
    edit: {
        beforeQuery: req => {
            req.body.meals = ids(req.body.meals)
        } 
    }
})
app.resource(Meal, {
    json: Meal.json,
    children: [{
        field: 'category',
        route: false
    }, {
        field: 'extras',
        Model: Extra,
        json: Extra.json
    }],
    edit: {
        beforeQuery: req => {
            req.body.extras = ids(req.body.extras)
            req.body.category = id(req.body.category)
        } 
    }
})
app.resource(Extra, {json: Extra.json})
app.resource(Info, {json: Info.json})
app.resource(Slide, {json: Slide.json})


app.handleErrors()
*/

app.listen(3001)

module.exports = app
