const mongoose = require("mongoose");
require("./Product"); // Ensure Product model is loaded


const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, maxlength: 255 },
  name:{type:String, required: true},
  email:{type:String, required: true},
  phone:{type:Number, required: true},
  address:{
    country:{type:String, required: true},
    state:{type:String, required: true},
    city:{type:String, required: true},
    zip:{type:Number, required: true}
  
  },

  products: [{
    product:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Products',
    },
    quantity:{
        type:Number,
        required:true
        },

    color:{
        type:String,
    },
    size:{
        type:String,
    }
}
],
date: {
    type: Date, // Correct type for storing dates
    required: true,
    default: Date.now, // Pass the function reference without invoking
  },
  status:{
    type:String,
    default:"pending"
  },
  total: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
     default:"pending"},
  sessionId:{
    type:String,
  } 
 
}  
); 

module.exports = mongoose.model("orders", OrderSchema);