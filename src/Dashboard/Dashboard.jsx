// Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
       

            {/* Main Actions Section - Big Buttons */}
            <div className="section main-actions">
                <h2 className="section-title">🏃 Quick Actions</h2>
                <div className="main-button-grid">
                    {/* Big Highlighted Buttons */}
                    <Link to="/kaachamaal_add" className="main-btn highlight-primary">
                        <div className="main-btn-icon">🛒</div>
                        <div className="main-btn-content">
                            <h3>Kacha Maal Purchase</h3>
                        </div>
                    </Link>

                    <Link to="/pakkamaal_add" className="main-btn highlight-secondary">
                        <div className="main-btn-icon">📦</div>
                        <div className="main-btn-content">
                            <h3>Pakka Maal Purchase</h3>
                        </div>
                    </Link>

                    <Link to="/expense_add" className="main-btn highlight-accent">
                        <div className="main-btn-icon">💰</div>
                        <div className="main-btn-content">
                            <h3>Expense Entry</h3>
                        </div>
                    </Link>

                    <Link to="/sales_add" className="main-btn">
                        <div className="main-btn-icon">📊</div>
                        <div className="main-btn-content">
                            <h3>Sales Entry</h3>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Secondary Actions Section */}
            <div className="section secondary-actions">
                <h2 className="section-title">📝 Other Entries</h2>
                <div className="secondary-button-grid">
                    <Link to="/vehicle_add" className="secondary-btn">
                        <span className="secondary-btn-icon">🚚</span>
                        <span className="secondary-btn-text">Vehicle Entry</span>
                    </Link>

                    <Link to="/salary_add" className="secondary-btn">
                        <span className="secondary-btn-icon">👷</span>
                        <span className="secondary-btn-text">Salary Entry</span>
                    </Link>

                    <Link to="/partyes" className="secondary-btn">
                        <span className="secondary-btn-icon">👥</span>
                        <span className="secondary-btn-text">Party Management</span>
                    </Link>
                </div>
            </div>

            {/* View Records Section */}
            <div className="section view-section">
                <h2 className="section-title">👁️ View Records</h2>
                <div className="view-button-grid">
                    <Link to="/kaachamaal_view" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📋</span>
                            <span>Maal Na Records</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link>

                    <Link to="/expense_view" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📋</span>
                            <span>Expense Records</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link>

                    <Link to="/sales_view" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📋</span>
                            <span>Sales Records</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link>

                    <Link to="/vehicle_view" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📋</span>
                            <span>Vehicle Records</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link>

                    <Link to="/salary_view" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📋</span>
                            <span>Salary Records</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link>

                    {/* <Link to="/profit_report" className="view-btn">
                        <div className="view-btn-content">
                            <span className="view-btn-icon">📈</span>
                            <span>Profit Report</span>
                        </div>
                        <span className="view-btn-arrow">→</span>
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;