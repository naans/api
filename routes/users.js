const router = require('express').Router()
    , User   = require('../resources/User')

router.put('/me', (req, res) => {
    if (req.user.name != req.body.name)
        return res.status(400).json({
            _error: 'Erreur de validation',
            name: 'Le nom d\'utilisateur est incorrect'
        })
    if (req.user.password != req.body.password)
        return res.status(400).json({
            _error: 'Erreur de validation',
            password: 'Le mot de passe est incorrect'
        })
    if (!req.body.newPassword || req.body.newPassword.length < 5)
        return res.status(400).json({
            _error: 'Erreur de validation',
            newPassword: 'Le mot de passe doit contenir au moins 5 caracteres'
        })

    User.findOneAndUpdate({_id: req.user._id}, {password: req.body.newPassword}, {new: true, runValidators: true})
    .then(() => res.json({}))
    .catch(err => {
        res.status(500).json({
            _error: 'Erreur lors de la mise a jour du mot de passe!'
        })
        console.error(err)
    })
})

module.exports = router
