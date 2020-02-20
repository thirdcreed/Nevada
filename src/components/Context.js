import React from "react";

export const UserContext = React.createContext({
  selectedPrecinct: () => {},
  setSelectedPrecinct: () => {}
});
