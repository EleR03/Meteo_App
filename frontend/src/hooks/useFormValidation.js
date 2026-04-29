import { useState } from "react";

// Hook custom pentru validarea formularului.
// Este păstrat separat, similar cu proiectul webdev, pentru modularizare.
export function useFormValidation() {
  const [error, setError] = useState("");

  function validateCity(city) {
    const value = city.trim();

    if (!value) {
      setError("Introdu un nume de oraș.");
      return false;
    }

    if (value.length < 2) {
      setError("Numele orașului trebuie să aibă cel puțin 2 caractere.");
      return false;
    }

    setError("");
    return true;
  }

  function clearError() {
    setError("");
  }

  return { error, validateCity, clearError };
}
