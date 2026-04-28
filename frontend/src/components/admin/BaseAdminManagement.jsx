import React from 'react';
import AdminLayout from '../layout/AdminLayout';
import Modal from '../common/Modal';
import { Plus, Search } from 'lucide-react';

/**
 * Base Class for all Admin Management Pages
 * Provides common CRUD functionality and UI patterns
 */
class BaseAdminManagement extends React.Component {
  constructor(props) {
    super(props);
    
    // Common state for all admin pages
    this.state = {
      data: [],
      loading: true,
      error: null,
      searchTerm: '',
      showModal: false,
      showDeleteModal: false,
      editingItem: null,
      deleteTarget: null,
      formData: this.getInitialFormData()
    };
    
    // No manual binding needed - using arrow functions for all methods
  }

  // Abstract methods to be implemented by child classes
  getApiEndpoint() {
    throw new Error('getApiEndpoint() must be implemented by child class');
  }

  getPageTitle() {
    throw new Error('getPageTitle() must be implemented by child class');
  }

  getPageDescription() {
    throw new Error('getPageDescription() must be implemented by child class');
  }

  getInitialFormData() {
    throw new Error('getInitialFormData() must be implemented by child class');
  }

  mapApiResponse(apiData) {
    throw new Error('mapApiResponse() must be implemented by child class');
  }

  renderDataGrid() {
    throw new Error('renderDataGrid() must be implemented by child class');
  }

  renderFormFields() {
    throw new Error('renderFormFields() must be implemented by child class');
  }

  getFormTitle() {
    return this.state.editingItem ? `Update ${this.getItemName()}` : `Add ${this.getItemName()}`;
  }

  getItemName() {
    return 'Item';
  }

  // Common lifecycle methods
  async componentDidMount() {
    await this.fetchData();
  }

