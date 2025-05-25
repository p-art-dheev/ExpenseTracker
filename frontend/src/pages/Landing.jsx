import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'error' or 'success'
  const navigate = useNavigate();

  const handleAuth = async () => {
    setMessage("");
    setMessageType("");
    if (isLogin) {
      // Login logic
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        setMessageType("success");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      } catch (err) {
        setMessageType("error");
        setMessage(err.response?.data?.msg || "Login failed");
      }
    } else {
      // Signup logic
      if (!name.trim()) {
        setMessageType("error");
        setMessage("Name is required");
        return;
      }
      if (password !== confirmPassword) {
        setMessageType("error");
        setMessage("Passwords do not match");
        return;
      }
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, { name, email, password });
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessageType("success");
        setMessage("Signup successful! Please login.");
      } catch (err) {
        setMessageType("error");
        setMessage(err.response?.data?.msg || "Signup failed");
      }
    }
  };

  return (
    <div className={styles.landingBg}>
      <div className={styles.title}>Expense Tracker</div>
      <div className={styles.card}>
        <h2 className={styles.heading}>{isLogin ? "Login" : "Sign Up"}</h2>
        <p className={styles.subheading}>{isLogin ? "Welcome back! Please login to continue." : "Create a new account to track your expenses and income."}</p>
        {message && (
          <div className={messageType === "error" ? styles.messageError : styles.messageSuccess}>
            {message}
          </div>
        )}
        <form className={styles.form} onSubmit={e => { e.preventDefault(); handleAuth(); }}>
          {!isLogin && (
            <input
              className={styles.input}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          {!isLogin && (
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}
          <button className={styles.button} type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className={styles.switchText}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button className={styles.switchBtn} onClick={() => { setIsLogin(false); setMessage(""); }}>
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className={styles.switchBtn} onClick={() => { setIsLogin(true); setMessage(""); }}>
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 