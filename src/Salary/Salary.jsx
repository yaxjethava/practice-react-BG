import React, { useState } from "react";
import "./Salary.css";

const Salary = () => {
    // List of workers (you can fetch this from an API or database)
    const workers = [
        "John Doe",
        "Jane Smith",
        "Robert Johnson",
        "Michael Williams",
        "Sarah Brown",
        "David Jones",
        "Lisa Davis",
        "Paul Miller",
        "Mary Wilson",
        "James Taylor"
    ];

    const [formData, setFormData] = useState({
        date: "",
        workerName: "",
        workType: "",
        baseSalary: "",
        totalLeaves: "",
        perLeaveDeduction: "",
        paymentMode: "Cash",
    });

    // Dropdown state variables
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchWorker, setSearchWorker] = useState("");

    // Filter workers based on search
    const filteredWorkers = workers.filter((name) =>
        name.toLowerCase().includes(searchWorker.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle dropdown click for worker selection
    const handleWorkerSelect = (name) => {
        setFormData({ ...formData, workerName: name });
        setSearchWorker("");
        setIsDropdownOpen(false);
    };

    // 🔢 Calculations
    const totalDeduction =
        Number(formData.totalLeaves || 0) *
        Number(formData.perLeaveDeduction || 0);

    const finalSalary =
        Number(formData.baseSalary || 0) - totalDeduction;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            ...formData,
            totalDeduction,
            finalSalary,
        });
        alert("Salary Entry Added");

        // Reset form
        setFormData({
            date: "",
            workerName: "",
            workType: "",
            baseSalary: "",
            totalLeaves: "",
            perLeaveDeduction: "",
            paymentMode: "Cash",
        });
        setSearchWorker("");
    };

    const paymentOptions = [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
        { value: "Bank", label: "Bank" }
    ];

    return (
        <div className="salary-page">
            <div className="salary-header">
                <h1>Salary Entry</h1>
                <p className="salary-subtitle">Record worker salary payments</p>
            </div>

            <form className="salary-card" onSubmit={handleSubmit}>
                {/* Date */}
                <div className="salary-field">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="salary-input"
                    />
                </div>

                {/* Searchable Dropdown for Worker Name */}
                <div className="salary-field salary-dropdown">
                    <label>Worker Name</label>
                    <div
                        className="salary-dropdown-control"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <input
                            type="text"
                            placeholder="Select or search worker"
                            value={isDropdownOpen ? searchWorker : formData.workerName}
                            onChange={(e) => {
                                setSearchWorker(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            required
                            className="salary-dropdown-input"
                        />
                        <span className="salary-dropdown-arrow">▼</span>
                    </div>

                    {isDropdownOpen && (
                        <ul className="salary-dropdown-menu">
                            {filteredWorkers.length > 0 ? (
                                filteredWorkers.map((name, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleWorkerSelect(name)}
                                        className="salary-dropdown-item"
                                    >
                                        {searchWorker ? name.split(new RegExp(`(${searchWorker})`, "gi")).map((part, index) =>
                                            part.toLowerCase() === searchWorker.toLowerCase() ? (
                                                <strong key={index} className="salary-highlight">
                                                    {part}
                                                </strong>
                                            ) : (
                                                part
                                            )
                                        ) : name}
                                    </li>
                                ))
                            ) : (
                                <li className="salary-no-results">No worker found</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Work Type - Changed from dropdown to text input */}
                <div className="salary-field">
                    <label>Work Type</label>
                    <input
                        type="text"
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        className="salary-input"
                        placeholder="Enter work type (e.g., Machine, Loading, etc.)"
                        required
                    />
                </div>

                {/* Base Salary */}
                <div className="salary-field">
                    <label>Base Salary (₹)</label>
                    <input
                        type="number"
                        name="baseSalary"
                        value={formData.baseSalary}
                        onChange={handleChange}
                        required
                        className="salary-input"
                        placeholder="Enter base salary"
                    />
                </div>

                <div className="salary-row">
                    <div className="salary-field">
                        <label>Total Leaves</label>
                        <input
                            type="number"
                            name="totalLeaves"
                            value={formData.totalLeaves}
                            onChange={handleChange}
                            className="salary-input"
                            placeholder="Enter total leaves"
                        />
                    </div>

                    <div className="salary-field">
                        <label>Per Leave Deduction (₹)</label>
                        <input
                            type="number"
                            name="perLeaveDeduction"
                            value={formData.perLeaveDeduction}
                            onChange={handleChange}
                            className="salary-input"
                            placeholder="Enter deduction per leave"
                        />
                    </div>
                </div>

                {/* Payment Mode */}
                <div className="salary-field">
                    <label>Payment Mode</label>
                    <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleChange}
                        className="salary-select"
                    >
                        {paymentOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Salary Summary */}
                <div className="salary-summary">
                    <div className="salary-summary-row">
                        <span className="salary-summary-label">Total Deduction:</span>
                        <span className="salary-summary-deduction">₹ {totalDeduction.toLocaleString()}</span>
                    </div>
                    <div className="salary-summary-row">
                        <span className="salary-summary-label">Final Payable Salary:</span>
                        <span className="salary-summary-final">₹ {finalSalary > 0 ? finalSalary.toLocaleString() : 0}</span>
                    </div>
                </div>

                <button type="submit" className="salary-submit-btn">
                    Save Salary Entry
                </button>
            </form>
        </div>
    );
};

export default Salary;