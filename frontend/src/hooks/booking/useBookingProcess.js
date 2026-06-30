import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingData } from '@/hooks/booking/useBookingData';
import { bookingPaymentService } from '@/services/bookingPaymentService';
import { calculateRoomTotal, calculateExtraServicesTotal } from '@/utils/bookingPrice';
import apiService from '@/services/api/apiService';

export const useBookingProcess = (roomId, locationState, user) => {
  const navigate = useNavigate();
  const initialBookingId = locationState?.bookingId || null;

  const {
    room,
    paymentMethods,
    extraServices,
    loading,
    setLoading,
    bookingData,
    setBookingData,
    existingExtraServices,
  } = useBookingData(roomId, initialBookingId);

  const [bookingId, setBookingId] = useState(initialBookingId);
  
  // FIX 1: Always start at Step 1. If resuming a pending booking, they must
  // have the opportunity to re-select Extra Services since they aren't saved until payment.
  const [step, setStep] = useState(1);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const [selectedExtraServices, setSelectedExtraServices] = useState({});

  // ROOT CAUSE FIX (restated): `loading` (from useBookingData) flips to
  // false as soon as the booking's raw data has been fetched and mapped
  // into `existingExtraServices`, but that needs to be handed off into
  // `selectedExtraServices` before Booking.jsx is allowed to render the
  // real form/summary — otherwise there's a window where the page is
  // interactive but `selectedExtraServices` is still `{}`, showing
  // room-price-only totals, and if "Continue to Payment" is clicked in that
  // window, the empty selection gets persisted, wiping the real saved
  // extras (see updateBooking's destroy-then-recreate sync).
  //
  // Rather than doing this hand-off in a useEffect (which runs *after* the
  // browser paints the render where `loading` already went false — exactly
  // the inconsistent frame we need to avoid, and flagged by
  // react-hooks/set-state-in-effect since it's the "sync state via Effect"
  // anti-pattern), we use React's documented alternative for this exact
  // case: detect the loading→ready transition *during render* by comparing
  // against a stored previous value, and call setState directly in the
  // render body. React discards that render and immediately re-renders
  // with the corrected state before committing anything to the screen, so
  // the inconsistent state is never painted at all — and `extrasReady`
  // doubles as the "have we already restored" guard, so no ref is needed.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevLoading, setPrevLoading] = useState(loading);
  const [extrasReady, setExtrasReady] = useState(false);

  if (loading !== prevLoading) {
    setPrevLoading(loading);

    if (!loading && !extrasReady) {
      if (initialBookingId && Object.keys(existingExtraServices).length > 0) {
        setSelectedExtraServices(existingExtraServices);
      }
      setExtrasReady(true);
    }
  }

  const totalPrice = useMemo(() => 
    calculateRoomTotal(bookingData.checkInDate, bookingData.checkOutDate, room?.basePrice),
  [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const extraServicesTotal = useMemo(() => 
    calculateExtraServicesTotal(selectedExtraServices, extraServices),
  [selectedExtraServices, extraServices]);

  const grandTotal = totalPrice + extraServicesTotal;

  // FIX 2 (root cause, part A): builds the payload used to persist the
  // current extra service selection to the booking. Used by handleNextStep
  // so extras are saved as soon as Step 1 is confirmed, instead of only at
  // final payment (when they only existed in this React state).
  const buildExtraServicesPayload = () =>
    Object.entries(selectedExtraServices)
      .filter(([, quantity]) => quantity > 0)
      .map(([serviceId, quantity]) => {
        const service = extraServices.find((s) => String(s.id) === String(serviceId));
        if (!service) return null;
        return {
          extraServiceId: parseInt(serviceId, 10),
          quantity,
          subtotal: Number(service.price) * quantity,
        };
      })
      .filter(Boolean);

  const handleNextStep = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setErrorState({ show: true, message: 'Please select valid check-in and check-out dates.' });
      return;
    }

    try {
      setLoading(true);
      setErrorState({ show: false, message: '' });

      const extraServicesPayload = buildExtraServicesPayload();

      // FIX 2: If we are resuming an existing booking, UPDATE it instead of creating a duplicate
      if (bookingId) {
        await apiService.bookings.update(bookingId, {
          checkInDate: bookingData.checkInDate.toISOString(),
          checkOutDate: bookingData.checkOutDate.toISOString(),
          specialRequests: bookingData.specialRequests,
          totalPrice: totalPrice, // base room total; server recalculates the final total once extras are synced
          extraServices: extraServicesPayload, // FIX (root cause): persist extras now, not only at payment
        });
        setStep(2);
      } else {
        // Creating a brand new booking
        const data = await bookingPaymentService.createBooking({
          userId: user?.id,
          roomTypeId: parseInt(roomId, 10),
          checkInDate: bookingData.checkInDate.toISOString(),
          checkOutDate: bookingData.checkOutDate.toISOString(),
          specialRequests: bookingData.specialRequests,
          totalPrice: totalPrice,
          extraServices: extraServicesPayload, // FIX (root cause): persist extras now, not only at payment
        });

        setBookingId(data.id);
        setStep(2);
      }
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || error.message || 'Failed to process booking.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!bookingData.paymentMethodId) {
      setErrorState({ show: true, message: 'Please select a payment method.' });
      return;
    }

    try {
      setIsProcessingPayment(true);
      setErrorState({ show: false, message: '' });

      // FIX: extras are already persisted on the booking by this point (see
      // handleNextStep above), so payment just needs to confirm/charge the
      // booking. The server determines the actual amount from the
      // persisted booking.totalPrice — grandTotal is sent for display/audit
      // purposes only and is not trusted by the backend.
      const paymentData = await bookingPaymentService.processPayment({
        bookingId,
        paymentMethodId: bookingData.paymentMethodId,
        grandTotal,
      });

      navigate('/booking-success', {
        state: { booking: paymentData.booking, room },
      });
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || error.message || 'Failed to process payment.',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    state: {
      room,
      // Combined gate: don't tell Booking.jsx "ready to render" until BOTH
      // the raw fetch (useBookingData's `loading`) and, when resuming, the
      // extras hand-off into `selectedExtraServices` (`extrasReady`) are
      // done. This is what prevents the form/summary from ever painting
      // with a stale/empty `selectedExtraServices`.
      loading: loading || !extrasReady,
      step,
      bookingData,
      paymentMethods,
      extraServices,
      selectedExtraServices,
      totalPrice,
      extraServicesTotal,
      grandTotal,
      bookingId,
      isProcessingPayment,
      errorState,
    },
    setBookingData,
    setSelectedExtraServices,
    setStep,
    setErrorState,
    handleNextStep,
    handleConfirmPayment,
  };
};