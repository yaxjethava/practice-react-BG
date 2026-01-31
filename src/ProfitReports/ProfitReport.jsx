import React from "react";
import "./ProfitReport.css";


const ProfitReport = () => {
    return (
        <div className="profit-container">
            <h2>📊 Profit / Report</h2>


            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="card green">
                    <h3>Total Sales</h3>
                    <p>₹ 1,25,000</p>
                </div>
                <div className="card red">
                    <h3>Total Expenses</h3>
                    <p>₹ 75,000</p>
                </div>
                <div className="card blue">
                    <h3>Net Profit</h3>
                    <p>₹ 50,000</p>
                </div>
            </div>


            {/* Filters */}
            <div className="filters">
                <input type="date" />
                <input type="date" />
                <button>Filter</button>
            </div>


            {/* Report Table */}
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sales</th>
                        <th>Expense</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10-01-2026</td>
                        <td>₹ 20,000</td>
                        <td>₹ 12,000</td>
                        <td className="profit">₹ 8,000</td>
                    </tr>
                    <tr>
                        <td>11-01-2026</td>
                        <td>₹ 30,000</td>
                        <td>₹ 18,000</td>
                        <td className="profit">₹ 12,000</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default ProfitReport;