import React, { useState, useEffect } from "react";
import styles from "./AddExpenseForm.module.css";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];
const INCOME_CATEGORIES = [
  "Salary",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

export default function AddExpenseForm({ onAdd, initialData, onCancel }) {
  const isEdit = !!initialData;
  const [type, setType] = useState(initialData?.type || "expense");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(
    initialData?.category && (type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).includes(initialData.category)
      ? initialData.category
      : (type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
  );
  const [customCategory, setCustomCategory] = useState(
    initialData?.category && ![...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].includes(initialData.category)
      ? initialData.category
      : ""
  );
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : ""
  );

  useEffect(() => {
    if (isEdit) {
      setType(initialData.type);
      setAmount(initialData.amount?.toString() || "");
      setDescription(initialData.description || "");
      setCategory(
        initialData.category && (initialData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).includes(initialData.category)
          ? initialData.category
          : (initialData.type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
      );
      setCustomCategory(
        initialData.category && ![...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].includes(initialData.category)
          ? initialData.category
          : ""
      );
      setDate(
        initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : ""
      );
    }
  }, [initialData, isEdit]);

  useEffect(() => {
    // Reset category when type changes
    setCategory(type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setCustomCategory("");
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return alert("Amount is required");
    let finalCategory = category === "Other" ? customCategory : category;
    if (!finalCategory) return alert("Category is required");
    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category: finalCategory,
      date: date || new Date().toISOString(),
    });
    if (!isEdit) {
      setAmount("");
      setDescription("");
      setCategory(type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
      setCustomCategory("");
      setDate("");
    }
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      {/* Row 1: Type, Amount, Description */}
      <div>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'none' }}>Type</span>
          <select value={type} onChange={e => setType(e.target.value)} className={styles.field}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
      </div>
      <div>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'none' }}>Amount</span>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className={styles.field}
          />
        </label>
      </div>
      <div>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'none' }}>Description</span>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={styles.field}
          />
        </label>
      </div>
      {/* Row 2: Category, Date, Button(s) */}
      <div>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'none' }}>Category</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={styles.field}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        {category === "Other" && (
          <label style={{ width: '100%', marginTop: 8 }}>
            <span style={{ display: 'none' }}>Custom Category</span>
            <input
              type="text"
              placeholder="Custom Category"
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              className={styles.field}
            />
          </label>
        )}
      </div>
      <div>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'none' }}>Date</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className={styles.field}
          />
        </label>
      </div>
      <div className={styles.btnRow}>
        <button type="submit" className={styles.btn + ' ' + styles.btnPrimary}>{isEdit ? "Update" : "Add"}</button>
        {isEdit && (
          <button type="button" className={styles.btn + ' ' + styles.btnSecondary} onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
} 