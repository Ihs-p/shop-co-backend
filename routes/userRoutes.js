const router = require("express").Router()
const { signUp, login, googleLogin } = require("../controllers/userController")



router.post('/signup',signUp)
router.post('/login',login)
router.get('/google',googleLogin)


module.exports = router