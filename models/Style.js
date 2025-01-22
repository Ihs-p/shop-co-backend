const mongoose = require("mongoose");

const StyleSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
});

module.exports = mongoose.model("Style", StyleSchema);
