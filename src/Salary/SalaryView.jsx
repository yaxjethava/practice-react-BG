import React, { useState, useEffect } from "react";
import "./SalaryView.css";

const SalaryView = () => {
    // Sample salary data based on your form fields
    const initialSalaries = [
        { id: 1, date: "2026-01-30", workerName: "John Doe", workType: "Machine", baseSalary: 20000, totalLeaves: 2, perLeaveDeduction: 500, paymentMode: "Cash", totalDeduction: 1000, finalSalary: 19000 },
        { id: 2, date: "2026-01-30", workerName: "Jane Smith", workType: "Loading", baseSalary: 15000, totalLeaves: 0, perLeaveDeduction: 400, paymentMode: "Online", totalDeduction: 0, finalSalary: 15000 },
        { id: 3, date: "2026-01-31", workerName: "Robert Johnson", workType: "Machine", baseSalary: 22000, totalLeaves: 1, perLeaveDeduction: 600, paymentMode: "Bank", totalDeduction: 600, finalSalary: 21400 },
        { id: 4, date: "2026-01-31", workerName: "Michael Williams", workType: "Other", baseSalary: 18000, totalLeaves: 3, perLeaveDeduction: 450, paymentMode: "Cash", totalDeduction: 1350, finalSalary: 16650 },
        { id: 5, date: "2026-02-01", workerName: "Sarah Brown", workType: "Loading", baseSalary: 16000, totalLeaves: 0, perLeaveDeduction: 400, paymentMode: "Online", totalDeduction: 0, finalSalary: 16000 },
        { id: 6, date: "2026-02-01", workerName: "David Jones", workType: "Machine", baseSalary: 21000, totalLeaves: 2, perLeaveDeduction: 550, paymentMode: "Bank", totalDeduction: 1100, finalSalary: 19900 },
        { id: 7, date: "2026-02-02", workerName: "Lisa Davis", workType: "Other", baseSalary: 17000, totalLeaves: 1, perLeaveDeduction: 420, paymentMode: "Cash", totalDeduction: 420, finalSalary: 16580 },
        { id: 8, date: "2026-02-02", workerName: "Paul Miller", workType: "Loading", baseSalary: 15500, totalLeaves: 0, perLeaveDeduction: 380, paymentMode: "Online", totalDeduction: 0, finalSalary: 15500 },
        { id: 9, date: "2026-02-03", workerName: "Mary Wilson", workType: "Machine", baseSalary: 23000, totalLeaves: 4, perLeaveDeduction: 650, paymentMode: "Bank", totalDeduction: 2600, finalSalary: 20400 },
        { id: 10, date: "2026-02-03", workerName: "James Taylor", workType: "Loading", baseSalary: 14500, totalLeaves: 1, perLeaveDeduction: 350, paymentMode: "Cash", totalDeduction: 350, finalSalary: 14150 },
        { id: 11, date: "2026-01-28", workerName: "John Doe", workType: "Machine", baseSalary: 20000, totalLeaves: 0, perLeaveDeduction: 500, paymentMode: "Cash", totalDeduction: 0, finalSalary: 20000 },
        { id: 12, date: "2026-01-25", workerName: "Jane Smith", workType: "Loading", baseSalary: 15000, totalLeaves: 1, perLeaveDeduction: 400, paymentMode: "Online", totalDeduction: 400, finalSalary: 14600 },
    ];

    const [salaries, setSalaries] = useState(initialSalaries);
    const [filteredSalaries, setFilteredSalaries] = useState(initialSalaries);

    // Filter states
    const [dateFilter, setDateFilter] = useState("all");
    const [specificDate, setSpecificDate] = useState("");
    const [workerFilter, setWorkerFilter] = useState("");
    const [workTypeFilter, setWorkTypeFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");

    // Statistics
    const [totalBaseSalary, setTotalBaseSalary] = useState(0);
    const [totalDeduction, setTotalDeduction] = useState(0);
    const [totalFinalSalary, setTotalFinalSalary] = useState(0);
    const [dailySalary, setDailySalary] = useState(0);
    const [weeklySalary, setWeeklySalary] = useState(0);
    const [monthlySalary, setMonthlySalary] = useState(0);
    const [workerWiseTotals, setWorkerWiseTotals] = useState({});
    const [paymentWiseTotals, setPaymentWiseTotals] = useState({});

    // Get unique values
    const workers = [...new Set(salaries.map(s => s.workerName))];
    const workTypes = [...new Set(salaries.map(s => s.workType))];
    const paymentModes = [...new Set(salaries.map(s => s.paymentMode))];

    // Filter by date range
    const filterByDate = (data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let filtered = [...data];

        if (dateFilter === "daily") {
            filtered = filtered.filter(salary => {
                const salaryDate = new Date(salary.date);
                return salaryDate.getTime() === today.getTime();
            });
        } else if (dateFilter === "weekly") {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            filtered = filtered.filter(salary => {
                const salaryDate = new Date(salary.date);
                return salaryDate >= oneWeekAgo && salaryDate <= today;
            });
        } else if (dateFilter === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            filtered = filtered.filter(salary => {
                const salaryDate = new Date(salary.date);
                return salaryDate >= startOfMonth && salaryDate <= today;
            });
        } else if (dateFilter === "specific" && specificDate) {
            filtered = filtered.filter(salary => salary.date === specificDate);
        }

        return filtered;
    };

    // Filter by worker name (text input)
    const filterByWorker = (data) => {
        if (!workerFilter.trim()) return data;
        return data.filter(salary =>
            salary.workerName.toLowerCase().includes(workerFilter.toLowerCase())
        );
    };

    // Filter by work type (text input)
    const filterByWorkType = (data) => {
        if (!workTypeFilter.trim()) return data;
        return data.filter(salary =>
            salary.workType.toLowerCase().includes(workTypeFilter.toLowerCase())
        );
    };

    // Filter by payment mode (text input)
    const filterByPayment = (data) => {
        if (!paymentFilter.trim()) return data;
        return data.filter(salary =>
            salary.paymentMode.toLowerCase().includes(paymentFilter.toLowerCase())
        );
    };

    // Calculate all statistics
    const calculateStatistics = (data) => {
        // Total calculations
        const base = data.reduce((sum, salary) => sum + salary.baseSalary, 0);
        const deduction = data.reduce((sum, salary) => sum + salary.totalDeduction, 0);
        const final = data.reduce((sum, salary) => sum + salary.finalSalary, 0);

        setTotalBaseSalary(base);
        setTotalDeduction(deduction);
        setTotalFinalSalary(final);

        // Calculate daily salary (today)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const daily = data.filter(s => s.date === todayStr)
            .reduce((sum, s) => sum + s.finalSalary, 0);
        setDailySalary(daily);

        // Calculate weekly salary (last 7 days)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekly = data.filter(s => {
            const sDate = new Date(s.date);
            return sDate >= oneWeekAgo && sDate <= today;
        }).reduce((sum, s) => sum + s.finalSalary, 0);
        setWeeklySalary(weekly);

        // Calculate monthly salary (this month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthly = data.filter(s => {
            const sDate = new Date(s.date);
            return sDate >= startOfMonth && sDate <= today;
        }).reduce((sum, s) => sum + s.finalSalary, 0);
        setMonthlySalary(monthly);

        // Worker-wise totals
        const workerTotals = {};
        data.forEach(salary => {
            if (!workerTotals[salary.workerName]) {
                workerTotals[salary.workerName] = {
                    base: 0,
                    deduction: 0,
                    final: 0,
                    entries: 0
                };
            }
            workerTotals[salary.workerName].base += salary.baseSalary;
            workerTotals[salary.workerName].deduction += salary.totalDeduction;
            workerTotals[salary.workerName].final += salary.finalSalary;
            workerTotals[salary.workerName].entries += 1;
        });
        setWorkerWiseTotals(workerTotals);

        // Payment-wise totals
        const paymentTotals = {};
        data.forEach(salary => {
            paymentTotals[salary.paymentMode] = (paymentTotals[salary.paymentMode] || 0) + salary.finalSalary;
        });
        setPaymentWiseTotals(paymentTotals);
    };

    // Apply all filters
    useEffect(() => {
        let result = filterByDate(salaries);
        result = filterByWorker(result);
        result = filterByWorkType(result);
        result = filterByPayment(result);
        setFilteredSalaries(result);
        calculateStatistics(result);
    }, [dateFilter, specificDate, workerFilter, workTypeFilter, paymentFilter, salaries]);

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
    const clearWorkerFilter = () => setWorkerFilter("");
    const clearWorkTypeFilter = () => setWorkTypeFilter("");
    const clearPaymentFilter = () => setPaymentFilter("");

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

        if (workerFilter) {
            label += label ? ` | Worker: ${workerFilter}` : `Worker: ${workerFilter}`;
        }

        return label || "All Salary Entries";
    };

    return (
        <div className="salary-view-container">
            <div className="header-section">
                <h2>Salary Records</h2>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-label">Total Entries</div>
                        <div className="stat-value">{filteredSalaries.length}</div>
                        <div className="stat-detail">Salary Records</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Today's Salary</div>
                        <div className="stat-value">₹ {formatCurrency(dailySalary)}</div>
                        <div className="stat-detail">Paid Today</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Weekly Salary</div>
                        <div className="stat-value">₹ {formatCurrency(weeklySalary)}</div>
                        <div className="stat-detail">7 Days Total</div>
                    </div>

                    <div className="stat-card highlight">
                        <div className="stat-label">Total Salary Paid</div>
                        <div className="stat-value">₹ {formatCurrency(totalFinalSalary)}</div>
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

                    {/* Text Input Filters */}
                    <div className="text-filter-row">
                        <div className="text-filter-item">
                            <label>Worker Name:</label>
                            <div className="text-filter-input-group">
                                <input
                                    type="text"
                                    placeholder="Search by worker name..."
                                    value={workerFilter}
                                    onChange={(e) => setWorkerFilter(e.target.value)}
                                    className="text-filter-input"
                                />
                                {workerFilter && (
                                    <button
                                        className="clear-text-filter-btn"
                                        onClick={clearWorkerFilter}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-filter-item">
                            <label>Work Type:</label>
                            <div className="text-filter-input-group">
                                <input
                                    type="text"
                                    placeholder="Search by work type..."
                                    value={workTypeFilter}
                                    onChange={(e) => setWorkTypeFilter(e.target.value)}
                                    className="text-filter-input"
                                />
                                {workTypeFilter && (
                                    <button
                                        className="clear-text-filter-btn"
                                        onClick={clearWorkTypeFilter}
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
                                setWorkerFilter("");
                                setWorkTypeFilter("");
                                setPaymentFilter("");
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
                    <h3>Salary Records ({filteredSalaries.length} entries)</h3>

                </div>

                <div className="table-container">
                    <table className="salary-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Worker Name</th>
                                <th>Work Type</th>
                                <th>Base Salary (₹)</th>
                                <th>Total Leaves</th>
                                <th>Per Leave Deduction (₹)</th>
                                <th>Total Deduction (₹)</th>
                                <th>Final Salary (₹)</th>
                                <th>Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSalaries.length > 0 ? (
                                filteredSalaries.map((salary) => (
                                    <tr key={salary.id}>
                                        <td>{salary.date}</td>
                                        <td className="worker-cell">
                                            <span className="worker-badge">{salary.workerName}</span>
                                        </td>
                                        <td className="work-type-cell">
                                            <span className={`work-type-badge ${salary.workType.toLowerCase()}`}>
                                                {salary.workType}
                                            </span>
                                        </td>
                                        <td className="base-cell">₹ {formatCurrency(salary.baseSalary)}</td>
                                        <td className="leaves-cell">{salary.totalLeaves}</td>
                                        <td className="per-leave-cell">₹ {salary.perLeaveDeduction}</td>
                                        <td className="deduction-cell">₹ {formatCurrency(salary.totalDeduction)}</td>
                                        <td className="final-cell">₹ {formatCurrency(salary.finalSalary)}</td>
                                        <td className="payment-cell">
                                            <span className={`payment-badge ${salary.paymentMode.toLowerCase()}`}>
                                                {salary.paymentMode}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="no-data">
                                        No salary records found for the selected filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Summary */}
                {filteredSalaries.length > 0 && (
                    <div className="table-footer">
                        <div className="footer-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total Entries</span>
                                <span className="summary-value">{filteredSalaries.length}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Base Salary</span>
                                <span className="summary-value base">₹ {formatCurrency(totalBaseSalary)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Deduction</span>
                                <span className="summary-value deduction">₹ {formatCurrency(totalDeduction)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Final Salary</span>
                                <span className="summary-value final">₹ {formatCurrency(totalFinalSalary)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalaryView;