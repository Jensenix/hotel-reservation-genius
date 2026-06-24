import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBookingProcess } from '@/hooks/booking/useBookingProcess';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

import BookingStepper from '@/components/booking/BookingStepper';
import BookingDetailsForm from '@/components/booking/BookingDetailsForm';
import PaymentSelection from '@/components/booking/PaymentSelection';
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar';

const Booking = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. Destructure exactly what the refactored hook returns natively
  const { 
    state, 
    setBookingData, 
    setSelectedExtraServices, 
    setStep, 
    setErrorState, 
    handleNextStep, 
    handleConfirmPayment 
  } = useBookingProcess(roomId, location.state, user);

  // 2. Re-bundle them into the 'actions' object that your JSX expects
  const actions = {
    setBookingData,
    setSelectedExtraServices,
    setStep,
    setErrorState,
    handleNextStep,
    handleConfirmPayment
  };

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
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Room not found
          </h2>
          <p className="text-gray-600 mb-6">
            The room you're trying to book doesn't exist or is unavailable.
          </p>
          <Button onClick={() => navigate('/our-rooms')}>
            View Available Rooms
          </Button>
        </div>
      </div>
    );
  }

  const getButtonText = () => {
    if (state.isProcessingPayment) return 'Processing...';
    if (state.step === 1) return 'Continue to Payment';
    return `Pay $${state.grandTotal}`;
  };

  const canProceed =
    state.step === 1
      ? state.bookingData.checkInDate && state.bookingData.checkOutDate
      : state.bookingData.paymentMethodId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <BookingStepper currentStep={state.step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {state.step === 1 ? (
              <BookingDetailsForm
                room={state.room}
                bookingData={state.bookingData}
                setBookingData={actions.setBookingData}
                extraServices={state.extraServices}                     
                selectedExtraServices={state.selectedExtraServices}     
                setSelectedExtraServices={actions.setSelectedExtraServices} 
                onNext={actions.handleNextStep}
              />
              ) : (
                <PaymentSelection
                  paymentMethods={state.paymentMethods}
                  selectedMethod={state.bookingData.paymentMethodId}
                  onSelectMethod={(id) =>
                    actions.setBookingData({
                      ...state.bookingData,
                      paymentMethodId: id,
                    })
                  }
                  extraServices={state.extraServices}
                  selectedExtraServices={state.selectedExtraServices}
                  onExtraServiceChange={(serviceId, quantity) =>
                    actions.setSelectedExtraServices((prev) => ({
                      ...prev,
                      [serviceId]: quantity,
                    }))
                  }
                />
              )}

              <div className="mt-8 flex justify-between pt-6 border-t border-gray-200">
                {state.step === 2 && (
                  <Button
                    variant="outline"
                    onClick={() => actions.setStep(state.step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={state.step === 1 ? actions.handleNextStep : actions.handleConfirmPayment}
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

      <Modal
        isOpen={state.errorState.show}
        onClose={() => actions.setErrorState({ show: false, message: '' })}
        title="Booking Error"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">{state.errorState.message}</p>
          <div className="flex space-x-3 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                actions.setErrorState({ show: false, message: '' })
              }
            >
              Try Again
            </Button>
            <Button onClick={() => navigate('/our-rooms')}>
              View Other Rooms
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;