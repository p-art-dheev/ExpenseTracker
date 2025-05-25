const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema); 