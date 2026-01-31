import React from 'react'
import Dashboard from './Dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import KachaMaal from './KaachaMaal Add/KachaMaal'
import PakkaMaal from './PakkaMaal Add/PakkaMaal'
import Expense from './Expense (kharch)/Expense'
import Vehicle from './Vehicle (gaadi)/Vehicle'
import Sales from './Sales (vechaan)/Sales'
import ProfitReport from './ProfitReports/ProfitReport'
import Navbar from './Components/Navbar'
import Salary from './Salary/Salary'
import Party from './Partyes/Party'
import KachaMaalView from './KaachaMaal Add/KachaMaalView'
import ExpenseView from './Expense (kharch)/ExpenseView'
import SalesView from './Sales (vechaan)/SalesView'
import VehicleView from './Vehicle (gaadi)/VehicleView'
import SalaryView from './Salary/SalaryView'

import './App.css'
import ScrollToTop from './Components/ScrollToTop'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />

          <Route path='/kaachamaal_add' element={<KachaMaal />} />
          <Route path='/kaachamaal_view' element={<KachaMaalView />} />
          <Route path='/pakkamaal_add' element={<PakkaMaal />} />

          <Route path='/expense_add' element={<Expense />} />
          <Route path='/expense_view' element={<ExpenseView />} />

          <Route path='/vehicle_add' element={<Vehicle />} />
          <Route path='/vehicle_view' element={<VehicleView />} />

          <Route path='/sales_add' element={<Sales />} />
          <Route path='/sales_view' element={<SalesView />} />

          <Route path='/salary_add' element={<Salary />} />
          <Route path='/salary_view' element={<SalaryView />} />

          <Route path='/profit_report' element={<ProfitReport />} />

          <Route path='/partyes' element={<Party />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
