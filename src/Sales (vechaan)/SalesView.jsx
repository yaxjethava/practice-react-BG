import React, { useState, useEffect } from "react";
import "./SalesView.css";

const SalesView = () => {
    // Sample sales data
    const initialSales = [
        { id: 1, date: "2026-01-30", invoiceNo: "INV-001", customerName: "Rahul Traders", cottonType: "Long Staple", quantity: 100, rate: 200, totalAmount: 20000, receivedAmount: 15000, pendingAmount: 5000, paymentMode: "Cash" },
        { id: 2, date: "2026-01-31", invoiceNo: "INV-002", customerName: "Shree Cotton Mill", cottonType: "Medium Staple", quantity: 50, rate: 190, totalAmount: 9500, receivedAmount: 9500, pendingAmount: 0, paymentMode: "Online" },
        { id: 3, date: "2026-02-01", invoiceNo: "INV-003", customerName: "Patel Textiles", cottonType: "Superior", quantity: 75, rate: 210, totalAmount: 15750, receivedAmount: 10000, pendingAmount: 5750, paymentMode: "Bank" },
        { id: 4, date: "2026-02-02", invoiceNo: "INV-004", customerName: "Om Fabrics", cottonType: "Long Staple", quantity: 120, rate: 195, totalAmount: 23400, receivedAmount: 23400, pendingAmount: 0, paymentMode: "Cash" },
        { id: 5, date: "2026-02-03", invoiceNo: "INV-005", customerName: "Mahadev Exports", cottonType: "Premium", quantity: 90, rate: 220, totalAmount: 19800, receivedAmount: 15000, pendingAmount: 4800, paymentMode: "Credit" },
        { id: 6, date: "2026-02-04", invoiceNo: "INV-006", customerName: "Krishna Cotton", cottonType: "Medium Staple", quantity: 60, rate: 185, totalAmount: 11100, receivedAmount: 11100, pendingAmount: 0, paymentMode: "Online" },
        { id: 7, date: "2026-02-05", invoiceNo: "INV-007", customerName: "Rahul Traders", cottonType: "Superior", quantity: 85, rate: 205, totalAmount: 17425, receivedAmount: 12000, pendingAmount: 5425, paymentMode: "Bank" },
        { id: 8, date: "2026-02-06", invoiceNo: "INV-008", customerName: "Patel Textiles", cottonType: "Long Staple", quantity: 110, rate: 195, totalAmount: 21450, receivedAmount: 21450, pendingAmount: 0, paymentMode: "Cash" },
        { id: 9, date: "2026-01-28", invoiceNo: "INV-009", customerName: "Shree Cotton Mill", cottonType: "Premium", quantity: 45, rate: 215, totalAmount: 9675, receivedAmount: 9675, pendingAmount: 0, paymentMode: "Online" },
        { id: 10, date: "2026-01-25", invoiceNo: "INV-010", customerName: "Om Fabrics", cottonType: "Medium Staple", quantity: 95, rate: 190, totalAmount: 18050, receivedAmount: 13000, pendingAmount: 5050, paymentMode: "Credit" },
    ];

    const [sales, setSales] = useState(initialSales);
    const [filteredSales, setFilteredSales] = useState(initialSales);

    // Filter states
    const [dateFilter, setDateFilter] = useState("all");
    const [specificDate, setSpecificDate] = useState("");
    const [customerFilter, setCustomerFilter] = useState("all");
    const [cottonTypeFilter, setCottonTypeFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [pendingFilter, setPendingFilter] = useState("all"); // all, pending, cleared
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("customer"); // customer or invoice

    // Statistics
    const [totalSales, setTotalSales] = useState(0);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [dailySales, setDailySales] = useState(0);
    const [weeklySales, setWeeklySales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [customerWiseTotals, setCustomerWiseTotals] = useState({});
    const [paymentWiseTotals, setPaymentWiseTotals] = useState({});

    // Available options for dropdowns
    const customers = ["Rahul Traders", "Shree Cotton Mill", "Patel Textiles", "Om Fabrics", "Mahadev Exports", "Krishna Cotton"];
    const cottonTypes = ["Long Staple", "Medium Staple", "Premium", "Superior"];
    const paymentModes = ["Cash", "Bank", "Online", "Credit"];

    // Filter by date range
    const filterByDate = (data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let filtered = [...data];

        if (dateFilter === "daily") {
            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getTime() === today.getTime();
            });
        } else if (dateFilter === "weekly") {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= oneWeekAgo && saleDate <= today;
            });
        } else if (dateFilter === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= startOfMonth && saleDate <= today;
            });
        } else if (dateFilter === "specific" && specificDate) {
            filtered = filtered.filter(sale => sale.date === specificDate);
        }

        return filtered;
    };

    // Filter by customer
    const filterByCustomer = (data) => {
        if (customerFilter === "all") return data;
        return data.filter(sale => sale.customerName === customerFilter);
    };

    // Filter by cotton type
    const filterByCottonType = (data) => {
        if (cottonTypeFilter === "all") return data;
        return data.filter(sale => sale.cottonType === cottonTypeFilter);
    };

    // Filter by payment mode
    const filterByPayment = (data) => {
        if (paymentFilter === "all") return data;
        return data.filter(sale => sale.paymentMode === paymentFilter);
    };

    // Filter by payment status (pending/cleared)
    const filterByPending = (data) => {
        if (pendingFilter === "all") return data;
        if (pendingFilter === "pending") return data.filter(sale => sale.pendingAmount > 0);
        if (pendingFilter === "cleared") return data.filter(sale => sale.pendingAmount === 0);
        return data;
    };

    // Apply search filter
    const applySearchFilter = (data) => {
        if (!searchTerm.trim()) return data;

        return data.filter(sale => {
            if (searchType === "customer") {
                return sale.customerName.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchType === "invoice") {
                return sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        });
    };

    // Calculate all statistics
    const calculateStatistics = (data) => {
        // Total calculations
        const total = data.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const received = data.reduce((sum, sale) => sum + sale.receivedAmount, 0);
        const pending = data.reduce((sum, sale) => sum + sale.pendingAmount, 0);

        setTotalSales(total);
        setTotalReceived(received);
        setTotalPending(pending);

        // Calculate daily sales (today)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const daily = data.filter(sale => sale.date === todayStr)
            .reduce((sum, sale) => sum + sale.totalAmount, 0);
        setDailySales(daily);

        // Calculate weekly sales (last 7 days)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekly = data.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= oneWeekAgo && saleDate <= today;
        }).reduce((sum, sale) => sum + sale.totalAmount, 0);
        setWeeklySales(weekly);

        // Calculate monthly sales (this month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthly = data.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startOfMonth && saleDate <= today;
        }).reduce((sum, sale) => sum + sale.totalAmount, 0);
        setMonthlySales(monthly);

        // Customer-wise totals
        const customerTotals = {};
        const customerReceived = {};
        const customerPending = {};

        data.forEach(sale => {
            customerTotals[sale.customerName] = (customerTotals[sale.customerName] || 0) + sale.totalAmount;
            customerReceived[sale.customerName] = (customerReceived[sale.customerName] || 0) + sale.receivedAmount;
            customerPending[sale.customerName] = (customerPending[sale.customerName] || 0) + sale.pendingAmount;
        });

        // Combine into one object for display
        const combinedCustomerData = {};
        Object.keys(customerTotals).forEach(customer => {
            combinedCustomerData[customer] = {
                total: customerTotals[customer],
                received: customerReceived[customer] || 0,
                pending: customerPending[customer] || 0
            };
        });

        setCustomerWiseTotals(combinedCustomerData);

        // Payment method-wise totals
        const paymentTotals = {};
        data.forEach(sale => {
            paymentTotals[sale.paymentMode] = (paymentTotals[sale.paymentMode] || 0) + sale.totalAmount;
        });
        setPaymentWiseTotals(paymentTotals);
    };

    // Apply all filters
    useEffect(() => {
        let result = filterByDate(sales);
        result = filterByCustomer(result);
        result = filterByCottonType(result);
        result = filterByPayment(result);
        result = filterByPending(result);
        result = applySearchFilter(result);
        setFilteredSales(result);
        calculateStatistics(result);
    }, [dateFilter, specificDate, customerFilter, cottonTypeFilter, paymentFilter, pendingFilter, searchTerm, searchType, sales]);

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

        if (customerFilter !== "all") {
            label += label ? ` | Customer: ${customerFilter}` : `Customer: ${customerFilter}`;
        }

        if (pendingFilter !== "all") {
            label += label ? ` | Status: ${pendingFilter}` : `Status: ${pendingFilter}`;
        }

        return label || "All Sales";
    };

    return (
        <div className="sales-view-container">
            <div className="header-section">
                <h2>Sales (Vechaan) Records</h2>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-label">Total Sales</div>
                        <div className="stat-value">₹ {formatCurrency(totalSales)}</div>
                        <div className="stat-detail">Received: ₹ {formatCurrency(totalReceived)}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Pending Amount</div>
                        <div className="stat-value pending">₹ {formatCurrency(totalPending)}</div>
                        <div className="stat-detail">{filteredSales.length} invoices</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Today's Sales</div>
                        <div className="stat-value">₹ {formatCurrency(dailySales)}</div>
                        <div className="stat-detail">Daily Total</div>
                    </div>

                    <div className="stat-card highlight">
                        <div className="stat-label">Filtered Total</div>
                        <div className="stat-value">₹ {formatCurrency(totalSales)}</div>
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

                    {/* Customer, Cotton Type, Payment Filters */}
                    <div className="filter-row">
                        <div className="filter-item">
                            <label>Customer:</label>
                            <select
                                value={customerFilter}
                                onChange={(e) => setCustomerFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Customers</option>
                                {customers.map(customer => (
                                    <option key={customer} value={customer}>{customer}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Cotton Type:</label>
                            <select
                                value={cottonTypeFilter}
                                onChange={(e) => setCottonTypeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Types</option>
                                {cottonTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Payment Mode:</label>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Modes</option>
                                {paymentModes.map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Payment Status:</label>
                            <select
                                value={pendingFilter}
                                onChange={(e) => setPendingFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending Only</option>
                                <option value="cleared">Cleared Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <div className="search-type">
                            <button
                                className={`search-type-btn ${searchType === "customer" ? "active" : ""}`}
                                onClick={() => setSearchType("customer")}
                            >
                                Search by Customer
                            </button>
                            <button
                                className={`search-type-btn ${searchType === "invoice" ? "active" : ""}`}
                                onClick={() => setSearchType("invoice")}
                            >
                                Search by Invoice
                            </button>
                        </div>

                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder={searchType === "customer" ? "Search customer name..." : "Search invoice number..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    className="clear-search-btn"
                                    onClick={() => setSearchTerm("")}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Clear All Filters */}
                    <div className="clear-filters">
                        <button
                            className="clear-all-btn"
                            onClick={() => {
                                setDateFilter("all");
                                setSpecificDate("");
                                setCustomerFilter("all");
                                setCottonTypeFilter("all");
                                setPaymentFilter("all");
                                setPendingFilter("all");
                                setSearchTerm("");
                            }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>

                {/* Breakdown Statistics */}
                {/* <div className="breakdown-section">
                    <div className="breakdown-card">
                        <h4>Customer-wise Summary</h4>
                        <div className="breakdown-list">
                            {Object.entries(customerWiseTotals).map(([customer, data]) => (
                                <div key={customer} className="breakdown-item">
                                    <div className="breakdown-header">
                                        <span className="breakdown-label">{customer}</span>
                                        <span className="breakdown-total">₹ {formatCurrency(data.total)}</span>
                                    </div>
                                    <div className="breakdown-details">
                                        <span className="detail-item">Received: ₹ {formatCurrency(data.received)}</span>
                                        <span className="detail-item pending">Pending: ₹ {formatCurrency(data.pending)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="breakdown-card">
                        <h4>Payment Method-wise</h4>
                        <div className="breakdown-list">
                            {Object.entries(paymentWiseTotals).map(([method, amount]) => (
                                <div key={method} className="breakdown-item">
                                    <span className="breakdown-label">{method}:</span>
                                    <span className="breakdown-value">₹ {formatCurrency(amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="breakdown-card">
                        <h4>Quick Stats</h4>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-item-label">This Week</div>
                                <div className="stat-item-value">₹ {formatCurrency(weeklySales)}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-item-label">This Month</div>
                                <div className="stat-item-value">₹ {formatCurrency(monthlySales)}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-item-label">Total Invoices</div>
                                <div className="stat-item-value">{filteredSales.length}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-item-label">Avg. Sale</div>
                                <div className="stat-item-value">₹ {filteredSales.length > 0 ? formatCurrency(totalSales / filteredSales.length) : 0}</div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Table Section */}
            <div className="table-section">
                <div className="table-header">
                    <h3>Sales Records ({filteredSales.length} invoices)</h3>
                   
                </div>

                <div className="table-container">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Invoice No.</th>
                                <th>Customer</th>
                                <th>Cotton Type</th>
                                <th>Quantity (Kg)</th>
                                <th>Rate (₹)</th>
                                <th>Total (₹)</th>
                                <th>Received (₹)</th>
                                <th>Pending (₹)</th>
                                <th>Payment Mode</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length > 0 ? (
                                filteredSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>{sale.date}</td>
                                        <td className="invoice-cell">{sale.invoiceNo}</td>
                                        <td className="customer-cell">{sale.customerName}</td>
                                        <td className="type-cell">
                                            <span className="cotton-type-badge">
                                                {sale.cottonType}
                                            </span>
                                        </td>
                                        <td className="quantity-cell">{sale.quantity}</td>
                                        <td className="rate-cell">₹ {sale.rate}</td>
                                        <td className="total-cell">₹ {formatCurrency(sale.totalAmount)}</td>
                                        <td className="received-cell">₹ {formatCurrency(sale.receivedAmount)}</td>
                                        <td className={`pending-cell ${sale.pendingAmount > 0 ? 'pending' : 'cleared'}`}>
                                            ₹ {formatCurrency(sale.pendingAmount)}
                                        </td>
                                        <td className="payment-cell">
                                            <span className={`payment-badge ${sale.paymentMode.toLowerCase()}`}>
                                                {sale.paymentMode}
                                            </span>
                                        </td>
                                        <td className="status-cell">
                                            <span className={`status-badge ${sale.pendingAmount > 0 ? 'pending' : 'cleared'}`}>
                                                {sale.pendingAmount > 0 ? 'Pending' : 'Cleared'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="no-data">
                                        No sales records found for the selected filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Summary */}
                {filteredSales.length > 0 && (
                    <div className="table-footer">
                        <div className="footer-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total Sales:</span>
                                <span className="summary-value">₹ {formatCurrency(totalSales)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Received:</span>
                                <span className="summary-value received">₹ {formatCurrency(totalReceived)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Pending:</span>
                                <span className="summary-value pending">₹ {formatCurrency(totalPending)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Quantity:</span>
                                <span className="summary-value">
                                    {filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)} Kg
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesView;