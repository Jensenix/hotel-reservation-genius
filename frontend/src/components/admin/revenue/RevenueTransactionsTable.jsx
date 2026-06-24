import { formatCurrency, formatDate } from '@/utils/formatters';
import PropTypes from 'prop-types';

const RevenueTransactionsTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Recent Transactions</h3>
        <p className="text-sm text-slate-500">Latest payments (by payment date)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                  #{transaction.bookingId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {transaction.guest}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(transaction.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RevenueTransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.string.isRequired,
        bookingId: PropTypes.string.isRequired,
        guest: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        status: PropTypes.oneOf(['paid', 'pending']).isRequired,
        date: PropTypes.string.isRequired,
    })
  ).isRequired,
};


export default RevenueTransactionsTable;