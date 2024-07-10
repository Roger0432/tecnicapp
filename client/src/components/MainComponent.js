import React, { useState } from 'react';
import Menu from './MenuComponent';
import NouAssaig from './NouAssaigComponent';

export const MainComponent = () => {
  const [showNouAssaig, setShowNouAssaig] = useState(false);

  return (
    <div>
      {showNouAssaig ? (
        <NouAssaig setShowNouAssaig={setShowNouAssaig} />
      ) : (
        <Menu setShowNouAssaig={setShowNouAssaig} />
      )}
    </div>
  );
};

export default MainComponent;
