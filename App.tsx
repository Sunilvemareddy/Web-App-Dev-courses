// only the relevant part changed
function App() {
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);

  useEffect(() => {
    // Stop checking VITE_* on the client; ask the server
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setIsApiKeyConfigured(!!d.ok))
      .catch(() => setIsApiKeyConfigured(false));
  }, []);
  ...
}
