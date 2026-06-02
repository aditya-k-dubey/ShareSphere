import { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState('donor'); // 'donor' or 'ngo'

  useEffect(() => {
    if (role === 'ngo') {
      document.body.classList.add('theme-ngo');
    } else {
      document.body.classList.remove('theme-ngo');
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
