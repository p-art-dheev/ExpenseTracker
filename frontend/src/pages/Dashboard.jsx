import { useEffect, useState } from "react";
import axios from "axios";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import styles from "./Dashboard.module.css";

function getSummary(items) {
  let totalIncome = 0;
  let totalExpense = 0;
  items.forEach((item) => {
    if (item.type === "income") totalIncome += item.amount;
    else if (item.type === "expense") totalExpense += item.amount;
  });
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export default function Dashboard() {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
      } catch (err) {
        setName("");
      }
    };
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/expense`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchItems();
  }, [token]);

  const handleAdd = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expense`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([res.data, ...items]);
    } catch (err) {
      alert("Failed to add record");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleUpdate = async (data) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/expense/${editItem._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.map((item) => (item._id === editItem._id ? res.data : item)));
      setEditItem(null);
    } catch (err) {
      alert("Failed to update record");
    }
  };

  const handleCancelEdit = () => {
    setEditItem(null);
  };

  const summary = getSummary(items);

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.topLeftHeading}>
        <h2 className={styles.heading}>{name ? `Hi, ${name}` : "Welcome to Dashboard!"}</h2>
      </div>
    
      <div className={styles.summarySection}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <strong>Total Income:</strong>
            <div className={styles.summaryValue + ' ' + styles.income}>₹{summary.totalIncome.toFixed(2)}</div>
          </div>
          <div className={styles.summaryCard + ' ' + styles.expense}>
            <strong>Total Expenses:</strong>
            <div className={styles.summaryValue + ' ' + styles.expense}>₹{summary.totalExpense.toFixed(2)}</div>
          </div>
          <div className={styles.summaryCard + ' ' + styles.net}>
            <strong>Net Savings:</strong>
            <div className={styles.summaryValue + ' ' + (summary.balance >= 0 ? styles.netPositive : styles.netNegative)}>
              ₹{summary.balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section900}>
        {editItem ? (
          <AddExpenseForm
            onAdd={handleUpdate}
            initialData={editItem}
            onCancel={handleCancelEdit}
          />
        ) : (
          <AddExpenseForm onAdd={handleAdd} />
        )}
      </div>
      <div className={styles.section900}>
        <h3 className={styles.tableHeading}>History</h3>
        {loading ? <p>Loading...</p> : <ExpenseList items={items} onDelete={handleDelete} onEdit={handleEdit} />}
      </div>
    </div>
  );
}
  