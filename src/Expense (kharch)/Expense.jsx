import React, { useState } from "react";
import "./Expense.css";

const Expense = () => {
    const [formData, setFormData] = useState({
        date: "",
        firm: "",
        expenseType: "",
        description: "",
        amount: "",
        paidBy: "Cash",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Expense Entry Added");
        
        // Reset form after submission
        setFormData({
            date: "",
            firm: "",
            expenseType: "",
            description: "",
            amount: "",
            paidBy: "Cash",
        });
    };

    const firmOptions = [
        { value: "", label: "-- Select Firm --" },
        { value: "Bhavani", label: "Bhavani Ginning" },
        { value: "Shree", label: "Shree Cotton" },
        { value: "Patel Ginning", label: "Patel Ginning" },
        { value: "Mahadev Cotton", label: "Mahadev Cotton" },
        { value: "Om Textile", label: "Om Textile" }
    ];

    const expenseTypeOptions = [
        { value: "", label: "Select Expense Type" },
        { value: "Diesel", label: "Diesel" },
        { value: "Spare Parts", label: "Spare Parts" },
        { value: "Tyre", label: "Tyre" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Electricity", label: "Electricity" },
        { value: "Other", label: "Other" }
    ];

    const paymentOptions = [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
        { value: "Bank", label: "Bank" }
    ];

    return (
        <div className="expense-container">
            <div className="expense-header">
                <h1>Expense (Kharch) Entry</h1>
                <p className="subtitle">Record your business expenses</p>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
                {/* Date */}
                <div className="form-group">
                    <label>Date</label>
                    <input 
                        type="date" 
                        name="date" 
                        value={formData.date}
                        onChange={handleChange} 
                        required 
                        className="form-input"
                    />
                </div>

                {/* Firm Selection */}
                <div className="form-group">
                    <label>Select Firm</label>
                    <select 
                        name="firm" 
                        value={formData.firm}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        {firmOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Expense Type */}
                <div className="form-group">
                    <label>Expense Type</label>
                    <select 
                        name="expenseType" 
                        value={formData.expenseType}
                        onChange={handleChange} 
                        className="form-select"
                        required
                    >
                        {expenseTypeOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Enter expense details (optional)"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-row">
                    {/* Amount */}
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input 
                            type="number" 
                            name="amount" 
                            value={formData.amount}
                            onChange={handleChange} 
                            required 
                            className="form-input"
                            placeholder="Enter amount"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="form-group">
                        <label>Paid By</label>
                        <select 
                            name="paidBy" 
                            value={formData.paidBy}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {paymentOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Total Amount Display */}
                <div className="total-box-expense">
                    <div className="total-content">
                        <span className="total-label">Expense Amount:</span>
                        <span className="total-value">₹ {Number(formData.amount || 0).toLocaleString()}</span>
                    </div>
                </div>

                <button type="submit" className="save-btn-expense">
                    Save Expense Entry
                </button>
            </form>
        </div>
    );
};

export default Expense;