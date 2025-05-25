import React from "react";
import styles from "./ExpenseList.module.css";
import deleteIcon from "../assets/delete-icon.png";
import editIcon from "../assets/edit-icon.png";

const LABELS = ["Date", "Type", "Amount", "Description", "Category", "Actions"];

function getRowClass(item) {
  if (window.matchMedia && window.matchMedia('(max-width: 700px), (orientation: portrait)').matches) {
    return item.type === 'income' ? styles.incomeCard : styles.expenseCard;
  }
  return '';
}

export default function ExpenseList({ items, onDelete, onEdit }) {
  if (!items.length) return <p>No records found.</p>;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Date</th>
          <th className={styles.th}>Type</th>
          <th className={styles.th}>Amount</th>
          <th className={styles.th}>Description</th>
          <th className={styles.th}>Category</th>
          <th className={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className={getRowClass(item)}>
            <td className={styles.td} data-label={LABELS[0]}>{new Date(item.date).toLocaleDateString()}</td>
            <td className={styles.td + ' ' + styles.tdType} data-label={LABELS[1]}>{item.type}</td>
            <td className={styles.td} data-label={LABELS[2]}>{item.amount}</td>
            <td className={styles.td} data-label={LABELS[3]}>{item.description}</td>
            <td className={styles.td} data-label={LABELS[4]}>{item.category}</td>
            <td className={styles.td + ' ' + styles.actionsCell} data-label={LABELS[5]}>
              <button title="Delete" className={styles.iconBtn} onClick={() => onDelete(item._id)}>
                <img src={deleteIcon} alt="Delete" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
              </button>
              {onEdit && (
                <button title="Edit" className={styles.iconBtn} onClick={() => onEdit(item)}>
                  <img src={editIcon} alt="Edit" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 