import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./navigate";

export function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null; // no UI
}
