import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    // Function to check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo">
                    <span className="logo-text">Bhavani Ginning</span>
                </div>

                <div className={`nav-links ${open ? "open" : ""}`}>
                    <Link
                        to="/"
                        className={`nav-link ${isActive("/") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/kaachamaal_add"
                        className={`nav-link ${isActive("/kaachamaal_add") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Kacha Maal
                    </Link>

                    <Link
                        to="/pakkamaal_add"
                        className={`nav-link ${isActive("/pakkamaal_add") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Pakka Maal
                    </Link>

                    <Link
                        to="/expense_add"
                        className={`nav-link ${isActive("/expense_add") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Expense
                    </Link>

                    <Link
                        to="/sales_add"
                        className={`nav-link ${isActive("/sales_add") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Sales
                    </Link>

                    <Link
                        to="/salary_add"
                        className={`nav-link ${isActive("/salary_add") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Salary
                    </Link>

                    {/* Highlighted Party Button */}
                    <Link
                        to="/partyes"
                        className={`nav-link party-btn ${isActive("/partyes") ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                    >
                        Party Management
                    </Link>
                </div>

                <div className="menu-icon" onClick={() => setOpen(!open)}>
                    ☰
                </div>
            </div>
        </nav>
    );
};

export default Navbar;