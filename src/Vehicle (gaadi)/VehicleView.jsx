import React, { useState, useEffect } from "react";
import "./VehicleView.css";

const VehicleView = () => {
    // Sample vehicle entries data with ONLY the fields from your form
    const initialVehicles = [
        { id: 1, date: "2026-01-30", vehicleNo: "GJ-03-AB-1234", fromLocation: "Surat", toLocation: "Ahmedabad", dieselCost: 4500, otherCost: 500, totalCost: 5000 },
        { id: 2, date: "2026-01-30", vehicleNo: "GJ-05-CD-5678", fromLocation: "Vadodara", toLocation: "Mumbai", dieselCost: 6800, otherCost: 1200, totalCost: 8000 },
        { id: 3, date: "2026-01-31", vehicleNo: "GJ-03-AB-1234", fromLocation: "Ahmedabad", toLocation: "Rajkot", dieselCost: 3200, otherCost: 300, totalCost: 3500 },
        { id: 4, date: "2026-01-31", vehicleNo: "GJ-01-EF-9012", fromLocation: "Mumbai", toLocation: "Pune", dieselCost: 2800, otherCost: 400, totalCost: 3200 },
        { id: 5, date: "2026-02-01", vehicleNo: "GJ-05-CD-5678", fromLocation: "Surat", toLocation: "Vadodara", dieselCost: 2500, otherCost: 200, totalCost: 2700 },
        { id: 6, date: "2026-02-01", vehicleNo: "GJ-03-AB-1234", fromLocation: "Rajkot", toLocation: "Bhavnagar", dieselCost: 1800, otherCost: 150, totalCost: 1950 },
        { id: 7, date: "2026-02-02", vehicleNo: "GJ-01-EF-9012", fromLocation: "Pune", toLocation: "Mumbai", dieselCost: 2600, otherCost: 300, totalCost: 2900 },
        { id: 8, date: "2026-02-02", vehicleNo: "GJ-07-GH-3456", fromLocation: "Ahmedabad", toLocation: "Delhi", dieselCost: 12500, otherCost: 1500, totalCost: 14000 },
        { id: 9, date: "2026-02-03", vehicleNo: "GJ-03-AB-1234", fromLocation: "Bhavnagar", toLocation: "Surat", dieselCost: 4200, otherCost: 450, totalCost: 4650 },
        { id: 10, date: "2026-02-03", vehicleNo: "GJ-05-CD-5678", fromLocation: "Vadodara", toLocation: "Indore", dieselCost: 5500, otherCost: 600, totalCost: 6100 },
        { id: 11, date: "2026-01-28", vehicleNo: "GJ-01-EF-9012", fromLocation: "Surat", toLocation: "Nashik", dieselCost: 3800, otherCost: 400, totalCost: 4200 },
        { id: 12, date: "2026-01-25", vehicleNo: "GJ-07-GH-3456", fromLocation: "Delhi", toLocation: "Ahmedabad", dieselCost: 12000, otherCost: 1300, totalCost: 13300 },
    ];

    const [vehicles, setVehicles] = useState(initialVehicles);
    const [filteredVehicles, setFilteredVehicles] = useState(initialVehicles);

    // Filter states
    const [dateFilter, setDateFilter] = useState("all");
    const [specificDate, setSpecificDate] = useState("");

    // Text input filters (not dropdowns)
    const [vehicleNoFilter, setVehicleNoFilter] = useState("");
    const [fromLocationFilter, setFromLocationFilter] = useState("");
    const [toLocationFilter, setToLocationFilter] = useState("");

    // Statistics
    const [totalDieselCost, setTotalDieselCost] = useState(0);
    const [totalOtherCost, setTotalOtherCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [dailyCost, setDailyCost] = useState(0);
    const [weeklyCost, setWeeklyCost] = useState(0);
    const [monthlyCost, setMonthlyCost] = useState(0);

    // Filter by date range
    const filterByDate = (data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let filtered = [...data];

        if (dateFilter === "daily") {
            filtered = filtered.filter(vehicle => {
                const vehicleDate = new Date(vehicle.date);
                return vehicleDate.getTime() === today.getTime();
            });
        } else if (dateFilter === "weekly") {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            filtered = filtered.filter(vehicle => {
                const vehicleDate = new Date(vehicle.date);
                return vehicleDate >= oneWeekAgo && vehicleDate <= today;
            });
        } else if (dateFilter === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            filtered = filtered.filter(vehicle => {
                const vehicleDate = new Date(vehicle.date);
                return vehicleDate >= startOfMonth && vehicleDate <= today;
            });
        } else if (dateFilter === "specific" && specificDate) {
            filtered = filtered.filter(vehicle => vehicle.date === specificDate);
        }

        return filtered;
    };

    // Filter by vehicle number (text input)
    const filterByVehicleNo = (data) => {
        if (!vehicleNoFilter.trim()) return data;
        return data.filter(vehicle =>
            vehicle.vehicleNo.toLowerCase().includes(vehicleNoFilter.toLowerCase())
        );
    };

    // Filter by from location (text input)
    const filterByFromLocation = (data) => {
        if (!fromLocationFilter.trim()) return data;
        return data.filter(vehicle =>
            vehicle.fromLocation.toLowerCase().includes(fromLocationFilter.toLowerCase())
        );
    };

    // Filter by to location (text input)
    const filterByToLocation = (data) => {
        if (!toLocationFilter.trim()) return data;
        return data.filter(vehicle =>
            vehicle.toLocation.toLowerCase().includes(toLocationFilter.toLowerCase())
        );
    };

    // Calculate all statistics
    const calculateStatistics = (data) => {
        // Total calculations
        const diesel = data.reduce((sum, vehicle) => sum + vehicle.dieselCost, 0);
        const other = data.reduce((sum, vehicle) => sum + vehicle.otherCost, 0);
        const total = data.reduce((sum, vehicle) => sum + vehicle.totalCost, 0);

        setTotalDieselCost(diesel);
        setTotalOtherCost(other);
        setTotalCost(total);

        // Calculate daily cost (today)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const daily = data.filter(v => v.date === todayStr)
            .reduce((sum, v) => sum + v.totalCost, 0);
        setDailyCost(daily);

        // Calculate weekly cost (last 7 days)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekly = data.filter(v => {
            const vDate = new Date(v.date);
            return vDate >= oneWeekAgo && vDate <= today;
        }).reduce((sum, v) => sum + v.totalCost, 0);
        setWeeklyCost(weekly);

        // Calculate monthly cost (this month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthly = data.filter(v => {
            const vDate = new Date(v.date);
            return vDate >= startOfMonth && vDate <= today;
        }).reduce((sum, v) => sum + v.totalCost, 0);
        setMonthlyCost(monthly);
    };

    // Apply all filters
    useEffect(() => {
        let result = filterByDate(vehicles);
        result = filterByVehicleNo(result);
        result = filterByFromLocation(result);
        result = filterByToLocation(result);
        setFilteredVehicles(result);
        calculateStatistics(result);
    }, [dateFilter, specificDate, vehicleNoFilter, fromLocationFilter, toLocationFilter, vehicles]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Handle filter changes
    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
        if (filter !== "specific") {
            setSpecificDate("");
        }
    };

    const handleSpecificDateChange = (e) => {
        setSpecificDate(e.target.value);
        setDateFilter("specific");
    };

    // Clear text input filters
    const clearVehicleNoFilter = () => setVehicleNoFilter("");
    const clearFromLocationFilter = () => setFromLocationFilter("");
    const clearToLocationFilter = () => setToLocationFilter("");

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get filter label
    const getFilterLabel = () => {
        let label = "";

        if (dateFilter === "specific" && specificDate) {
            label += `Date: ${specificDate}`;
        } else if (dateFilter !== "all") {
            label += dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1);
        }

        if (vehicleNoFilter) {
            label += label ? ` | Vehicle: ${vehicleNoFilter}` : `Vehicle: ${vehicleNoFilter}`;
        }

        if (fromLocationFilter) {
            label += label ? ` | From: ${fromLocationFilter}` : `From: ${fromLocationFilter}`;
        }

        if (toLocationFilter) {
            label += label ? ` | To: ${toLocationFilter}` : `To: ${toLocationFilter}`;
        }

        return label || "All Vehicle Entries";
    };

    return (
        <div className="vehicle-view-container">
            <div className="header-section">
                <h2>Vehicle (Gaadi) Records</h2>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-label">Total Trips</div>
                        <div className="stat-value">{filteredVehicles.length}</div>
                        <div className="stat-detail">Vehicle Entries</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Today's Cost</div>
                        <div className="stat-value">₹ {formatCurrency(dailyCost)}</div>
                        <div className="stat-detail">Daily Total</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Weekly Cost</div>
                        <div className="stat-value">₹ {formatCurrency(weeklyCost)}</div>
                        <div className="stat-detail">7 Days Total</div>
                    </div>

                    <div className="stat-card highlight">
                        <div className="stat-label">Total Vehicle Cost</div>
                        <div className="stat-value">₹ {formatCurrency(totalCost)}</div>
                        <div className="stat-period">{getFilterLabel()}</div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="filters-section">
                    {/* Date Filter */}
                    <div className="filter-group">
                        <div className="filter-label">Filter by Date:</div>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${dateFilter === "all" ? "active" : ""}`}
                                onClick={() => handleDateFilterChange("all")}
                            >
                                All Time
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === "daily" ? "active" : ""}`}
                                onClick={() => handleDateFilterChange("daily")}
                            >
                                Today
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === "weekly" ? "active" : ""}`}
                                onClick={() => handleDateFilterChange("weekly")}
                            >
                                This Week
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === "monthly" ? "active" : ""}`}
                                onClick={() => handleDateFilterChange("monthly")}
                            >
                                This Month
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === "specific" ? "active" : ""}`}
                                onClick={() => handleDateFilterChange("specific")}
                            >
                                Specific Date
                            </button>
                        </div>

                        {/* Specific Date Input */}
                        {dateFilter === "specific" && (
                            <div className="specific-date-filter">
                                <label htmlFor="specificDate">Select Date:</label>
                                <input
                                    type="date"
                                    id="specificDate"
                                    value={specificDate}
                                    onChange={handleSpecificDateChange}
                                    max={getTodayDate()}
                                    className="date-input"
                                />
                                {specificDate && (
                                    <button
                                        className="clear-btn"
                                        onClick={() => {
                                            setSpecificDate("");
                                            setDateFilter("all");
                                        }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Text Input Filters (NOT Dropdowns) */}
                    <div className="text-filter-row">
                        <div className="text-filter-item">
                            <label>Vehicle Number:</label>
                            <div className="text-filter-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter vehicle number..."
                                    value={vehicleNoFilter}
                                    onChange={(e) => setVehicleNoFilter(e.target.value)}
                                    className="text-filter-input"
                                />
                                {vehicleNoFilter && (
                                    <button
                                        className="clear-text-filter-btn"
                                        onClick={clearVehicleNoFilter}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-filter-item">
                            <label>From Location:</label>
                            <div className="text-filter-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter from location..."
                                    value={fromLocationFilter}
                                    onChange={(e) => setFromLocationFilter(e.target.value)}
                                    className="text-filter-input"
                                />
                                {fromLocationFilter && (
                                    <button
                                        className="clear-text-filter-btn"
                                        onClick={clearFromLocationFilter}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-filter-item">
                            <label>To Location:</label>
                            <div className="text-filter-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter to location..."
                                    value={toLocationFilter}
                                    onChange={(e) => setToLocationFilter(e.target.value)}
                                    className="text-filter-input"
                                />
                                {toLocationFilter && (
                                    <button
                                        className="clear-text-filter-btn"
                                        onClick={clearToLocationFilter}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Clear All Filters */}
                    <div className="clear-filters">
                        <button
                            className="clear-all-btn"
                            onClick={() => {
                                setDateFilter("all");
                                setSpecificDate("");
                                setVehicleNoFilter("");
                                setFromLocationFilter("");
                                setToLocationFilter("");
                            }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-section">
                <div className="table-header">
                    <h3>Vehicle Entries ({filteredVehicles.length} trips)</h3>
                 
                </div>

                <div className="table-container">
                    <table className="vehicle-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle Number</th>
                                <th>From Location</th>
                                <th>To Location</th>
                                <th>Diesel Cost (₹)</th>
                                <th>Other Cost (₹)</th>
                                <th>Total Cost (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        <td>{vehicle.date}</td>
                                        <td className="vehicle-cell">
                                            <span className="vehicle-badge">{vehicle.vehicleNo}</span>
                                        </td>
                                        <td className="from-cell">{vehicle.fromLocation}</td>
                                        <td className="to-cell">{vehicle.toLocation}</td>
                                        <td className="diesel-cell">₹ {formatCurrency(vehicle.dieselCost)}</td>
                                        <td className="other-cell">₹ {formatCurrency(vehicle.otherCost)}</td>
                                        <td className="total-cell">₹ {formatCurrency(vehicle.totalCost)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">
                                        No vehicle entries found for the selected filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Summary */}
                {filteredVehicles.length > 0 && (
                    <div className="table-footer">
                        <div className="footer-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total Trips</span>
                                <span className="summary-value">{filteredVehicles.length}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Diesel Cost</span>
                                <span className="summary-value diesel">₹ {formatCurrency(totalDieselCost)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Other Cost</span>
                                <span className="summary-value other">₹ {formatCurrency(totalOtherCost)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Vehicle Cost</span>
                                <span className="summary-value total">₹ {formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleView;