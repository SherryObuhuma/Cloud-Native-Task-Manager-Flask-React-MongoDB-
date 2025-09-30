import React, { useEffect, useState } from "react";

// Point to Flask backend on port 5001
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  // Fetch items from backend
  useEffect(() => {
    fetch(`${API_BASE}/items`)
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  // Add new item
  const addItem = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "" }),
      });
      if (!res.ok) throw new Error(`Failed to add item: ${res.status}`);
      const newItem = await res.json();
      setItems([...items, newItem]);
      setName("");
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
      setItems(items.filter((it) => it._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333", textAlign: "center" }}>🌟 Item Manager 🌟</h1>

      <form
        onSubmit={addItem}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "1",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ➕ Add
        </button>
      </form>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {items.map((it) => (
          <li
            key={it._id}
            style={{
              background: "#fff",
              margin: "10px 0",
              padding: "10px 15px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              {it.name}
            </span>
            <button
              onClick={() => deleteItem(it._id)}
              style={{
                background: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
