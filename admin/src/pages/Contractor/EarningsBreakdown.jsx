import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const EarningsBreakdown = ({ appointments, onClose }) => {
  const { slotDateFormat, currency } = useContext(AppContext);

  const completedAppointments = appointments.filter(a => a.isCompleted);

  const exportCSV = () => {
    const headers = ["Client", "Date", "Time", "Amount", "Payment"];
    const rows = completedAppointments.map((item) => [
      item.userData.name,
      slotDateFormat(item.slotDate),
      item.slotTime,
      `${currency}${item.amount}`,
      item.payment ? "Online" : "Cash"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "earnings_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Earnings Breakdown</h2>

        <button
          onClick={exportCSV}
          className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Download CSV
        </button>

        <div className="max-h-[60vh] overflow-y-auto">
          {completedAppointments.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-3 text-sm">
              <div>
                <p className="font-medium">{item.userData.name}</p>
                <p className="text-gray-500">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">{currency}{item.amount}</p>
                <p className="text-xs text-gray-400">{item.payment ? "Online" : "Cash"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsBreakdown;
