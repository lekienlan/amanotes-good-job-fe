import { useCoreValuesRepository } from 'data/repositories';

/**
 * Use case: expose core values to presentation.
 * Presentation must use this instead of calling useCoreValuesStore or useCoreValuesRepository directly.
 */
export const useCoreValues = () => {
  const {
    coreValues,
    loading,
    error,
    ensureCoreValuesLoaded,
  } = useCoreValuesRepository();
  return { coreValues, loading, error, ensureCoreValuesLoaded };
};
