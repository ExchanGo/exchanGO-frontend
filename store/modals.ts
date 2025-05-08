import { create } from 'zustand';

// Define modal types:
export type ModalType = 
  | 'MODAL_FILTER_CURRENCY'
  | 'MODAL_FILTER_LOCATION'
  | 'MODAL_FILTER_DATE'
  | 'MODAL_SORT'
  | 'MODAL_ALERT'
  | 'MODAL_SHARE_EXCHANGE'
  | 'MODAL_WHATSAPP_ALERT';

// Define payload types for each modal
interface ModalPayloads {
  MODAL_FILTER_CURRENCY: {
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
  };
  MODAL_FILTER_LOCATION: {
    location?: string;
    radius?: number;
  };
  MODAL_FILTER_DATE: {
    startDate?: Date;
    endDate?: Date;
  };
  MODAL_SORT: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  MODAL_ALERT: {
    message?: string;
    type?: 'info' | 'warning' | 'error';
  };
  MODAL_SHARE_EXCHANGE: {
    exchangeId?: string;
    exchangeData?: any;
  };
  MODAL_WHATSAPP_ALERT: {
    step?: number;
    mode?: 'area' | 'office';
    // Add more fields as needed for the alert flow
  };
}

// Define the store state
interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  payloads: Partial<ModalPayloads[ModalType]>;
  setIsOpen: <T extends ModalType>(
    type: T,
    payloads?: Partial<ModalPayloads[T]>
  ) => void;
  onClose: () => void;
  onConfirm: (callback?: () => void) => void;
  onCancel: (callback?: () => void) => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  payloads: {},
  
  setIsOpen: (type, payloads = {}) => {
    // First reset the state completely
    set(() => ({ 
      isOpen: false, 
      type: null,
      payloads: {} 
    }));
    
    // Then set the new state in the next tick
    setTimeout(() => {
      set(() => ({ 
        isOpen: true, 
        type, 
        payloads: { ...payloads } 
      }));
    }, 0);
  },
  
  onClose: () => 
    set(() => ({ 
      isOpen: false, 
      type: null,
      payloads: {} 
    })),
  
  onConfirm: (callback) => {
    set(() => ({ 
      isOpen: false, 
      type: null,
      payloads: {} 
    }));
    callback?.();
  },
  
  onCancel: (callback) => {
    set(() => ({ 
      isOpen: false, 
      type: null,
      payloads: {} 
    }));
    callback?.();
  },
}));

// Helper functions for common modal operations
export const openModal = <T extends ModalType>(
  type: T,
  payloads?: Partial<ModalPayloads[T]>
) => {
  useModal.getState().setIsOpen(type, payloads);
};

export const closeModal = () => {
  useModal.getState().onClose();
};

export const confirmModal = (callback?: () => void) => {
  useModal.getState().onConfirm(callback);
};

export const cancelModal = (callback?: () => void) => {
  useModal.getState().onCancel(callback);
};

export const MODAL_FILTER_CURRENCY = 'MODAL_FILTER_CURRENCY';