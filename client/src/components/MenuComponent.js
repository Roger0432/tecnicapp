import React from 'react';

export const Menu = ({ setShowNouAssaig }) => {

  const handleCreateAssaig = () => {
    setShowNouAssaig(true);
  };

  return (
    <div>
      
      <button onClick={handleCreateAssaig}>Crear assaig</button>
      
    </div>
  );
};

export default Menu;
