import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, image: null });

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity < 0) return;
    setItems([...items, newItem]);
    setNewItem({ name: "", quantity: 0, image: null });
  };

  const handleStockChange = (index, delta) => {
    const updated = [...items];
    updated[index].quantity += delta;
    setItems(updated);
  };

  const handleExport = () => {
    const data = items.map((item) => ({
      "ชื่อสินค้า": item.name,
      "จำนวน": item.quantity
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, "stock_data.xlsx");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewItem({ ...newItem, image: URL.createObjectURL(file) });
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h1>ระบบจัดการสต๊อกสินค้า</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="จำนวน"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={handleAddItem}>เพิ่มสินค้า</button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
          {item.image && <img src={item.image} alt="รูปสินค้า" style={{ height: 50 }} />}
          <div>ชื่อ: {item.name}</div>
          <div>จำนวน: {item.quantity}</div>
          <button onClick={() => handleStockChange(idx, -1)}>-1</button>
          <button onClick={() => handleStockChange(idx, 1)}>+1</button>
        </div>
      ))}

      <button onClick={handleExport}>ส่งออก Excel</button>
    </div>
  );
}

export default App;