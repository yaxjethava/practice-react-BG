import React, { useState, useEffect } from "react";
import "./ExpenseView.css";

const ExpenseView = () => {
    // Sample expense data
    const initialExpenses = [
        { id: 1, date: "2026-01-30", firm: "Bhavani", expenseType: "Diesel", description: "Truck diesel", amount: 5000, paidBy: "Cash" },
        { id: 2, date: "2026-01-30", firm: "Shree", expenseType: "Electricity", description: "Monthly bill", amount: 7500, paidBy: "Online" },
        { id: 3, date: "2026-01-31", firm: "Patel Ginning", expenseType: "Spare Parts", description: "Machine parts", amount: 3200, paidBy: "Cash" },
        { id: 4, date: "2026-01-31", firm: "Mahadev Cotton", expenseType: "Maintenance", description: "Regular maintenance", amount: 4500, paidBy: "Bank" },
        { id: 5, date: "2026-02-01", firm: "Bhavani", expenseType: "Tyre", description: "Truck tyres", amount: 12000, paidBy: "Online" },
        { id: 6, date: "2026-02-01", firm: "Om Textile", expenseType: "Diesel", description: "Generator diesel", amount: 2800, paidBy: "Cash" },
        { id: 7, date: "2026-02-02", firm: "Shree", expenseType: "Other", description: "Office supplies", amount: 1500, paidBy: "Cash" },
        { id: 8, date: "2026-02-02", firm: "Patel Ginning", expenseType: "Electricity", description: "Factory electricity", amount: 9200, paidBy: "Bank" },
        { id: 9, date: "2026-02-03", firm: "Mahadev Cotton", expenseType: "Spare Parts", description: "Replacement parts", amount: 3800, paidBy: "Cash" },
        { id: 10, date: "2026-02-03", firm: "Bhavani", expenseType: "Maintenance", description: "Vehicle service", amount: 3100, paidBy: "Online" },
        { id: 11, date: "2026-01-28", firm: "Om Textile", expenseType: "Diesel", description: "Tractor diesel", amount: 4200, paidBy: "Cash" },
        { id: 12, date: "2026-01-25", firm: "Shree", expenseType: "Tyre", description: "Car tyre replacement", amount: 8000, paidBy: "Bank" },
    ];

    const [expenses, setExpenses] = useState(initialExpenses);
    const [filteredExpenses, setFilteredExpenses] = useState(initialExpenses);

    // Filter states
    const [dateFilter, setDateFilter] = useState("all"); // all, daily, weekly, monthly, specific
    const [specificDate, setSpecificDate] = useState("");
    const [firmFilter, setFirmFilter] = useState("all");
    const [expenseTypeFilter, setExpenseTypeFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("description"); // description or amount

    // Statistics
    const [totalExpense, setTotalExpense] = useState(0);
    const [dailyExpense, setDailyExpense] = useState(0);
    const [weeklyExpense, setWeeklyExpense] = useState(0);
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [firmWiseTotals, setFirmWiseTotals] = useState({});
    const [typeWiseTotals, setTypeWiseTotals] = useState({});
    const [paymentWiseTotals, setPaymentWiseTotals] = useState({});

    // Available options for dropdowns
    const firms = ["Bhavani", "Shree", "Patel Ginning", "Mahadev Cotton", "Om Textile"];
    const expenseTypes = ["Diesel", "Spare Parts", "Tyre", "Maintenance", "Electricity", "Other"];
    const paymentMethods = ["Cash", "Online", "Bank"];

    // Filter by date range
    const filterByDate = (data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let filtered = [...data];

        if (dateFilter === "daily") {
            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getTime() === today.getTime();
            });
        } else if (dateFilter === "weekly") {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= oneWeekAgo && expenseDate <= today;
            });
        } else if (dateFilter === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startOfMonth && expenseDate <= today;
            });
        } else if (dateFilter === "specific" && specificDate) {
            filtered = filtered.filter(expense => expense.date === specificDate);
        }

        return filtered;
    };

    // Filter by firm
    const filterByFirm = (data) => {
        if (firmFilter === "all") return data;
        return data.filter(expense => expense.firm === firmFilter);
    };

    // Filter by expense type
    const filterByExpenseType = (data) => {
        if (expenseTypeFilter === "all") return data;
        return data.filter(expense => expense.expenseType === expenseTypeFilter);
    };

    // Filter by payment method
    const filterByPayment = (data) => {
        if (paymentFilter === "all") return data;
        return data.filter(expense => expense.paidBy === paymentFilter);
    };

    // Apply search filter
    const applySearchFilter = (data) => {
        if (!searchTerm.trim()) return data;

        return data.filter(expense => {
            if (searchType === "description") {
                return expense.description.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchType === "amount") {
                return expense.amount.toString().includes(searchTerm);
            }
            return true;
        });
    };

    // Calculate all statistics
    const calculateStatistics = (data) => {
        // Total expense for filtered data
        const total = data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpense(total);

        // Calculate daily expense (today)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const daily = data.filter(exp => exp.date === todayStr)
            .reduce((sum, exp) => sum + exp.amount, 0);
        setDailyExpense(daily);

        // Calculate weekly expense (last 7 days)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekly = data.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= oneWeekAgo && expDate <= today;
        }).reduce((sum, exp) => sum + exp.amount, 0);
        setWeeklyExpense(weekly);

        // Calculate monthly expense (this month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthly = data.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= startOfMonth && expDate <= today;
        }).reduce((sum, exp) => sum + exp.amount, 0);
        setMonthlyExpense(monthly);

        // Firm-wise totals
        const firmTotals = {};
        data.forEach(expense => {
            firmTotals[expense.firm] = (firmTotals[expense.firm] || 0) + expense.amount;
        });
        setFirmWiseTotals(firmTotals);

        // Expense type-wise totals
        const typeTotals = {};
        data.forEach(expense => {
            typeTotals[expense.expenseType] = (typeTotals[expense.expenseType] || 0) + expense.amount;
        });
        setTypeWiseTotals(typeTotals);

        // Payment method-wise totals
        const paymentTotals = {};
        data.forEach(expense => {
            paymentTotals[expense.paidBy] = (paymentTotals[expense.paidBy] || 0) + expense.amount;
        });
        setPaymentWiseTotals(paymentTotals);
    };

    // Apply all filters
    useEffect(() => {
        let result = filterByDate(expenses);
        result = filterByFirm(result);
        result = filterByExpenseType(result);
        result = filterByPayment(result);
        result = applySearchFilter(result);
        setFilteredExpenses(result);
        calculateStatistics(result);
    }, [dateFilter, specificDate, firmFilter, expenseTypeFilter, paymentFilter, searchTerm, searchType, expenses]);

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

        if (firmFilter !== "all") {
            label += label ? ` | Firm: ${firmFilter}` : `Firm: ${firmFilter}`;
        }

        if (expenseTypeFilter !== "all") {
            label += label ? ` | Type: ${expenseTypeFilter}` : `Type: ${expenseTypeFilter}`;
        }

        if (paymentFilter !== "all") {
            label += label ? ` | Paid: ${paymentFilter}` : `Paid: ${paymentFilter}`;
        }

        return label || "All Expenses";
    };

    return (
        <div className="expense-view-container">
            <div className="header-section">
                <h2>Expense (Kharch) Records</h2>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-label">Today's Expense</div>
                        <div className="stat-value">₹ {formatCurrency(dailyExpense)}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">This Week</div>
                        <div className="stat-value">₹ {formatCurrency(weeklyExpense)}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">This Month</div>
                        <div className="stat-value">₹ {formatCurrency(monthlyExpense)}</div>
                    </div>

                    <div className="stat-card highlight">
                        <div className="stat-label">Filtered Total</div>
                        <div className="stat-value">₹ {formatCurrency(totalExpense)}</div>
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

                    {/* Firm, Expense Type, and Payment Filters */}
                    <div className="filter-row">
                        <div className="filter-item">
                            <label>Firm:</label>
                            <select
                                value={firmFilter}
                                onChange={(e) => setFirmFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Firms</option>
                                {firms.map(firm => (
                                    <option key={firm} value={firm}>{firm}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Expense Type:</label>
                            <select
                                value={expenseTypeFilter}
                                onChange={(e) => setExpenseTypeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Types</option>
                                {expenseTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">

                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <div className="search-type">
                            <button
                                className={`search-type-btn ${searchType === "description" ? "active" : ""}`}
                                onClick={() => setSearchType("description")}
                            >
                                Search by Description
                            </button>
                            <button
                                className={`search-type-btn ${searchType === "amount" ? "active" : ""}`}
                                onClick={() => setSearchType("amount")}
                            >
                                Search by Amount
                            </button>
                        </div>

                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder={searchType === "description" ? "Search in description..." : "Search amount..."}
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
                                setFirmFilter("all");
                                setExpenseTypeFilter("all");
                                setPaymentFilter("all");
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
                    <h3>Expense Records ({filteredExpenses.length} entries)</h3>
                </div>

                <div className="table-container">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Firm</th>
                                <th>Expense Type</th>
                                <th>Description</th>
                                <th>Amount (₹)</th>
                                <th>Paid By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.date}</td>
                                        <td className="firm-cell">{expense.firm}</td>
                                        <td className="type-cell">
                                            <span className={`type-badge ${expense.expenseType.toLowerCase().replace(' ', '-')}`}>
                                                {expense.expenseType}
                                            </span>
                                        </td>
                                        <td className="description-cell">{expense.description}</td>
                                        <td className="amount-cell">₹ {formatCurrency(expense.amount)}</td>
                                        <td className="payment-cell">
                                            <span className={`payment-badge ${expense.paidBy.toLowerCase()}`}>
                                                {expense.paidBy}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No expense records found for the selected filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseView;