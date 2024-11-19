import { useOutletContext } from "react-router-dom";
import { AppData } from "../../App";

export function useData() {
  return useOutletContext<AppData>();
}
