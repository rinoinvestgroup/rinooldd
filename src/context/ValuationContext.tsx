import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValuationContextType {
  isValuationPopupOpen: boolean;
  openValuationPopup: () => void;
  closeValuationPopup: () => void;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};

interface ValuationProviderProps {
  children: ReactNode;
}

export const ValuationProvider: React.FC<ValuationProviderProps> = ({ children }) => {
  const [isValuationPopupOpen, setIsValuationPopupOpen] = useState(false);

  const openValuationPopup = () => {
    setIsValuationPopupOpen(true);
    
    // Track popup opening with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'valuation_popup_open', {
        event_category: 'Lead Generation',
        event_label: 'Valuation Popup Opened',
        value: 1,
        custom_parameter_streamline_id: '11378214829'
      });
    }
  };

  const closeValuationPopup = () => {
    setIsValuationPopupOpen(false);
  };

  return (
    <ValuationContext.Provider
      value={{
        isValuationPopupOpen,
        openValuationPopup,
        closeValuationPopup,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
};
