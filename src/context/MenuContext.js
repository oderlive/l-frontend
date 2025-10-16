import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

export const Provider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log(isMenuOpen)

    return (
        <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
            {children}
        </MenuContext.Provider>
    );
};
