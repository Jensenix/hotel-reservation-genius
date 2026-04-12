import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: ''
  });
  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
    fetchPaymentMethods();
  }, [roomId]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const fetchRoomDetails = async () => {
    try {
      const response = await apiService.getRoomTypeById(roomId);
      setRoom(response.data.data);
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

  const calculateTotalPrice = () => {
    if (bookingData.checkInDate && bookingData.checkOutDate && room) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights * room.basePrice);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    return bookingData.checkInDate && 
           bookingData.checkOutDate && 
           bookingData.guestCount > 0 &&
           new Date(bookingData.checkInDate) < new Date(bookingData.checkOutDate);
  };

  const validateStep2 = () => {
    return bookingData.paymentMethodId;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmitBooking();
    }
  };

  const handleSubmitBooking = async () => {
    try {
      const bookingPayload = {
        roomId: parseInt(roomId),
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice,
        specialRequests: bookingData.specialRequests
      };

      const bookingResponse = await apiService.createBooking(bookingPayload);
      const booking = bookingResponse.data.data;

      // Create payment
      const paymentPayload = {
        bookingId: booking.id,
        paymentMethodId: parseInt(bookingData.paymentMethodId),
        paymentStatus: 'pending'
      };

      await apiService.createPayment(paymentPayload);

      navigate('/booking-success', { 
        state: { booking, room } 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
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
          <Button onClick={() => navigate('/rooms')}>
            Back to Rooms
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
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests
                      </label>
                      <select
                        name="guestCount"
                        value={bookingData.guestCount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[...Array(room.maxCapacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any special requests or requirements..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
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
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  disabled={step === 1 ? !validateStep1() : !validateStep2()}
                  className="ml-auto"
                >
                  {step === 1 ? 'Continue to Payment' : 'Complete Booking'}
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

                {totalPrice > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Price:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
