import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
import { Input } from "@chakra-ui/react";
import Loading from "../ui/Loading";
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { allowedroutes, role } = useSelector((state) => state.auth);
  const [paymentStats, setPaymentStats] = useState(Array(12).fill(0));
  const [expenseStats, setExpenseStats] = useState(Array(12).fill(0));
  const [cookies, setCookies] = useCookies();
  const [year, setYear] = useState("2024");
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalUnpaidInvoiceAmount, setTotalUnpaidInvoiceAmount] = useState(0);
  const [totalProformaInvoiceAmount, setTotalProformaInvoiceAmount] =
    useState(0);
  const [totalOfferAmount, setTotalOfferAmount] = useState(0);

  const paymentOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Payment Report",
      },
    },
  };

  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expense Report",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const paymentData = {
    labels,
    datasets: [
      {
        label: "Payment",
        data: paymentStats,
        backgroundColor: "#2389ff",
      },
    ],
  };

  const expenseData = {
    labels,
    datasets: [
      {
        label: "Expense",
        data: expenseStats,
        backgroundColor: "#ff6f6f",
      },
    ],
  };

  const getPaymentReport = async (req, res) => {
    setPaymentStats(Array(12).fill(0));
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-payment-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: new Date(`${year}-01-01 00:00:00`),
            to: new Date(`${year}-12-31 11:59:59`),
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const results = Array(12).fill(0);
      data.payments.forEach((payment) => {
        results[+payment._id] = payment.total_amount;
      });
      setPaymentStats(results);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getExpenseReport = async (req, res) => {
    setPaymentStats(Array(12).fill(0));
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "report/get-expense-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: new Date(`${year}-01-01 00:00:00`),
            to: new Date(`${year}-12-31 11:59:59`),
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const results = Array(12).fill(0);
      data.expenses.forEach((expense) => {
        results[+expense._id] = expense.total_amount;
      });
      setExpenseStats(results);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAmountSummary = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(baseUrl + "dashboard/amount-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: new Date(`${year}-01-01 00:00:00`),
          toDate: new Date(`${year}-12-31 11:59:59`),
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setTotalInvoiceAmount(data.totalInvoiceAmount);
      setTotalUnpaidInvoiceAmount(data.totalUnpaidInvoiceAmount);
      setTotalProformaInvoiceAmount(data.totalProformaInvoiceAmount);
      setTotalOfferAmount(data.totalOfferAmount);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getPaymentReport();
    getExpenseReport();
    fetchAmountSummary();
  }, [year]);

  return (
    <>
      {(role !== 'Super Admin' && !allowedroutes.includes("lead")) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin for
          further action.
        </div>
      )}

      {(role === 'Super Admin' || allowedroutes.includes("report")) && (
        <div>
          <div>
            <div className="w-fit mt-2 mb-2 mr-0 ml-auto">
              <Input
                type="number"
                min="2000"
                max="2099"
                step="1"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b pb-4 font-bold text-[#22075e]">
                Invoices
              </h1>
              <div className="mt-4 font-bold font-bold text-[#595959]">
                <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Proforma Invoices
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#41ad5e] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalProformaInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Offers
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff8b46] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalOfferAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="text-xl border-b pb-4 font-bold text-[#22075e]">
                Unpaid Invoices
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalUnpaidInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Payment Report</h1>
                <div className="w-fit">
                  <Input
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <Bar options={paymentOptions} data={paymentData} />
            </div>
            <div>
              <div className="flex justify-between items-center mt-10">
                <h1 className="text-2xl">Expense Report</h1>
                <div className="w-fit">
                  <Input
                    type="number"
                    min="2000"
                    max="2099"
                    step="1"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <Bar options={expenseOptions} data={expenseData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
