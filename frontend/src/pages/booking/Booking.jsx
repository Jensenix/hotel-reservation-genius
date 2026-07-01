import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useBookingProcess } from '@/hooks/booking/useBookingProcess';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

import BookingStepper from '@/components/booking/BookingStepper';
import BookingDetailsForm from '@/components/booking/BookingDetailsForm';
import PaymentSelection from '@/components/booking/PaymentSelection';
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar';

/**
 * @returns {JSX.Element}
 */
const Booking = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    state,
    setBookingData,
    setSelectedExtraServices,
    setStep,
    setErrorState,
    handleNextStep,
    handleConfirmPayment,
  } = useBookingProcess(roomId, location.state, user);

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
            The room you&apos;re trying to book doesn&apos;t exist or is
            unavailable.
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

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              {state.step === 1 ? (
                <BookingDetailsForm
                  room={state.room}
                  bookingData={state.bookingData}
                  setBookingData={setBookingData}
                  extraServices={state.extraServices}
                  selectedExtraServices={state.selectedExtraServices}
                  setSelectedExtraServices={setSelectedExtraServices}
                  onNext={handleNextStep}
                />
              ) : (
                <PaymentSelection
                  paymentMethods={state.paymentMethods}
                  bookingData={state.bookingData}
                  setBookingData={setBookingData}
                />
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-between pt-6 border-t border-gray-200 gap-4 sm:gap-0">
                {state.step === 2 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(state.step - 1)}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Back
                  </Button>
                )}

                <Button
                  onClick={
                    state.step === 1 ? handleNextStep : handleConfirmPayment
                  }
                  disabled={!canProceed || state.isProcessingPayment}
                  className="w-full sm:w-auto ml-auto order-1 sm:order-2"
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

        <Modal
          isOpen={state.errorState.show}
          onClose={() =>
            setErrorState({
              show: false,
              message: '',
            })
          }
          title="Booking Error"
        >
          <div className="text-center">
            <p className="text-gray-600 mb-6">{state.errorState.message}</p>

            <div className="flex space-x-3 justify-center">
              <Button
                variant="outline"
                onClick={() =>
                  setErrorState({
                    show: false,
                    message: '',
                  })
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
    </div>
  );
};

export default Booking;
