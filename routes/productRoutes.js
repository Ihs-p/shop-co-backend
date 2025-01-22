const router = require('express').Router()

const {getAllProducts,getProductById, addReview} = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', getAllProducts)
router.get('/:id',getProductById )
router.post('/add-review/:productId', authenticateToken,addReview )



module.exports= router;