import React from "react";

export const AppContext = React.createContext({
  selectedPrecinct: () => {},
  setSelectedPrecinct: () => {},
  data: null
});
