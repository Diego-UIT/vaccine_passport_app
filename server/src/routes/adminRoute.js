const router = require('express').Router()
const tokenHandler = require('../handlers/tokenHandler')
const { adminController } = require('../controllers')

router.post('/login', adminController.login)

router.get(
    '/summary',
    tokenHandler.verifyAdminToken,
    adminController.summary
)

router.post(
    '/check-token',
    tokenHandler.verifyAdminToken,
    (req, res) => {
        res.status(200).json('Authorized')
    }
)

module.exports = router