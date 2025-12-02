import { CustomAlert } from '@/components/CustomAlert';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AlertConfig {
    title: string;
    message: string;
    type?: 'error' | 'success' | 'info' | 'warning';
    showCancel?: boolean;
    onConfirm?: () => void;
}

interface AlertContextType {
    showAlert: (config: AlertConfig) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<AlertConfig>({
        title: '',
        message: '',
        type: 'info',
        showCancel: false,
    });

    const showAlert = (newConfig: AlertConfig) => {
        setConfig({
            type: 'info', // default
            showCancel: false, // default
            ...newConfig
        });
        setVisible(true);
    };

    const hideAlert = () => {
        setVisible(false);
    };

    const handleConfirm = () => {
        if (config.onConfirm) {
            config.onConfirm();
        } else {
            hideAlert();
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <CustomAlert
                visible={visible}
                title={config.title}
                message={config.message}
                type={config.type}
                showCancel={config.showCancel}
                onClose={hideAlert}
                onConfirm={handleConfirm}
            />
        </AlertContext.Provider>
    );
};
