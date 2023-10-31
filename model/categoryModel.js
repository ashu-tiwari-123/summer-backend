const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // second: {
  //   _id: String,
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  name: {
    type: String,
    unique:true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
});

//Export the model
module.exports = mongoose.model("Category", categorySchema);
