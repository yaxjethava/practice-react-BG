import React, { useState } from "react";
import "./Sales.css";

const customersList = [
    "Rahul Traders",
    "Shree Cotton Mill",
    "Patel Textiles",
    "Om Fabrics",
    "Mahadev Exports",
    "Krishna Cotton"
];

const Sales = () => {
    const [formData, setFormData] = useState({
        date: "",
        customerName: "",
        cottonType: "",
        quantity: "",
        rate: "",
        receivedAmount: "",
        paymentMode: "Cash",
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchCustomer, setSearchCustomer] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const filteredCustomers = customersList.filter((cust) =>
        cust.toLowerCase().includes(searchCustomer.toLowerCase())
    );

    const handleCustomerSelect = (name) => {
        setFormData({ ...formData, customerName: name });
        setSearchCustomer("");
        setIsDropdownOpen(false);
    };

    const totalAmount = Number(formData.quantity) * Number(formData.rate);
    const pendingAmount = totalAmount - Number(formData.receivedAmount || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ ...formData, totalAmount, pendingAmount });
        alert("Sales Entry Added");

        // Reset form
        setFormData({
            date: "",
            customerName: "",
            cottonType: "",
            quantity: "",
            rate: "",
            receivedAmount: "",
            paymentMode: "Cash",
        });
        setSearchCustomer("");
    };

    return (
        <div className="sales-page">
            <div className="sales-header">
                <h1>Sales (Vechaan) Entry</h1>
                <p className="sales-subtitle">Record your cotton sales transactions</p>
            </div>

            <form className="sales-card" onSubmit={handleSubmit}>
                {/* Date */}
                <div className="sales-field">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="sales-input"
                    />
                </div>

                {/* Searchable Dropdown for Customer Name */}
                <div className="sales-field sales-dropdown">
                    <label>Customer Name</label>
                    <div
                        className="sales-dropdown-control"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <input
                            type="text"
                            placeholder="Select or search customer"
                            value={isDropdownOpen ? searchCustomer : formData.customerName}
                            onChange={(e) => {
                                setSearchCustomer(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            required
                            className="sales-dropdown-input"
                        />
                        <span className="sales-dropdown-arrow">▼</span>
                    </div>

                    {isDropdownOpen && (
                        <ul className="sales-dropdown-menu">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cust, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleCustomerSelect(cust)}
                                        className="sales-dropdown-item"
                                    >
                                        {searchCustomer ? cust.split(new RegExp(`(${searchCustomer})`, "gi")).map((part, index) =>
                                            part.toLowerCase() === searchCustomer.toLowerCase() ? (
                                                <strong key={index} className="sales-highlight">
                                                    {part}
                                                </strong>
                                            ) : (
                                                part
                                            )
                                        ) : cust}
                                    </li>
                                ))
                            ) : (
                                <li className="sales-no-results">No customer found</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Cotton Type */}
                <div className="sales-field">
                    <label>Cotton Type / Quality</label>
                    <input
                        type="text"
                        name="cottonType"
                        placeholder="Ex: Long Staple, Medium, Superior"
                        value={formData.cottonType}
                        onChange={handleChange}
                        className="sales-input"
                    />
                </div>

                <div className="sales-row">
                    <div className="sales-field">
                        <label>Quantity (Kg)</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="sales-input"
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div className="sales-field">
                        <label>Rate (₹)</label>
                        <input
                            type="number"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            required
                            className="sales-input"
                            placeholder="Enter rate per kg"
                        />
                    </div>
                </div>

                <div className="sales-row">
                    <div className="sales-field">
                        <label>Received Amount (₹)</label>
                        <input
                            type="number"
                            name="receivedAmount"
                            value={formData.receivedAmount}
                            onChange={handleChange}
                            className="sales-input"
                            placeholder="Enter received amount"
                        />
                    </div>

                    <div className="sales-field">
                        <label>Payment Mode</label>
                        <select
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={handleChange}
                            className="sales-select"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                            <option value="Online">Online</option>
                            <option value="Credit">Credit</option>
                        </select>
                    </div>
                </div>

                {/* Summary Box */}
                <div className="sales-summary">
                    <div className="sales-summary-item">
                        <span className="sales-summary-label">Total Amount:</span>
                        <span className="sales-summary-total">₹ {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="sales-summary-item">
                        <span className="sales-summary-label">Pending Amount:</span>
                        <span className={`sales-summary-pending ${pendingAmount > 0 ? 'has-pending' : 'no-pending'}`}>
                            ₹ {pendingAmount > 0 ? pendingAmount.toLocaleString() : 0}
                        </span>
                    </div>
                </div>

                <button type="submit" className="sales-submit-btn">
                    Save Sale Entry
                </button>
            </form>
        </div>
    );
};

export default Sales;