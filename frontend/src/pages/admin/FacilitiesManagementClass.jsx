import React from 'react';
import { Building2, Star, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import BaseAdminManagement from '../../components/admin/BaseAdminManagement';
import apiService from '../../services/apiService';

/**
 * Facilities Management Class Component
 * Extends BaseAdminManagement for facility-specific functionality
 */
class FacilitiesManagement extends BaseAdminManagement {
  constructor(props) {
    super(props);
  }

  // Abstract method implementations
  getApiEndpoint() {
    return 'facilities';
  }

  getPageTitle() {
    return 'Facilities Management';
  }

  getPageDescription() {
    return 'Manage Hotel Amenities & Services';
  }

  getInitialFormData() {
    return {
      name: '',
      description: '',
      icon: ''
    };
  }

  mapApiResponse(apiData) {
    console.log('Raw API Data (Facilities):', apiData);
    
    const mappedData = Array.isArray(apiData) ? apiData.map(item => ({
      id: item.id,
      name: item.facilityName || item.name || 'Unknown Facility',
      description: item.description || '',
      icon: item.iconUrl || item.icon || 'default'
    })) : [];
    
    console.log('Mapped Facilities Data:', mappedData);
    return mappedData;
  }

  getItemName() {
    return 'Facility';
  }

  getActiveCount() {
    // All facilities are considered active
    return this.state.data.length;
  }

  getMockData() {
    return [
      { id: 1, name: 'Swimming Pool', description: 'Outdoor infinity pool with city view', icon: 'pool' },
      { id: 2, name: 'Fitness Center', description: '24/7 gym with modern equipment', icon: 'fitness' },
      { id: 3, name: 'Spa & Wellness', description: 'Full-service spa and massage therapy', icon: 'spa' },
      { id: 4, name: 'Restaurant', description: 'Fine dining restaurant with international cuisine', icon: 'restaurant' },
      { id: 5, name: 'Business Center', description: 'Meeting rooms and business services', icon: 'business' },
    ];
  }

  // Icon mapping
  getIconComponent(icon) {
    const icons = {
      pool: Building2,
      fitness: Star,
      spa: CheckCircle2,
      restaurant: Star,
      business: Star,
      default: Building2
    };
    const Icon = icons[icon] || Star;
    return <Icon size={24} />;
  }

  // Stats icon override
  renderStatsIcon(type) {
    switch (type) {
      case 'total':
        return <Building2 className="w-8 h-8 text-amber-400" />;
      case 'active':
        return <CheckCircle2 className="w-8 h-8 text-emerald-300" />;
      case 'search':
        return <Star className="w-8 h-8 text-amber-300" />;
      default:
        return <Building2 className="w-8 h-8 text-current" />;
    }
  }

  // Empty state icon
  renderEmptyIcon() {
    return <Building2 className="w-20 h-20 text-slate-300" />;
  }

  // Form fields override
  renderFormFields() {
    const { formData } = this.state;
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Facility Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => this.handleInputChange('name', e.target.value)}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., Swimming Pool, Fitness Center"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => this.handleInputChange('description', e.target.value)}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white resize-none"
            rows={3}
            placeholder="Describe the facility..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Icon Identifier
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => this.handleInputChange('icon', e.target.value)}
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g., pool, fitness, spa"
          />
        </div>
      </>
    );
  }

  // Data grid override
  renderDataGrid() {
    const filteredData = this.getFilteredData();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-3 gap-8">
        {filteredData.map((facility) => (
          <div
            key={facility.id}
            className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Header with Icon */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                    {this.getIconComponent(facility.icon)}
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                  {facility.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {facility.description || 'No description'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 bg-white">
              <div className="flex space-x-1">
                <button
                  onClick={() => this.handleEdit(facility)}
                  className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Edit Facility"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => this.handleDeleteClick(facility)}
                  className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Delete Facility"
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
const FacilitiesManagementWrapper = (props) => {
  return <FacilitiesManagement {...props} apiService={apiService} />;
};

export default FacilitiesManagementWrapper;
