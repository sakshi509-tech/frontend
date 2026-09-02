import { useContext } from "react";
import DropshipperContext from "../context/DropshipperContext";

export const useDropshipper = () => {
  const context = useContext(DropshipperContext);

  if (!context) {
    throw new Error("useDropshipper must be used within DropshipperProvider");
  }

  return context;
};

export default useDropshipper;
