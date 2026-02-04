import React, { useState } from "react";
import "./PakkaMaal.css";

const PakkaMaal = () => {
    const suppliers = [
        "Ram Cotton",
        "Shyam Traders",
        "Patel Supplier",
        "Royal Cotton",
        "Mahesh Cotton Works",
        "Gujarat Cotton"
    ];

    const [formData, setFormData] = useState({
        date: "",
        supplier: "",
        quantity: "",
        totalAmount: "", // Changed from rate
        paymentType: "Cash"
    });

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredSuppliers = suppliers.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    // Single handleChange function for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSupplierSelect = (name) => {
        setFormData({ ...formData, supplier: name });
        setSearch("");
        setIsOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ ...formData });
        alert("Pakka Maal Entry Added");

        // Reset form
        setFormData({
            date: "",
            supplier: "",
            quantity: "",
            totalAmount: "",
            paymentType: "Cash"
        });
        setSearch("");
        setIsOpen(false);
    };

    return (
        <div className="pakka-container">
            <div className="pakka-header">
                <h1>Pakka Maal Purchase</h1>
                <p className="subtitle">Add processed cotton purchase entry</p>
            </div>

            <form className="pakka-form" onSubmit={handleSubmit}>
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

                {/* Supplier Searchable Dropdown */}
                <div className="form-group dropdown">
                    <label>Supplier Name</label>
                    <div className="dropdown-input" onClick={() => setIsOpen(!isOpen)}>
                        <input
                            type="text"
                            placeholder="Select or search supplier"
                            value={isOpen ? search : formData.supplier}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsOpen(true);
                            }}
                            onFocus={() => setIsOpen(true)}
                            className="dropdown-search"
                            required
                        />
                        <span className="arrow">▼</span>
                    </div>

                    {isOpen && (
                        <ul className="dropdown-list">
                            {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map((name, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSupplierSelect(name)}
                                    >
                                        {search ? name.split(new RegExp(`(${search})`, "gi")).map(
                                            (part, index) =>
                                                part.toLowerCase() === search.toLowerCase() ? (
                                                    <strong key={index} className="highlight">
                                                        {part}
                                                    </strong>
                                                ) : (
                                                    part
                                                )
                                        ) : name}
                                    </li>
                                ))
                            ) : (
                                <li className="no-data">No supplier found</li>
                            )}
                        </ul>
                    )}
                </div>

                <div className="form-row">
                    {/* Quantity */}
                    <div className="form-group">
                        <label>Quantity (Kg)</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter quantity"
                        />
                    </div>

                    {/* Total Amount - Replaced Rate field */}
                    <div className="form-group">
                        <label>Total Amount (₹)</label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter total amount"
                        />
                    </div>
                </div>

                {/* Payment */}
                <div className="form-group">
                    <label>Payment Type</label>
                    <select
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>

                <div className="total-box-paaka">
                    <span className="total-label">Total Amount:</span>
                    <span className="total-value">₹ {Number(formData.totalAmount || 0).toLocaleString()}</span>
                </div>

                <button type="submit" className="save-btn-pakaa">
                    Save Entry
                </button>
            </form>
        </div>
    );
};

export default PakkaMaal;