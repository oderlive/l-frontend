import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

export const Provider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, isModalOpen, setIsModalOpen, isProfileModalOpen, setIsProfileModalOpen }}>
            {children}
        </MenuContext.Provider>
    );
};
