import { create } from 'zustand';

interface ModalState {
  isRegistrationSuccessOpen: boolean;
  openRegistrationSuccess: () => void;
  closeRegistrationSuccess: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isRegistrationSuccessOpen: false,
  openRegistrationSuccess: () => set({ isRegistrationSuccessOpen: true }),
  closeRegistrationSuccess: () => set({ isRegistrationSuccessOpen: false }),
})); 