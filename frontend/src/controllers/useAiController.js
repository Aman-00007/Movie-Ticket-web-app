import { useState, useCallback } from 'react';

export function useAiController() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const openAiModal = useCallback(() => {
    setAiModalOpen(true);
  }, []);

  const closeAiModal = useCallback(() => {
    setAiModalOpen(false);
  }, []);

  return {
    aiModalOpen,
    openAiModal,
    closeAiModal,
  };
}
