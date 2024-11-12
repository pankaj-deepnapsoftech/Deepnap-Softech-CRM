import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CRMPanel from './components/CRMPanel';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Customers/Customer';
import Peoples from './components/Peoples/Peoples';
import Companies from './components/Companies/Companies';
import ExpenseCategory from './components/Expense Category/ExpenseCategory';
import Expenses from './components/Expenses/Expenses';
import ProductCategory from './components/Product Category/ProductCategory';
import Products from './components/Products/Products';
import Leads from './components/Leads/Leads';
import Offers from './components/Offers/Offers';
import Invoices from './components/Invoices/Invoices';
import ProformaInvoices from './components/Proforma Invoices/ProformaInvoices';
import Payments from './components/Payments/Payments';
import NotFound from './components/NotFound';
import Register from './components/Register';
import Admins from './components/Admins/Admins';
import Reports from './components/Reports/Reports';
import AssignedLeads from './components/Leads/AssignedLeads';
import WebsiteConfiguration from './components/Website Configuration/WebsiteConfiguration';
import Support from './components/Support/Support';
import IndiamartLeads from './components/Indiamart Leads/IndiamartLeads';
import Settings from './components/Settings/Settings';
import AccountSettings from './components/Settings/AccountSettings';
import CompanySettings from './components/Settings/CompanySettings';
import CompanyLogo from './components/Settings/CompanyLogo';
import PDFSetting from './components/Settings/PDFSetting';
import FinanceSettings from './components/Settings/FinanceSettings';
import AssignedSupport from './components/Support/AssignedSupport';
import Users from './components/Users/Users';

function App() {

  return (
    <div>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/crm' element={<CRMPanel />}>
              <Route index element={<Dashboard />} />
              <Route path='admins' element={<Admins />} />
              <Route path='customers' element={<Customers />} />
              <Route path='individuals' element={<Peoples />} />
              <Route path='customers' element={<Companies />} />
              <Route path='users' element={<Users />} />
              <Route path='corporates' element={<Companies />} />
              <Route path='leads' element={<Leads />} />
              <Route path='indiamart-leads' element={<IndiamartLeads />} />
              <Route path='assigned-leads' element={<AssignedLeads />} />
              <Route path='offers' element={<Offers />} />
              <Route path='invoices' element={<Invoices />} />
              <Route path='proforma-invoices' element={<ProformaInvoices />} />
              <Route path='payments' element={<Payments />} />
              <Route path='products' element={<Products />} />
              <Route path='products-category' element={<ProductCategory />} />
              <Route path='expenses' element={<Expenses />} />
              <Route path='expenses-category' element={<ExpenseCategory />} />
              <Route path='report' element={<Reports />} />
              <Route path='website-configuration' element={<WebsiteConfiguration />} />
              <Route path='settings' element={<Settings />}>
                <Route index element={<AccountSettings />} />
                <Route path='company-settings' element={<CompanySettings />} />
                <Route path='company-logo' element={<CompanyLogo />} />
                <Route path='pdf-settings' element={<PDFSetting />} />
                <Route path='finance-settings' element={<FinanceSettings />} />
              </Route>
              <Route path='support' element={<Support />} />
              <Route path='assigned-support' element={<AssignedSupport />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
