import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBookingProcess } from '@/hooks/useBookingProcess';

import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

import BookingStepper from '@/components/booking/BookingStepper';
import BookingDetailsForm from '@/components/booking/BookingDetailsForm';
import PaymentSelection from '@/components/booking/PaymentSelection';
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar';

const Booking = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { state, actions } = useBookingProcess(roomId, location.state, user);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 container mx-auto px-4">
        <div className="animate-pulse h-8 bg-gray-300 rounded w-1/3 mb-8" />
        <div className="animate-pulse h-96 bg-gray-300 rounded-xl" />
      </div>
    );
  }

  if (!state.room) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Room Not Found</h1>
        <Button onClick={() => navigate('/our-rooms')}>Back to Our Rooms</Button>
      </div>
    );
  }

  const isStep1Valid = state.bookingData.checkInDate && state.bookingData.checkOutDate && state.bookingData.guestCount > 0 && state.bookingData.checkInDate < state.bookingData.checkOutDate;
  const isStep2Valid = !!state.bookingData.paymentMethodId;
  const canProceed = state.step === 1 ? isStep1Valid : isStep2Valid;

  const getButtonText = () => {
    if (state.isProcessingPayment) return 'Processing...';
    if (state.step === 1) return 'Continue to Payment';
    return 'Pay';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <BookingStepper step={state.step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              {state.step === 1 ? (
                <BookingDetailsForm 
                  bookingData={state.bookingData}
                  setBookingData={actions.setBookingData}
                  room={state.room}
                  extraServices={state.extraServices}
                  selectedExtraServices={state.selectedExtraServices}
                  setSelectedExtraServices={actions.setSelectedExtraServices}
                  bookingId={state.bookingId}
                  onContinue={actions.handleNextStep}
                  isProcessingPayment={state.isProcessingPayment}
                />
              ) : (
                <PaymentSelection 
                  paymentMethods={state.paymentMethods}
                  bookingData={state.bookingData}
                  setBookingData={actions.setBookingData}
                />
              )}

              <div className="flex justify-between mt-8">
                {state.step > 1 && (
                  <Button variant="outline" onClick={() => actions.setStep(state.step - 1)}>Back</Button>
                )}
                <Button
                  onClick={actions.handleNextStep}
                  disabled={!canProceed || state.isProcessingPayment}
                  className="ml-auto"
                >
                  {getButtonText()}
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BookingSummarySidebar state={state} />
          </div>
        </div>
      </div>

      <Modal isOpen={state.errorState.show} onClose={() => actions.setErrorState({ show: false, message: '' })} title="Booking Error">
        <div className="text-center">
          <p className="text-gray-600 mb-6">{state.errorState.message}</p>
          <div className="flex space-x-3 justify-center">
            <Button variant="outline" onClick={() => actions.setErrorState({ show: false, message: '' })}>Try Again</Button>
            <Button onClick={() => navigate('/our-rooms')}>View Other Rooms</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;