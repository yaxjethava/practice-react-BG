import React, { useState, useEffect } from "react";
import "./SalesView.css";

const SalesView = () => {
    // Sample sales data - Updated to match the new form structure
    const initialSales = [
        { id: 1, date: "2026-01-30", invoiceNo: "INV-001", customerName: "Rahul Traders", amount: 20000, receivedAmount: 15000, paymentMode: "Cash" },
        { id: 2, date: "2026-01-31", invoiceNo: "INV-002", customerName: "Shree Cotton Mill", amount: 9500, receivedAmount: 9500, paymentMode: "Online" },
        { id: 3, date: "2026-02-01", invoiceNo: "INV-003", customerName: "Patel Textiles", amount: 15750, receivedAmount: 10000, paymentMode: "Bank" },
        { id: 4, date: "2026-02-02", invoiceNo: "INV-004", customerName: "Om Fabrics", amount: 23400, receivedAmount: 23400, paymentMode: "Cash" },
        { id: 5, date: "2026-02-03", invoiceNo: "INV-005", customerName: "Mahadev Exports", amount: 19800, receivedAmount: 15000, paymentMode: "Credit" },
        { id: 6, date: "2026-02-04", invoiceNo: "INV-006", customerName: "Krishna Cotton", amount: 11100, receivedAmount: 11100, paymentMode: "Online" },
        { id: 7, date: "2026-02-05", invoiceNo: "INV-007", customerName: "Rahul Traders", amount: 17425, receivedAmount: 12000, paymentMode: "Bank" },
        { id: 8, date: "2026-02-06", invoiceNo: "INV-008", customerName: "Patel Textiles", amount: 21450, receivedAmount: 21450, paymentMode: "Cash" },
        { id: 9, date: "2026-01-28", invoiceNo: "INV-009", customerName: "Shree Cotton Mill", amount: 9675, receivedAmount: 9675, paymentMode: "Online" },
        { id: 10, date: "2026-01-25", invoiceNo: "INV-010", customerName: "Om Fabrics", amount: 18050, receivedAmount: 13000, paymentMode: "Credit" },
    ];

    const [sales, setSales] = useState(initialSales);
    const [filteredSales, setFilteredSales] = useState(initialSales);

    // State for payment modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");

    // Filter states
    const [dateFilter, setDateFilter] = useState("all");
    const [specificDate, setSpecificDate] = useState("");
    const [customerFilter, setCustomerFilter] = useState("all");
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
    const paymentModes = ["Cash", "Bank", "Online", "Credit"];

    // Calculate pending amount for each sale
    const calculatePendingAmount = (amount, receivedAmount) => {
        return amount - receivedAmount;
    };

    // Open payment modal
    const openPaymentModal = (sale) => {
        setSelectedSale(sale);
        const pending = calculatePendingAmount(sale.amount, sale.receivedAmount);
        setPaymentAmount(pending > 0 ? pending.toString() : "");
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMode("Cash");
        setShowPaymentModal(true);
    };

    // Handle payment submission
    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        if (!paymentAmount || paymentAmount <= 0) {
            alert("Please enter a valid payment amount");
            return;
        }

        const paymentNum = Number(paymentAmount);

        // Update the sale with new payment
        const updatedSales = sales.map(sale => {
            if (sale.id === selectedSale.id) {
                const newReceivedAmount = sale.receivedAmount + paymentNum;
                return {
                    ...sale,
                    receivedAmount: newReceivedAmount,
                    // Add payment history
                    paymentHistory: [
                        ...(sale.paymentHistory || []),
                        {
                            date: paymentDate,
                            amount: paymentNum,
                            mode: paymentMode,
                            type: "partial"
                        }
                    ]
                };
            }
            return sale;
        });

        setSales(updatedSales);

        // Close modal
        setShowPaymentModal(false);
        setSelectedSale(null);
        setPaymentAmount("");

        alert(`Payment of ₹${paymentNum.toLocaleString()} recorded successfully!`);
    };

    // Mark as fully paid
    const markAsFullyPaid = (sale) => {
        const pending = calculatePendingAmount(sale.amount, sale.receivedAmount);
        if (pending <= 0) {
            alert("This invoice is already fully paid!");
            return;
        }

        const updatedSales = sales.map(s => {
            if (s.id === sale.id) {
                return {
                    ...s,
                    receivedAmount: s.amount, // Set received amount equal to total amount
                    paymentHistory: [
                        ...(s.paymentHistory || []),
                        {
                            date: new Date().toISOString().split('T')[0],
                            amount: pending,
                            mode: "Cash",
                            type: "full"
                        }
                    ]
                };
            }
            return s;
        });

        setSales(updatedSales);
        alert(`Invoice marked as fully paid! ₹${pending.toLocaleString()} cleared.`);
    };

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

    // Filter by payment mode
    const filterByPayment = (data) => {
        if (paymentFilter === "all") return data;
        return data.filter(sale => sale.paymentMode === paymentFilter);
    };

    // Filter by payment status (pending/cleared)
    const filterByPending = (data) => {
        if (pendingFilter === "all") return data;
        if (pendingFilter === "pending") return data.filter(sale => calculatePendingAmount(sale.amount, sale.receivedAmount) > 0);
        if (pendingFilter === "cleared") return data.filter(sale => calculatePendingAmount(sale.amount, sale.receivedAmount) <= 0);
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
        const total = data.reduce((sum, sale) => sum + sale.amount, 0);
        const received = data.reduce((sum, sale) => sum + sale.receivedAmount, 0);
        const pending = data.reduce((sum, sale) => {
            const salePending = calculatePendingAmount(sale.amount, sale.receivedAmount);
            return sum + Math.max(0, salePending); // Only add positive pending amounts
        }, 0);

        setTotalSales(total);
        setTotalReceived(received);
        setTotalPending(pending);

        // Calculate daily sales (today)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const daily = data.filter(sale => sale.date === todayStr)
            .reduce((sum, sale) => sum + sale.amount, 0);
        setDailySales(daily);

        // Calculate weekly sales (last 7 days)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekly = data.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= oneWeekAgo && saleDate <= today;
        }).reduce((sum, sale) => sum + sale.amount, 0);
        setWeeklySales(weekly);

        // Calculate monthly sales (this month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthly = data.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startOfMonth && saleDate <= today;
        }).reduce((sum, sale) => sum + sale.amount, 0);
        setMonthlySales(monthly);

        // Customer-wise totals
        const customerTotals = {};
        const customerReceived = {};
        const customerPending = {};

        data.forEach(sale => {
            const pending = calculatePendingAmount(sale.amount, sale.receivedAmount);
            customerTotals[sale.customerName] = (customerTotals[sale.customerName] || 0) + sale.amount;
            customerReceived[sale.customerName] = (customerReceived[sale.customerName] || 0) + sale.receivedAmount;
            customerPending[sale.customerName] = (customerPending[sale.customerName] || 0) + Math.max(0, pending);
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
            paymentTotals[sale.paymentMode] = (paymentTotals[sale.paymentMode] || 0) + sale.amount;
        });
        setPaymentWiseTotals(paymentTotals);
    };

    // Apply all filters
    useEffect(() => {
        let result = filterByDate(sales);
        result = filterByCustomer(result);
        result = filterByPayment(result);
        result = filterByPending(result);
        result = applySearchFilter(result);
        setFilteredSales(result);
        calculateStatistics(result);
    }, [dateFilter, specificDate, customerFilter, paymentFilter, pendingFilter, searchTerm, searchType, sales]);

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
            {/* Payment Modal */}
            {showPaymentModal && selectedSale && (
                <div className="modal-overlay">
                    <div className="payment-modal">
                        <div className="modal-header">
                            <h3>Record Payment</h3>
                            <button className="close-modal" onClick={() => setShowPaymentModal(false)}>×</button>
                        </div>

                        <div className="modal-content">
                            <div className="sale-info">
                                <div className="info-row">
                                    <span className="info-label">Invoice No:</span>
                                    <span className="info-value">{selectedSale.invoiceNo}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Customer:</span>
                                    <span className="info-value">{selectedSale.customerName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Total Amount:</span>
                                    <span className="info-value">₹ {formatCurrency(selectedSale.amount)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Already Received:</span>
                                    <span className="info-value">₹ {formatCurrency(selectedSale.receivedAmount)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Pending Amount:</span>
                                    <span className="info-value pending">₹ {formatCurrency(calculatePendingAmount(selectedSale.amount, selectedSale.receivedAmount))}</span>
                                </div>
                            </div>

                            <form onSubmit={handlePaymentSubmit}>
                                <div className="form-group">
                                    <label>Payment Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Enter payment amount"
                                        required
                                        min="1"
                                        max={calculatePendingAmount(selectedSale.amount, selectedSale.receivedAmount)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Payment Date</label>
                                    <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                        max={getTodayDate()}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Payment Mode</label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        required
                                    >
                                        {paymentModes.map(mode => (
                                            <option key={mode} value={mode}>{mode}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowPaymentModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        Record Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="stat-detail">{filteredSales.filter(s => calculatePendingAmount(s.amount, s.receivedAmount) > 0).length} pending invoices</div>
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

                    {/* Customer, Payment Filters */}
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
                                setPaymentFilter("all");
                                setPendingFilter("all");
                                setSearchTerm("");
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
                    <h3>Sales Records ({filteredSales.length} invoices)</h3>
                   
                </div>

                <div className="table-container">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Invoice No.</th>
                                <th>Customer</th>
                                <th>Total Amount (₹)</th>
                                <th>Received (₹)</th>
                                <th>Pending (₹)</th>
                                <th>Payment Mode</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length > 0 ? (
                                filteredSales.map((sale) => {
                                    const pendingAmount = calculatePendingAmount(sale.amount, sale.receivedAmount);
                                    const isPending = pendingAmount > 0;

                                    return (
                                        <tr key={sale.id}>
                                            <td>{sale.date}</td>
                                            <td className="invoice-cell">{sale.invoiceNo}</td>
                                            <td className="customer-cell">{sale.customerName}</td>
                                            <td className="total-cell">₹ {formatCurrency(sale.amount)}</td>
                                            <td className="received-cell">₹ {formatCurrency(sale.receivedAmount)}</td>
                                            <td className={`pending-cell ${isPending ? 'pending' : 'cleared'}`}>
                                                ₹ {formatCurrency(pendingAmount)}
                                            </td>
                                            <td className="payment-cell">
                                                <span className={`payment-badge ${sale.paymentMode.toLowerCase()}`}>
                                                    {sale.paymentMode}
                                                </span>
                                            </td>
                                            <td className="status-cell">
                                                <span className={`status-badge ${isPending ? 'pending' : 'cleared'}`}>
                                                    {isPending ? 'Pending' : 'Cleared'}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                {isPending ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            className="add-payment-btn"
                                                            onClick={() => openPaymentModal(sale)}
                                                        >
                                                            Add Payment
                                                        </button>
                                                        <button
                                                            className="mark-paid-btn"
                                                            onClick={() => markAsFullyPaid(sale)}
                                                        >
                                                            Mark Paid
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="fully-paid">Fully Paid</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="no-data">
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
                                <span className="summary-label">Pending Invoices:</span>
                                <span className="summary-value">
                                    {filteredSales.filter(s => calculatePendingAmount(s.amount, s.receivedAmount) > 0).length}
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