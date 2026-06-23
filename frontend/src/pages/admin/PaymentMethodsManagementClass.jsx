import React from 'react';
import {
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import BaseAdminManagement from '@/components/admin/BaseAdminManagement';
import apiService from '@/services/apiService';

/**
 * Payment Methods Management Class Component
 * Extends BaseAdminManagement for payment method-specific functionality
 */
class PaymentMethodsManagement extends BaseAdminManagement {
  constructor(props) {
    super(props);
  }

  // Abstract method implementations
  getApiEndpoint() {
    return 'paymentMethods';
  }

  getPageTitle() {
    return 'Payment Methods Management';
  }

  getPageDescription() {
    return 'Manage Payment Options & Gateways';
  }

  getInitialFormData() {
    return {
      methodName: '',
      accountNumber: '',
      isActive: true,
    };
  }

  getFormDataFromItem(item) {
    return {
      methodName: item.name || item.methodName || '',
      accountNumber: item.config || item.accountNumber || '',
      isActive: item.isActive !== false,
    };
  }

  mapApiResponse(apiData) {
    console.log('🔍 Raw API Data (Payment Methods):', apiData);

    const mappedData = Array.isArray(apiData)
      ? apiData.map((item) => ({
          id: item.id,
          name: item.methodName || item.name || 'Unknown Payment Method',
          description: item.description || '',
          type:
            item.type ||
            this.getPaymentTypeFromName(item.methodName || item.name),
          isActive: item.isActive !== false,
          config: item.accountNumber || item.config || 'N/A',
        }))
      : [];

    console.log('✅ Mapped Payment Methods Data:', mappedData.length, 'items');
    return mappedData;
  }

  getItemName() {
    return 'Payment Method';
  }

  getActiveCount() {
    return this.state.data.filter((method) => method.isActive).length;
  }

  getMockData() {
    return [
      {
        id: 1,
        name: 'Credit Card',
        type: 'card',
        description: 'Visa, MasterCard, American Express',
        isActive: true,
        config: 'stripe',
      },
      {
        id: 2,
        name: 'PayPal',
        type: 'wallet',
        description: 'PayPal and PayPal Credit',
        isActive: true,
        config: 'paypal',
      },
      {
        id: 3,
        name: 'Bank Transfer',
        type: 'bank',
        description: 'Direct bank transfer and wire',
        isActive: true,
        config: 'bank',
      },
      {
        id: 4,
        name: 'Apple Pay',
        type: 'mobile',
        description: 'Apple Pay and Apple Wallet',
        isActive: true,
        config: 'apple_pay',
      },
      {
        id: 5,
        name: 'Google Pay',
        type: 'mobile',
        description: 'Google Pay and Google Wallet',
        isActive: false,
        config: 'google_pay',
      },
      {
        id: 6,
        name: 'Cash on Arrival',
        type: 'cash',
        description: 'Pay cash when you arrive',
        isActive: true,
        config: 'cash',
      },
    ];
  }

  // Helper function to determine payment type from name
  getPaymentTypeFromName(name) {
    if (!name) return 'card';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('credit') || lowerName.includes('debit'))
      return 'card';
    if (lowerName.includes('paypal') || lowerName.includes('wallet'))
      return 'wallet';
    if (lowerName.includes('bank') || lowerName.includes('transfer'))
      return 'bank';
    if (
      lowerName.includes('apple') ||
      lowerName.includes('google') ||
      lowerName.includes('digital')
    )
      return 'mobile';
    if (lowerName.includes('cash')) return 'cash';
    return 'card';
  }

  // Icon mapping
  getIconComponent(type) {
    const icons = {
      card: CreditCard,
      wallet: Wallet,
      bank: Building,
      mobile: Smartphone,
      cash: Wallet,
    };
    const Icon = icons[type] || CreditCard;
    return <Icon size={24} />;
  }

  // Stats icon override
  renderStatsIcon(type) {
    switch (type) {
      case 'total':
        return <CreditCard className="w-8 h-8 text-amber-400" />;
      case 'active':
        return <CheckCircle2 className="w-8 h-8 text-emerald-300" />;
      case 'search':
        return <Wallet className="w-8 h-8 text-amber-300" />;
      default:
        return <CreditCard className="w-8 h-8 text-current" />;
    }
  }

  // Empty state icon
  renderEmptyIcon() {
    return <CreditCard className="w-20 h-20 text-slate-300" />;
  }

  // Form fields override
  renderFormFields() {
    const { formData } = this.state;

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Payment Method Name
          </label>
          <input
            type="text"
            value={formData.methodName}
            onChange={(e) => {
              console.log('🔍 Method Name changed:', e.target.value);
              this.handleInputChange('methodName', e.target.value);
            }}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., Credit Card, PayPal"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => {
              console.log('🔍 Account Number changed:', e.target.value);
              this.handleInputChange('accountNumber', e.target.value);
            }}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., 1234-5678-9012-3456"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Active Status
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => {
                console.log('🔍 Active Status changed:', e.target.checked);
                this.handleInputChange('isActive', e.target.checked);
              }}
              className="w-5 h-5 text-amber-500 border-2 border-slate-300 rounded focus:ring-amber-500"
            />
            <span className="text-slate-700">Enable this payment method</span>
          </label>
        </div>
      </>
    );
  }

  // Data grid override
  renderDataGrid() {
    const filteredData = this.getFilteredData();

    return (
      <div className="grid grid-cols-1 md:col-span-2 lg:col-span-3 gap-8">
        {filteredData.map((payment) => (
          <div
            key={payment.id}
            className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Header with Icon and Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-blue-400">
                    {this.getIconComponent(payment.type)}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${payment.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}
                    >
                      {payment.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-2 tracking-tight">
                  {payment.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {payment.description || 'No description'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-white">
              <div className="flex space-x-1">
                <button
                  onClick={() => this.handleEdit(payment)}
                  className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Edit Payment Method"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => this.handleDeleteClick(payment)}
                  className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Delete Payment Method"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

// Wrapper component to pass apiService
const PaymentMethodsManagementWrapper = (props) => {
  return <PaymentMethodsManagement {...props} apiService={apiService} />;
};

export default PaymentMethodsManagementWrapper;
