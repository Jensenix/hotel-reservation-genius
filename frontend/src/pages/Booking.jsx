import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: ''
  });
  const [selectedExtraServices, setSelectedExtraServices] = useState({});
  const [showExtraServicesDropdown, setShowExtraServicesDropdown] = useState(false);
  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [extraServicesTotal, setExtraServicesTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
    fetchPaymentMethods();
    fetchExtraServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Check for existing booking (continue payment flow)
  useEffect(() => {
    const state = location.state;
    if (state?.bookingId) {
      setBookingId(state.bookingId);
      setStep(2); // Skip to payment step
      
      // Fetch booking details to populate form
      const fetchBookingDetails = async () => {
        try {
          const response = await apiService.getBookingById(state.bookingId);
          const booking = response.data.data;
          
          // Set booking data from existing booking
          setBookingData(prev => ({
            ...prev,
            checkInDate: new Date(booking.checkInDate),
            checkOutDate: new Date(booking.checkOutDate),
            guestCount: booking.guestCount || 1,
            specialRequests: booking.specialRequests || ''
          }));
          
          setGrandTotal(parseFloat(booking.totalPrice));
          
          // Calculate room price and extra services total
          if (booking.room && booking.checkInDate && booking.checkOutDate) {
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const roomPrice = nights * (booking.room.roomType?.basePrice || booking.room.basePrice || 0);
            setTotalPrice(roomPrice);
            
            // Calculate extra services total
            let servicesTotal = 0;
            if (booking.extraServices && booking.extraServices.length > 0) {
              booking.extraServices.forEach(service => {
                servicesTotal += parseFloat(service.BookingExtraService?.subtotal || service.price || 0);
              });
            }
            setExtraServicesTotal(servicesTotal);
          }
          
          // Load extra services if any
          if (booking.extraServices && booking.extraServices.length > 0) {
            const servicesMap = {};
            booking.extraServices.forEach(service => {
              servicesMap[service.id] = service.BookingExtraService?.quantity || 1;
            });
            setSelectedExtraServices(servicesMap);
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      };
      
      fetchBookingDetails();
    }
  }, [location.state]);

  useEffect(() => {
    calculateTotalPrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.checkInDate, bookingData.checkOutDate, room, extraServicesTotal]);

  useEffect(() => {
    calculateExtraServicesTotal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExtraServices, extraServices]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExtraServicesDropdown && !event.target.closest('.extra-services-dropdown')) {
        setShowExtraServicesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExtraServicesDropdown]);

  const fetchRoomDetails = async () => {
    try {
      // For now, we'll use roomType as room since we don't have actual rooms
      const response = await apiService.getRoomTypeById(roomId);
      const roomType = response.data.data;
      
      // Create a room-like object from roomType
      setRoom({
        ...roomType,
        id: roomType.id,
        roomTypeId: roomType.id // For room types, roomTypeId = id
      });
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await apiService.getPaymentMethods();
      setPaymentMethods(response.data.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchExtraServices = async () => {
    try {
      const response = await apiService.getExtraServices();
      setExtraServices(response.data.data);
    } catch (error) {
      console.error('Error fetching extra services:', error);
    }
  };

  const calculateTotalPrice = () => {
    if (bookingData.checkInDate && bookingData.checkOutDate && room) {
      const checkIn = bookingData.checkInDate;
      const checkOut = bookingData.checkOutDate;
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const price = nights * room.basePrice;
      setTotalPrice(price);
      setGrandTotal(price + extraServicesTotal);
    }
  };

  const calculateExtraServicesTotal = () => {
    let total = 0;
    Object.entries(selectedExtraServices).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = extraServices.find(s => s.id === parseInt(serviceId));
        if (service) {
          total += service.price * quantity;
        }
      }
    });
    setExtraServicesTotal(total);
    setGrandTotal(totalPrice + total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExtraServiceChange = (serviceId, quantity) => {
    setSelectedExtraServices(prev => ({
      ...prev,
      [serviceId]: quantity
    }));
  };

  const validateStep1 = () => {
    return bookingData.checkInDate && 
           bookingData.checkOutDate && 
           bookingData.guestCount > 0 &&
           bookingData.checkInDate < bookingData.checkOutDate;
  };

  const validateStep2 = () => {
    return bookingData.paymentMethodId;
  };

  const handleNextStep = async () => {
    if (step === 1 && validateStep1()) {
      // If bookingId exists (continue payment flow), just move to step 2
      if (bookingId) {
        setStep(2);
        return;
      }
      
      // Create booking with pending status when moving to payment step
      try {
        setIsProcessingPayment(true);
        
        const bookingPayload = {
          userId: user?.id,
          roomTypeId: room?.roomTypeId,
          checkInDate: bookingData.checkInDate.toLocaleDateString('en-CA'),
          checkOutDate: bookingData.checkOutDate.toLocaleDateString('en-CA'),
          totalPrice: grandTotal,
          status: 'pending'
        };

        console.log('Creating booking with pending status:', bookingPayload);
        const bookingResponse = await apiService.createBooking(bookingPayload);
        const booking = bookingResponse.data.data;
        
        setBookingId(booking.id);
        setStep(2);
      } catch (error) {
        console.error('Error creating booking:', error);
        setErrorMessage('Failed to create booking. Please try again.');
        setShowErrorModal(true);
      } finally {
        setIsProcessingPayment(false);
      }
    } else if (step === 2 && validateStep2()) {
      handleSubmitBooking();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmitBooking = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Create booking extra services if any selected
      const bookingExtraServicesPayloads = [];
      Object.entries(selectedExtraServices).forEach(([serviceId, quantity]) => {
        if (quantity > 0) {
          const service = extraServices.find(s => s.id === parseInt(serviceId));
          if (service) {
            bookingExtraServicesPayloads.push({
              bookingId: bookingId,
              extraServiceId: parseInt(serviceId),
              quantity: quantity,
              subtotal: service.price * quantity
            });
          }
        }
      });

      if (bookingExtraServicesPayloads.length > 0) {
        for (const payload of bookingExtraServicesPayloads) {
          await api.post('/booking-extra-services', payload);
        }
      }

      // Create payment (this will update booking status to confirmed via backend)
      const paymentPayload = {
        bookingId: bookingId,
        paymentMethodId: parseInt(bookingData.paymentMethodId),
        amount: grandTotal,
        paymentStatus: 'paid',
        transactionTime: new Date().toISOString()
      };

      const paymentResponse = await apiService.createPayment(paymentPayload);
      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data.success) {
        const updatedBooking = paymentResponse.data.data.booking;
        
        console.log('Payment response data:', paymentResponse.data);
        console.log('Updated booking from payment response:', updatedBooking);
        
        navigate('/booking-success', { 
          state: { booking: updatedBooking, room } 
        });
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create booking. Please try again.';
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Room Not Found</h1>
          <Button onClick={() => navigate('/our-rooms')}>
            Back to Our Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Booking Details</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              {step === 1 ? (
                <div className="space-y-6">
                  {bookingId ? (
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Payment</h2>
                      <p className="text-gray-600 mb-6">
                        You have a pending booking. Click "Continue to Payment" to proceed with payment.
                      </p>
                      <Button
                        onClick={handleNextStep}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? 'Processing...' : 'Continue to Payment'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <DatePicker
                        selected={bookingData.checkInDate}
                        onChange={(date) => setBookingData(prev => ({ ...prev, checkInDate: date }))}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select check-in date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <DatePicker
                        selected={bookingData.checkOutDate}
                        onChange={(date) => setBookingData(prev => ({ ...prev, checkOutDate: date }))}
                        minDate={bookingData.checkInDate || new Date()}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select check-out date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              if (bookingData.guestCount > 1) {
                                setBookingData(prev => ({ ...prev, guestCount: prev.guestCount - 1 }));
                              }
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors rounded-l-lg"
                            disabled={bookingData.guestCount <= 1}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <div className="px-6 py-2 min-w-[80px] text-center font-semibold text-lg">
                            {bookingData.guestCount}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (bookingData.guestCount < room.maxCapacity) {
                                setBookingData(prev => ({ ...prev, guestCount: prev.guestCount + 1 }));
                              }
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors rounded-r-lg"
                            disabled={bookingData.guestCount >= room.maxCapacity}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            Max {room.maxCapacity} guests
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                      <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={500}
                        placeholder="Let us know if you have any special requests for your stay..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {bookingData.specialRequests.length}/500
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Examples: Late check-in, early check-out, room preferences, dietary requirements, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Services
                      <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative extra-services-dropdown">
                      <button
                        type="button"
                        onClick={() => setShowExtraServicesDropdown(!showExtraServicesDropdown)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-900">
                          {Object.keys(selectedExtraServices).filter(id => selectedExtraServices[id] > 0).length > 0
                            ? `${Object.keys(selectedExtraServices).filter(id => selectedExtraServices[id] > 0).length} services selected`
                            : 'Select extra services...'}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${showExtraServicesDropdown ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showExtraServicesDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {extraServices.map((service) => {
                            const quantity = selectedExtraServices[service.id] || 0;
                            return (
                              <div key={service.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900">{service.serviceName}</div>
                                    <div className="text-xs text-gray-500">${service.price}/unit</div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleExtraServiceChange(service.id, Math.max(0, quantity - 1))}
                                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                      disabled={quantity <= 0}
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                    </button>
                                    <div className="w-8 text-center font-semibold text-sm">
                                      {quantity}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleExtraServiceChange(service.id, quantity + 1)}
                                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {extraServices.length === 0 && (
                            <div className="text-center text-gray-500 py-4 text-sm">
                              No extra services available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethodId"
                          value={method.id}
                          checked={bookingData.paymentMethodId === method.id.toString()}
                          onChange={handleInputChange}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{method.methodName}</div>
                          <div className="text-sm text-gray-500">{method.accountNumber}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  disabled={step === 1 ? !validateStep1() || isProcessingPayment : !validateStep2() || isProcessingPayment}
                  className="ml-auto"
                >
                  {isProcessingPayment ? 'Processing...' : (step === 1 ? 'Continue to Payment' : 'Pay')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {room.name.charAt(0)}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <p className="text-sm text-gray-600">{room.description}</p>
                </div>

                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkInDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{bookingData.guestCount}</span>
                    </div>
                  </div>
                )}

                {grandTotal > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Room Price</span>
                      <span className="font-semibold text-gray-900">${totalPrice}</span>
                    </div>
                    
                    {Object.entries(selectedExtraServices).some(([_, qty]) => qty > 0) && (
                      <div className="border-t pt-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Extra Services</div>
                        {Object.entries(selectedExtraServices).map(([serviceId, quantity]) => {
                          if (quantity > 0) {
                            const service = extraServices.find(s => s.id === parseInt(serviceId));
                            if (service) {
                              const subtotal = service.price * quantity;
                              return (
                                <div key={serviceId} className="flex justify-between text-xs">
                                  <span className="text-gray-600">{service.serviceName} × {quantity}</span>
                                  <span className="text-gray-900">${subtotal}</span>
                                </div>
                              );
                            }
                          }
                          return null;
                        })}
                        <div className="flex justify-between items-center pt-2 border-t border-dashed">
                          <span className="text-sm font-medium text-gray-700">Services Total</span>
                          <span className="font-semibold text-gray-900">${extraServicesTotal}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-blue-600">${grandTotal}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Booking Error"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {errorMessage.includes('fully booked') ? 'Room Fully Booked' : 'Booking Failed'}
          </h3>
          <p className="text-gray-600 mb-6">
            {errorMessage.includes('fully booked') 
              ? 'All rooms of this type are fully booked for the selected dates. Please try different dates or choose a different room type.'
              : errorMessage
            }
          </p>
          <div className="flex space-x-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowErrorModal(false)}
            >
              Try Different Dates
            </Button>
            <Button
              onClick={() => {
                setShowErrorModal(false);
                navigate('/our-rooms');
              }}
            >
              View Other Rooms
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
