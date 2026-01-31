import React, { useState } from "react";
import "./KachaMaal.css";

const KachaMaalAdd = () => {
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
        receiptNo: "",
        supplier: "",
        quantity: "",
        rate: "",
        paymentType: "Cash"
    });

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredSuppliers = suppliers.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    const totalAmount = Number(formData.quantity || 0) * Number(formData.rate || 0);

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
        console.log({ ...formData, totalAmount });
        alert("Kacha Maal Entry Added");
    };

    return (
        <div className="kacha-container">
            <div className="kacha-header">
                <h1>Kacha Maal Purchase</h1>
                <p className="subtitle">Add raw cotton purchase entry</p>
            </div>

            <form className="kacha-form" onSubmit={handleSubmit}>
                <div className="form-row">
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

                    {/* Receipt Number */}
                    <div className="form-group">
                        <label>Receipt No</label>
                        <input
                            type="number"
                            name="receiptNo"
                            value={formData.receiptNo}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter receipt number"
                        />
                    </div>
                </div>

                {/* Searchable Dropdown */}
                <div className="form-group dropdown">
                    <label>Supplier Name</label>
                    <div
                        className="dropdown-input"
                        onClick={() => setIsOpen(!isOpen)}
                    >
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
                                        {search ? name.split(new RegExp(`(${search})`, "gi")).map((part, index) =>
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

                    {/* Rate */}
                    <div className="form-group">
                        <label>Rate (₹)</label>
                        <input
                            type="number"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter rate per kg"
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

                <div className="total-box-kacha">
                    <span className="total-label">Total Amount:</span>
                    <span className="total-value">₹ {totalAmount.toLocaleString()}</span>
                </div>

                <button type="submit" className="save-btn-kacha">
                    Save Entry
                </button>
            </form>
        </div>
    );
};

export default KachaMaalAdd;