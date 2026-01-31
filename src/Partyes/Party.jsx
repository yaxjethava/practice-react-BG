import React, { useState, useEffect } from "react";
import "./Party.css";

const Party = () => {
    // Sample initial data for demonstration
    const initialPartyList = [
        { id: 1, name: "John Doe", type: "Worker" },
        { id: 2, name: "Ravi Traders", type: "Supplier" },
        { id: 3, name: "Shree Cotton", type: "Customer" },
        { id: 4, name: "Jane Smith", type: "Worker" },
        { id: 5, name: "Patel Supplier", type: "Supplier" },
        { id: 6, name: "Om Fabrics", type: "Customer" },
        { id: 7, name: "Robert Johnson", type: "Worker" },
        { id: 8, name: "Royal Cotton", type: "Supplier" },
        { id: 9, name: "Mahadev Exports", type: "Customer" },
        { id: 10, name: "Michael Williams", type: "Worker" },
    ];

    const [partyList, setPartyList] = useState(initialPartyList);
    const [filteredParties, setFilteredParties] = useState(initialPartyList);
    const [formData, setFormData] = useState({
        name: "",
        type: ""
    });

    // Filter states
    const [nameFilter, setNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // all, Worker, Supplier, Customer

    // Statistics
    const [totalParties, setTotalParties] = useState(0);
    const [workerCount, setWorkerCount] = useState(0);
    const [supplierCount, setSupplierCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);

    // Apply filters
    const applyFilters = () => {
        let result = [...partyList];

        // Filter by name
        if (nameFilter.trim()) {
            result = result.filter(party =>
                party.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        // Filter by type
        if (typeFilter !== "all") {
            result = result.filter(party => party.type === typeFilter);
        }

        setFilteredParties(result);
    };

    // Calculate statistics
    const calculateStatistics = (data) => {
        setTotalParties(data.length);
        setWorkerCount(data.filter(party => party.type === "Worker").length);
        setSupplierCount(data.filter(party => party.type === "Supplier").length);
        setCustomerCount(data.filter(party => party.type === "Customer").length);
    };

    // Apply filters when filter states change
    useEffect(() => {
        applyFilters();
    }, [nameFilter, typeFilter, partyList]);

    // Calculate statistics when filtered parties change
    useEffect(() => {
        calculateStatistics(filteredParties);
    }, [filteredParties]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.type) {
            alert("Please fill all fields");
            return;
        }

        // Check if party already exists
        const existingParty = partyList.find(
            party => party.name.toLowerCase() === formData.name.toLowerCase() && party.type === formData.type
        );

        if (existingParty) {
            alert("Party already exists!");
            return;
        }

        // Generate unique ID
        const newParty = {
            id: partyList.length > 0 ? Math.max(...partyList.map(p => p.id)) + 1 : 1,
            name: formData.name,
            type: formData.type
        };

        setPartyList([...partyList, newParty]);
        setFormData({ name: "", type: "" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this party?")) {
            setPartyList(partyList.filter(party => party.id !== id));
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setNameFilter("");
        setTypeFilter("all");
    };

    // Clear name filter
    const clearNameFilter = () => setNameFilter("");

    return (
        <div className="party-page">
            <h1>Party Master</h1>


            {/* Add Party Form */}
            <div className="party-form-container">
                <h3>Add New Party</h3>
                <form className="party-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Party Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Select Type</option>
                            <option value="Worker">Worker</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">Add Party</button>
                </form>
            </div>

            {/* Statistics Cards */}
            <div className="party-stats">
                <div className="stat-card">
                    <div className="stat-label">Total Parties</div>
                    <div className="stat-value">{totalParties}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Workers</div>
                    <div className="stat-value worker-stat">{workerCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Suppliers</div>
                    <div className="stat-value supplier-stat">{supplierCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Customers</div>
                    <div className="stat-value customer-stat">{customerCount}</div>
                </div>
            </div>


            {/* Filters Section */}
            <div className="filters-section">
                <h3>Filter Parties</h3>
                <div className="filter-row">
                    <div className="filter-item">
                        <label>Search by Name:</label>
                        <div className="filter-input-group">
                            <input
                                type="text"
                                placeholder="Enter party name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="filter-input"
                            />
                            {nameFilter && (
                                <button
                                    className="clear-filter-btn"
                                    onClick={clearNameFilter}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                    {/* <div className="filter-item"></div> */}
                    <div className="filter-item">
                        <label>Filter by Type:</label>
                        <div className="filter-buttons">
                            <button
                                className={`type-filter-btn all ${typeFilter === "all" ? "active" : ""}`}
                                onClick={() => setTypeFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`type-filter-btn worker ${typeFilter === "Worker" ? "active" : ""}`}
                                onClick={() => setTypeFilter("Worker")}
                            >
                                Workers
                            </button>
                            <button
                                className={`type-filter-btn supplier ${typeFilter === "Supplier" ? "active" : ""}`}
                                onClick={() => setTypeFilter("Supplier")}
                            >
                                Suppliers
                            </button>
                            <button
                                className={`type-filter-btn customer ${typeFilter === "Customer" ? "active" : ""}`}
                                onClick={() => setTypeFilter("Customer")}
                            >
                                Customers
                            </button>
                        </div>
                    </div>
                </div>

                <div className="filter-actions">
                    <button
                        className="clear-all-btn"
                        onClick={clearFilters}
                    >
                        Clear All Filters
                    </button>
                    <div className="filter-info">
                        Showing {filteredParties.length} of {partyList.length} parties
                    </div>
                </div>
            </div>

            {/* Party List */}
            <div className="party-list-container">
                <div className="table-header">
                    <h3>Party List</h3>

                </div>

                <table className="party-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredParties.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="no-data">
                                    No parties found matching the filters
                                </td>
                            </tr>
                        ) : (
                            filteredParties.map((party) => (
                                <tr key={party.id}>
                                    <td className="id-cell">#{party.id}</td>
                                    <td className="name-cell">{party.name}</td>
                                    <td className="type-cell">
                                        <span className={`type-badge ${party.type.toLowerCase()}`}>
                                            {party.type}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(party.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Party;