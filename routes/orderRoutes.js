const {addOrder,getAllOrders,getOrderById, createCheckoutSession, getpaymentstatus} = require('../controllers/orderController')
const { authenticateToken } = require('../middlewares/authMiddleware')

const router = require('express').Router()


router.post('/',authenticateToken,addOrder)
router.post('/create-checkout-session',authenticateToken,createCheckoutSession)
router.get('/', authenticateToken,getAllOrders)
router.get('/payment-status/:sessionId',getpaymentstatus)
router.get('/:id', authenticateToken, getOrderById)



module.exports = router