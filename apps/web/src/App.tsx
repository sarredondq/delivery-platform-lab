// CI trigger test
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type HealthStatus = "loading" | "ok" | "unavailable";

function App() {
  const [status, setStatus] = useState<HealthStatus>("loading");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => {
        if (res.ok) {
          setStatus("ok");
        } else {
          setStatus("unavailable");
        }
      })
      .catch(() => {
        setStatus("unavailable");
      });
  }, []);

  return (
    <div className="app">
      <h1>Delivery Platform Lab <span className="version">v1.1</span></h1>
      <p className="status" role="status">
        {status === "loading" && "API Status: Checking..."}
        {status === "ok" && "API Status: OK"}
        {status === "unavailable" && "API Status: Unavailable"}
      </p>
    </div>
  );
}

export default App;
