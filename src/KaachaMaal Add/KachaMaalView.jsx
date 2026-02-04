import React, { useState, useEffect } from "react";
import "./KachaMaalView.css";

const MaalView = () => {
  // Sample data with both Kacha and Paaka Maal entries - Updated to match new form structure
  const initialEntries = [
    // Kacha Maal entries
    { id: 1, date: "2026-01-30", receiptNo: 102030, supplier: "Ravi Traders", maalType: "kacha", quantity: 100, total: 15000 },
    { id: 2, date: "2026-01-31", receiptNo: 222030, supplier: "Shree Cotton", maalType: "kacha", quantity: 50, total: 8000 },
    { id: 3, date: "2026-01-28", receiptNo: 102029, supplier: "Patel Supplier", maalType: "kacha", quantity: 75, total: 10875 },
    { id: 4, date: "2026-01-25", receiptNo: 102028, supplier: "Royal Cotton", maalType: "kacha", quantity: 120, total: 18600 },
    { id: 5, date: "2026-01-20", receiptNo: 102027, supplier: "Mahesh Cotton Works", maalType: "kacha", quantity: 90, total: 13320 },

    // Paaka Maal entries
    { id: 6, date: "2026-01-30", receiptNo: 202030, supplier: "Ravi Traders", maalType: "paaka", quantity: 80, total: 14400 },
    { id: 7, date: "2026-01-31", receiptNo: 322030, supplier: "Shree Cotton", maalType: "paaka", quantity: 45, total: 8550 },
    { id: 8, date: "2026-02-01", receiptNo: 222031, supplier: "Gujarat Cotton", maalType: "paaka", quantity: 60, total: 11100 },
    { id: 9, date: "2026-02-02", receiptNo: 222032, supplier: "Ravi Traders", maalType: "paaka", quantity: 110, total: 19250 },
    { id: 10, date: "2026-02-03", receiptNo: 222033, supplier: "Shree Cotton", maalType: "paaka", quantity: 40, total: 7800 },
    { id: 11, date: "2026-02-04", receiptNo: 222034, supplier: "Patel Supplier", maalType: "paaka", quantity: 95, total: 17575 },
  ];

  const [entries, setEntries] = useState(initialEntries);
  const [filteredEntries, setFilteredEntries] = useState(initialEntries);

  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [specificDate, setSpecificDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("supplier");
  const [maalTypeFilter, setMaalTypeFilter] = useState("all"); // all, kacha, paaka

  // Statistics
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [kachaQuantity, setKachaQuantity] = useState(0);
  const [kachaAmount, setKachaAmount] = useState(0);
  const [paakaQuantity, setPaakaQuantity] = useState(0);
  const [paakaAmount, setPaakaAmount] = useState(0);

  // Filter by Maal Type
  const filterByMaalType = (data) => {
    if (maalTypeFilter === "all") return data;
    return data.filter(entry => entry.maalType === maalTypeFilter);
  };

  // Filter by date range
  const filterEntriesByDate = (data) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = [...data];

    if (dateFilter === "daily") {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getTime() === today.getTime();
      });
    } else if (dateFilter === "weekly") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= oneWeekAgo && entryDate <= today;
      });
    } else if (dateFilter === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfMonth && entryDate <= today;
      });
    } else if (dateFilter === "specific" && specificDate) {
      filtered = filtered.filter(entry => entry.date === specificDate);
    }

    return filtered;
  };

  // Apply search filter
  const applySearchFilter = (data) => {
    if (!searchTerm.trim()) return data;

    return data.filter(entry => {
      if (searchType === "supplier") {
        return entry.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "receipt") {
        return entry.receiptNo.toString().includes(searchTerm);
      }
      return true;
    });
  };

  // Calculate statistics
  const calculateStatistics = (data) => {
    const quantity = data.reduce((sum, entry) => sum + entry.quantity, 0);
    const amount = data.reduce((sum, entry) => sum + entry.total, 0);

    const kachaEntries = data.filter(entry => entry.maalType === "kacha");
    const paakaEntries = data.filter(entry => entry.maalType === "paaka");

    const kachaQty = kachaEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    const kachaAmt = kachaEntries.reduce((sum, entry) => sum + entry.total, 0);

    const paakaQty = paakaEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    const paakaAmt = paakaEntries.reduce((sum, entry) => sum + entry.total, 0);

    setTotalQuantity(quantity);
    setTotalAmount(amount);
    setKachaQuantity(kachaQty);
    setKachaAmount(kachaAmt);
    setPaakaQuantity(paakaQty);
    setPaakaAmount(paakaAmt);
  };

  // Apply all filters
  useEffect(() => {
    let result = filterByMaalType(entries);
    result = filterEntriesByDate(result);
    result = applySearchFilter(result);
    setFilteredEntries(result);
    calculateStatistics(result);
  }, [maalTypeFilter, dateFilter, specificDate, searchTerm, searchType, entries]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    if (filter !== "specific") {
      setSpecificDate("");
    }
  };

  // Handle specific date change
  const handleSpecificDateChange = (e) => {
    setSpecificDate(e.target.value);
    setDateFilter("specific");
  };

  // Handle Maal Type filter change
  const handleMaalTypeChange = (type) => {
    setMaalTypeFilter(type);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm("");
  };

  // Get date range label
  const getDateRangeLabel = () => {
    switch (dateFilter) {
      case "daily": return "Today";
      case "weekly": return "Last 7 Days";
      case "monthly": return "This Month";
      case "specific": return specificDate ? `Date: ${specificDate}` : "Select Date";
      default: return "All Time";
    }
  };

  // Get Maal Type label
  const getMaalTypeLabel = () => {
    switch (maalTypeFilter) {
      case "kacha": return "Kacha Maal";
      case "paaka": return "Paaka Maal";
      default: return "All Maal Types";
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Format Maal Type for display
  const formatMaalType = (type) => {
    return type === "kacha" ? "Kaacho Maal" : "Paaka Maal";
  };

  return (
    <div className="view-container">
      <div className="header-section">
        <h2>Maal Entries (Kacha & Paaka)</h2>

        {/* Maal Type Filter */}
        <div className="maal-type-filter">
          <div className="filter-label">Filter by Maal Type:</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${maalTypeFilter === "all" ? "active" : ""}`}
              onClick={() => handleMaalTypeChange("all")}
            >
              All Maal
            </button>
            <button
              className={`filter-btn kacha-btn ${maalTypeFilter === "kacha" ? "active" : ""}`}
              onClick={() => handleMaalTypeChange("kacha")}
            >
              Kacha Maal
            </button>
            <button
              className={`filter-btn paaka-btn ${maalTypeFilter === "paaka" ? "active" : ""}`}
              onClick={() => handleMaalTypeChange("paaka")}
            >
              Paaka Maal
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Entries</div>
            <div className="summary-value">{filteredEntries.length}</div>
            <div className="summary-period">{getMaalTypeLabel()}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Quantity</div>
            <div className="summary-value">{totalQuantity.toFixed(2)} Kg</div>
            <div className="summary-period">
              K: {kachaQuantity.toFixed(2)} | P: {paakaQuantity.toFixed(2)}
            </div>
          </div>

          <div className="summary-card highlight">
            <div className="summary-label">Total Amount</div>
            <div className="summary-value">₹ {formatCurrency(totalAmount)}</div>
            <div className="summary-period">
              K: ₹{formatCurrency(kachaAmount)} | P: ₹{formatCurrency(paakaAmount)}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          {/* Date Filter Buttons */}
          <div className="filter-group">
            <div className="filter-label">Filter by Date:</div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${dateFilter === "all" ? "active" : ""}`}
                onClick={() => handleDateFilterChange("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${dateFilter === "daily" ? "active" : ""}`}
                onClick={() => handleDateFilterChange("daily")}
              >
                Daily
              </button>
              <button
                className={`filter-btn ${dateFilter === "weekly" ? "active" : ""}`}
                onClick={() => handleDateFilterChange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`filter-btn ${dateFilter === "monthly" ? "active" : ""}`}
                onClick={() => handleDateFilterChange("monthly")}
              >
                Monthly
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
                    className="clear-date-btn"
                    onClick={() => {
                      setSpecificDate("");
                      setDateFilter("all");
                    }}
                  >
                    Clear Date
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-type">
              <button
                className={`search-type-btn ${searchType === "supplier" ? "active" : ""}`}
                onClick={() => handleSearchTypeChange("supplier")}
              >
                Search by Supplier
              </button>
              <button
                className={`search-type-btn ${searchType === "receipt" ? "active" : ""}`}
                onClick={() => handleSearchTypeChange("receipt")}
              >
                Search by Receipt No.
              </button>
            </div>

            <div className="search-input-group">
              <input
                type="text"
                placeholder={searchType === "supplier" ? "Enter supplier name..." : "Enter receipt number..."}
                value={searchTerm}
                onChange={handleSearch}
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
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="view-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Receipt No.</th>
              <th>Supplier</th>
              <th>Maal Type</th>
              <th>Quantity (Kg)</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td className="receipt-cell">{entry.receiptNo}</td>
                  <td className="supplier-cell">{entry.supplier}</td>
                  <td className={`maal-type-cell ${entry.maalType}`}>
                    <span className={`maal-type-badge ${entry.maalType}`}>
                      {formatMaalType(entry.maalType)}
                    </span>
                  </td>
                  <td className="quantity-cell">{entry.quantity.toFixed(2)}</td>
                  <td className="total-cell">₹ {formatCurrency(entry.total)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  {dateFilter === "specific" && !specificDate
                    ? "Please select a date to filter"
                    : "No entries found for the selected filters"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer with totals */}
        {filteredEntries.length > 0 && (
          <div className="table-footer">
            <div className="footer-totals">
              <span>Showing {filteredEntries.length} entries | Type: {getMaalTypeLabel()}</span>
              <span>Kacha Qty: <strong>{kachaQuantity.toFixed(2)} Kg</strong></span>
              <span>Paaka Qty: <strong>{paakaQuantity.toFixed(2)} Kg</strong></span>
              <span>Total Qty: <strong>{totalQuantity.toFixed(2)} Kg</strong></span>
              <span>Total Amt: <strong>₹ {formatCurrency(totalAmount)}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaalView;