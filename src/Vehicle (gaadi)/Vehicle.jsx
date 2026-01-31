// Vehicle.jsx
import React, { useState } from "react";
import "./Vehicle.css";

const Vehicle = () => {
  const [formData, setFormData] = useState({
    date: "",
    vehicleNo: "",
    fromLocation: "",
    toLocation: "",
    dieselCost: "",
    otherCost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const totalCost = Number(formData.dieselCost) + Number(formData.otherCost);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, totalCost });
    alert("Vehicle Entry Added");
  };

  return (
    <div className="vehicle-container">
      <h1>Vehicle (Gaadi) Entry</h1>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Vehicle Number</label>
          <input type="text" name="vehicleNo" placeholder="GJ-03-AB-1234" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>From</label>
            <input type="text" name="fromLocation" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>To</label>
            <input type="text" name="toLocation" onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Diesel Cost (₹)</label>
            <input type="number" name="dieselCost" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Other Cost (₹)</label>
            <input type="number" name="otherCost" onChange={handleChange} />
          </div>
        </div>

        <div className="total-box">Total Vehicle Cost: ₹ {totalCost || 0}</div>

        <button type="submit" className="save-btn">Save Vehicle Entry</button>
      </form>
    </div>
  );
};

export default Vehicle;