  // Common data operations
  async fetchData() {
    try {
      console.log(`🔄 Fetching data for ${this.getPageTitle()}...`);
      this.setState({ loading: true, error: null });
      const endpoint = this.getApiEndpoint();
      const response = await this.props.apiService[endpoint].getAll();
      
      console.log(`🔍 Raw API Response:`, response);
      console.log(`🔍 Response Data:`, response.data);
      
      // Handle different response structures
      let dataToMap = response.data;
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        dataToMap = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        dataToMap = response.data;
      }
      
      const mappedData = this.mapApiResponse(dataToMap || []);
      this.setState({ data: mappedData, loading: false });
      
      console.log(`✅ ${this.getPageTitle()} - Data loaded:`, mappedData.length, 'items');
    } catch (error) {
      console.error(`❌ Error fetching ${this.getPageTitle()}:`, error);
      this.setState({ error, loading: false });
      
      // Fallback to mock data if API fails
      const mockData = this.getMockData();
      if (mockData) {
        console.log(`🔄 Using mock data:`, mockData.length, 'items');
        this.setState({ data: mockData, loading: false });
      }
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 handleSubmit called!');
    console.log('🔍 Form Data:', this.state.formData);
    console.log('🔍 Editing Item:', this.state.editingItem);
    console.log('🔍 Props API Service:', this.props.apiService);
    
    try {
      const endpoint = this.getApiEndpoint();
      console.log('🔍 Endpoint:', endpoint);
      
      const apiService = this.props.apiService[endpoint];
      console.log('🔍 API Service Object:', apiService);
      
      if (!apiService) {
        throw new Error(`API Service not found for endpoint: ${endpoint}`);
      }
      
      if (this.state.editingItem) {
        console.log('🔍 Calling update with:', this.state.editingItem.id, this.state.formData);
        const result = await apiService.update(this.state.editingItem.id, this.state.formData);
        console.log('🔍 Update result:', result);
      } else {
        console.log('🔍 Calling create with:', this.state.formData);
        const result = await apiService.create(this.state.formData);
        console.log('🔍 Create result:', result);
      }
      
      console.log('🔄 Closing modal and refreshing data...');
      this.closeModal();
      await this.fetchData();
      console.log('✅ Data refresh complete!');
    } catch (error) {
      console.error(`❌ Error saving ${this.getItemName()}:`, error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error status text:', error.response?.statusText);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Unknown error occurred';
      
      alert(`❌ Error saving ${this.getItemName()}: ${errorMessage}`);
    }
  }

  handleDelete = async () => {
    try {
      const endpoint = this.getApiEndpoint();
      await this.props.apiService[endpoint].delete(this.state.deleteTarget.id);
      
      this.closeDeleteModal();
      await this.fetchData();
    } catch (error) {
      console.error(`Error deleting ${this.getItemName()}:`, error);
      alert(`Error deleting ${this.getItemName()}: ` + (error.response?.data?.message || error.message));
    }
  }

  // Common event handlers
  handleSearch = (term) => {
    this.setState({ searchTerm: term });
  }

  handleAdd = () => {
    this.setState({
      showModal: true,
      editingItem: null,
      formData: this.getInitialFormData()
    });
  }

  handleEdit = (item) => {
    this.setState({
      showModal: true,
      editingItem: item,
      formData: this.getFormDataFromItem(item)
    });
  }

  handleDeleteClick = (item) => {
    this.setState({
      deleteTarget: item,
      showDeleteModal: true
    });
  }

  handleInputChange = (field, value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value
      }
    });
  }

  // Modal operations
  closeModal = () => {
    this.setState({
      showModal: false,
      editingItem: null,
      formData: this.getInitialFormData()
    });
  }

  closeDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
      deleteTarget: null
    });
  }

  // Utility methods
  getFormDataFromItem(item) {
    // Override in child classes if needed
    return { ...item };
  }

  getFilteredData() {
    const { data, searchTerm } = this.state;
    if (!searchTerm) return data;
    
    return data.filter(item =>
      item && item.name && 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getMockData() {
    // Override in child classes to provide mock data
    return null;
  }

  // Render methods
  renderLoading() {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  renderError() {
    const { error } = this.state;
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg mb-4">Error loading data</p>
        <p className="text-slate-500">{error?.message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  renderEmptyState() {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
        <div className="w-20 h-20 text-slate-300 mx-auto mb-6">
          {this.renderEmptyIcon()}
        </div>
        <p className="text-slate-500 text-lg mb-4">No {this.getItemName().toLowerCase()}s found</p>
        <button
          onClick={this.handleAdd}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First {this.getItemName()}
        </button>
      </div>
    );
  }

  renderEmptyIcon() {
    // Override in child classes
    return <div className="w-full h-full bg-slate-300 rounded-full"></div>;
  }

  renderHeader() {
    const { searchTerm } = this.state;
    
    return (
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                {this.getPageTitle()}
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
              Hotel <span className="font-semibold text-amber-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm tracking-wide">{this.getPageDescription()}</p>
          </div>
          <button
            onClick={this.handleAdd}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add {this.getItemName()}
          </button>
        </div>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${this.getItemName().toLowerCase()}s...`}
            value={searchTerm}
            onChange={(e) => this.handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
          />
        </div>
      </div>
    );
  }

  renderStats() {
    const { data } = this.state;
    const filteredData = this.getFilteredData();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-amber-500/20 rounded-2xl">
                {this.renderStatsIcon('total')}
              </div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-4xl font-light text-white mb-2">{data.length}</p>
            <p className="text-slate-400 text-sm">All {this.getItemName().toLowerCase()}s</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-2xl border border-emerald-500 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                {this.renderStatsIcon('active')}
              </div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Active</span>
            </div>
            <p className="text-4xl font-light text-white mb-2">{this.getActiveCount()}</p>
            <p className="text-emerald-100 text-sm">Currently active</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl shadow-2xl border border-amber-500 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                {this.renderStatsIcon('search')}
              </div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Filtered</span>
            </div>
            <p className="text-4xl font-light text-white mb-2">{filteredData.length}</p>
            <p className="text-amber-100 text-sm">Search results</p>
          </div>
        </div>
      </div>
    );
  }

  renderStatsIcon(type) {
    // Override in child classes
    return <div className="w-8 h-8 bg-current rounded-full"></div>;
  }

  getActiveCount() {
    // Override in child classes for specific active count logic
    return this.state.data.length;
  }

  renderModal() {
    const { showModal, editingItem, formData } = this.state;
    
    return (
      <Modal
        isOpen={showModal}
        onClose={this.closeModal}
        title={this.getFormTitle()}
      >
        <form onSubmit={(e) => {
            console.log('🔍 Form onSubmit triggered!');
            this.handleSubmit(e);
          }}>
          <div className="space-y-6">
            {this.renderFormFields()}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={this.closeModal}
              className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
            >
              {editingItem ? `Update ${this.getItemName()}` : `Add ${this.getItemName()}`}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  renderDeleteModal() {
    const { showDeleteModal, deleteTarget } = this.state;
    
    return (
      <Modal
        isOpen={showDeleteModal}
        onClose={this.closeDeleteModal}
        title={`Delete ${this.getItemName()}`}
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={this.closeDeleteModal}
              className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={this.handleDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Delete {this.getItemName()}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Main render method
  render() {
    const { loading, error } = this.state;
    const filteredData = this.getFilteredData();
    
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {this.renderHeader()}
          {this.renderStats()}
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            {loading && this.renderLoading()}
            {error && this.renderError()}
            {!loading && !error && (
              <>
                {filteredData.length === 0 ? (
                  this.renderEmptyState()
                ) : (
                  this.renderDataGrid()
                )}
              </>
            )}
          </div>
        </div>

        {this.renderModal()}
        {this.renderDeleteModal()}
      </AdminLayout>
    );
  }
}

export default BaseAdminManagement;
