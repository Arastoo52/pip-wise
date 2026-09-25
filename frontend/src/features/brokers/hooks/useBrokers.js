import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrokers, createBroker, clearLastCreatedBroker } from '../state/broker.slice.js';
import {
  ColorExness_Logo,
  ColorXM_Logo,
  ColorOcta_Logo,
  ColorICMarkets_Logo,
  ColorFBS_Logo,
  ColorHFM_Logo,
  ColorDeriv_Logo,
  ColorFXTM_Logo,
  ColorPepperstone_Logo,
  ColorAvaTrade_Logo,
  ColorTickmill_Logo,
  ColorOANDA_Logo,
  ALL_BROKERS_DATA,
} from '../data/brokersData.jsx';

const LOGO_MAP = {
  exness: ColorExness_Logo,
  xm: ColorXM_Logo,
  octa: ColorOcta_Logo,
  'ic-markets': ColorICMarkets_Logo,
  icmarkets: ColorICMarkets_Logo,
  fbs: ColorFBS_Logo,
  hfm: ColorHFM_Logo,
  deriv: ColorDeriv_Logo,
  fxtm: ColorFXTM_Logo,
  pepperstone: ColorPepperstone_Logo,
  avatrade: ColorAvaTrade_Logo,
  tickmill: ColorTickmill_Logo,
  oanda: ColorOANDA_Logo,
};

export const useBrokers = () => {
  const dispatch = useDispatch();
  const { brokers, status, error, isCreating, createError, lastCreatedBroker } = useSelector(
    (state) => state.brokers
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBrokers());
    }
  }, [dispatch, status]);

  // Merge logos into brokers
  const enrichedBrokers = useMemo(() => {
    if (!brokers || brokers.length === 0) {
      return ALL_BROKERS_DATA;
    }

    return brokers.map((b) => {
      const key = (b.slug || b.id || '').toLowerCase();
      const LogoComponent = LOGO_MAP[key] || (typeof b.Logo === 'function' ? b.Logo : null);

      return {
        ...b,
        id: b.slug || b.id || b._id,
        Logo: LogoComponent,
      };
    });
  }, [brokers]);

  const handleCreateBroker = useCallback(
    async (brokerPayload) => {
      const result = await dispatch(createBroker(brokerPayload)).unwrap();
      return result;
    },
    [dispatch]
  );

  const handleClearLastCreated = useCallback(() => {
    dispatch(clearLastCreatedBroker());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchBrokers());
  }, [dispatch]);

  return {
    brokers: enrichedBrokers,
    rawBrokers: brokers,
    isLoading: status === 'loading',
    isCreating,
    error,
    createError,
    lastCreatedBroker,
    createBroker: handleCreateBroker,
    clearLastCreated: handleClearLastCreated,
    refetch,
  };
};

export default useBrokers;
