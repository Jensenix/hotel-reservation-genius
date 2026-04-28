import React from 'react';
import { Coffee, Car, Utensils, Bell, Gift, Edit2, Trash2 } from 'lucide-react';
import BaseAdminManagement from '../../components/admin/BaseAdminManagement';
import apiService from '../../services/apiService';

/**
 * Extra Services Management Class Component
 * Extends BaseAdminManagement for service-specific functionality
 */
class ExtraServicesManagement extends BaseAdminManagement {
  constructor(props) {
    super(props);
  }

  // Abstract method implementations
  getApiEndpoint() {
    return 'extraServices';
  }

  getPageTitle() {
    return 'Extra Services Management';
  }

  getPageDescription() {
    return 'Manage Additional Services & Amenities';
  }

  getInitialFormData() {
    return {
      serviceName: '',
      description: '',
      price: '',
      iconUrl: ''
    };
  }

  getFormDataFromItem(item) {
    return {
      serviceName: item.name || item.serviceName || '',
      description: item.description || '',
      price: item.price || '',
      iconUrl: item.icon || item.iconUrl || ''
    };
  }

  mapApiResponse(apiData) {
    console.log('🔍 Raw API Data (Extra Services):', apiData);
    
    const mappedData = Array.isArray(apiData) ? apiData.map(item => ({
      id: item.id,
      name: item.serviceName || item.name || 'Unknown Service',
      description: item.description || '',
      price: parseFloat(item.price) || 0,
      icon: item.iconUrl || item.icon || 'default'
    })) : [];
    
    console.log('✅ Mapped Services Data:', mappedData.length, 'items');
    return mappedData;
  }

  getItemName() {
    return 'Service';
  }

  getActiveCount() {
    // All services are considered active
    return this.state.data.length;
  }

  getMockData() {
    return [
      { id: 1, name: 'Room Service', description: '24/7 in-room dining service', price: 5.00, icon: 'room_service' },
      { id: 2, name: 'Airport Transfer', description: 'Private airport pickup and drop-off', price: 25.00, icon: 'transfer' },
      { id: 3, name: 'Spa Package', description: 'Full body massage and wellness treatment', price: 120.00, icon: 'spa' },
      { id: 4, name: 'Laundry Service', description: 'Professional laundry and dry cleaning', price: 15.00, icon: 'laundry' },
      { id: 5, name: 'Breakfast Buffet', description: 'International breakfast buffet', price: 18.00, icon: 'breakfast' },
      { id: 6, name: 'City Tour', description: 'Guided city tour with transportation', price: 45.00, icon: 'tour' },
    ];
  }

  // Utility method for currency formatting
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Icon mapping
  getIconComponent(icon) {
    const icons = {
      room_service: Coffee,
      transfer: Car,
      spa: Utensils,
      laundry: Bell,
      breakfast: Coffee,
      tour: Gift,
      default: Coffee
    };
    const Icon = icons[icon] || Coffee;
    return <Icon size={24} />;
  }

  // Stats icon override
  renderStatsIcon(type) {
    switch (type) {
      case 'total':
        return <Coffee className="w-8 h-8 text-amber-400" />;
      case 'active':
        return <Gift className="w-8 h-8 text-emerald-300" />;
      case 'search':
        return <Utensils className="w-8 h-8 text-amber-300" />;
      default:
        return <Coffee className="w-8 h-8 text-current" />;
    }
  }

  // Empty state icon
  renderEmptyIcon() {
    return <Coffee className="w-20 h-20 text-slate-300" />;
  }

  // Form fields override
  renderFormFields() {
    const { formData } = this.state;
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Service Name
          </label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) => {
              console.log('🔍 Service Name changed:', e.target.value);
              this.handleInputChange('serviceName', e.target.value);
            }}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., Room Service, Airport Transfer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              console.log('🔍 Description changed:', e.target.value);
              this.handleInputChange('description', e.target.value);
            }}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white resize-none"
            rows={3}
            placeholder="Describe the service..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => this.handleInputChange('price', e.target.value)}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Icon URL
          </label>
          <input
            type="text"
            value={formData.iconUrl}
            onChange={(e) => {
              console.log('🔍 Icon URL changed:', e.target.value);
              this.handleInputChange('iconUrl', e.target.value);
            }}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., room_service, transfer, spa"
          />
        </div>
      </>
    );
  }

  // Data grid override
  renderDataGrid() {
    const filteredData = this.getFilteredData();
    
    return (
      <div className="grid grid-cols-1 md:col-span-2 lg:col-span-3 gap-8">
        {filteredData.map((service) => (
          <div
            key={service.id}
            className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Header with Icon and Price */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-emerald-400">
                    {this.getIconComponent(service.icon)}
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Price</p>
                    <p className="text-white text-2xl font-light">{this.formatCurrency(service.price)}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                  {service.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {service.description || 'No description'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 bg-white">
              <div className="flex space-x-1">
                <button
                  onClick={() => this.handleEdit(service)}
                  className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Edit Service"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => this.handleDeleteClick(service)}
                  className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Delete Service"
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
const ExtraServicesManagementWrapper = (props) => {
  return <ExtraServicesManagement {...props} apiService={apiService} />;
};

export default ExtraServicesManagementWrapper;
