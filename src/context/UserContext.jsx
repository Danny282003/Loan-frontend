import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [loansDetails, setLoansDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          // Not logged in — do NOT set loansDetails
          setLoansDetails(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setLoansDetails(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ loansDetails, setLoansDetails, loading }}>
      {children}
    </UserContext.Provider>
  );
}
