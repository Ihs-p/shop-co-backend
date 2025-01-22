const Order = require("../models/Order");
const User = require("../models/User");
const stripe = require('stripe')(process.env.STRIPE_SECRET);





const createCheckoutSession = async (req, res) => {
  const { products,total } = req.body;



  const singleLineItem = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Total Order",
        },
        unit_amount: Math.round(total * 100), // Total amount in cents
      },
      quantity: 1,
    },
  ];


  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card',
    ],    line_items: singleLineItem,
    mode: 'payment',
    success_url: 'https://shop-co-frontend-chi.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://shop-co-frontend-chi.vercel.app/payment-failed?session_id={CHECKOUT_SESSION_ID}',
  });


  res.json({ id: session.id });
};


const getpaymentstatus = async (req, res) => {
  const { sessionId } = req.params;
  try {
    // Retrieve the Stripe session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update your database if necessary
    const paymentStatus = session.payment_status; // e.g., "paid", "unpaid", "no_payment_required"
console.log(paymentStatus)
    // Optionally update the order in the database
    const updatedOrder = await Order.findOneAndUpdate(
      { sessionId }, // Match by session ID
      { paymentStatus }, // Update with Stripe's payment status
      { new: true } // Return the updated document
    );

    // Send the status back to the client
    res.status(200).json({
      success: true,
      paymentStatus,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment status',
    });
  }
}








const getAllOrders = async (req, res) => {
console.log("jjjjjjjjjjjjjjjjjj")
  try{
    const user = await User.findById(req.user.id)
    const orders = await Order.find({user:user._id}).populate("user").populate("products").populate('products.product');
    res.status(200).json(orders);
  }
  catch(error){
    console.log(error)
    res.status(500).json({message: "Error fetching orders"});
    }

};


const getOrderById = (req, res) => {
  const id = req.params.id;
  Order.findById(id)
    .then((order) => {
      res.json(order);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const addOrder = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  const newOrder = {
    ...req.body,
    user: user._id,
  
  };

  Order.create(newOrder);


  res.status(200).json({ message: "order added successfully" });
};

module.exports = {addOrder,getAllOrders,getOrderById,createCheckoutSession,getpaymentstatus};
