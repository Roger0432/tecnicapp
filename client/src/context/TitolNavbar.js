import React, { createContext, useState, useContext } from 'react';

const TitolNavbar = createContext();

export const TitolProvider = ({ children }) => {
    const [titol, setTitol] = useState('Passerells');

    return <TitolNavbar.Provider value={{ titol, setTitol }}>{children}</TitolNavbar.Provider>;
};

export const useTitol = () => useContext(TitolNavbar);
