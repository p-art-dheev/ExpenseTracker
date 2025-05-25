const router = require("express").Router();
const Expense = require("../models/Expense");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Auth middleware (copy from auth.js)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Add expense/income
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const expense = new Expense({
      user: req.user.id,
      type,
      amount,
      description,
      category,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all expenses/income for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete expense/income
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update expense/income
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { type, amount, description, category, date },
      { new: true }
    );
    if (!expense) return res.status(404).json({ msg: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router; 