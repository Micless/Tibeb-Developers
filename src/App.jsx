import { useState, useEffect } from 'react';
import './App.css';
import PublicView from './PublicView';
import AdminView from './AdminView';

export default function App() {
  // Master Architecture Data Management States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemLog, setSystemLog] = useState("System online. Fetch complete.");

  // Dynamic View Tracker (true = Admin View, false = Public View)
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form states for creating products
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // 1. [READ] Operation (Shared Database Pull)
  useEffect(() => {
    const fetchMasterPayload = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Failed to load initial API catalog bundle.');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterPayload();
  }, []);

  // 2. [CREATE] Operation (HTTP POST)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert("Please specify both Title and Price metrics.");

    setSystemLog("POST: Dispatching object data map package to server endpoints...");
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          price: parseFloat(newPrice),
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          category: 'Accessories'
        })
      });
      if (!response.ok) throw new Error('POST operation transmission failed.');
      const verifiedItem = await response.json();

      // Update our single source of truth array locally
      setProducts([verifiedItem, ...products]);
      setSystemLog(`POST Success! Server assigned ID: ${verifiedItem.id}. Item appended into master pipeline.`);
      setNewTitle('');
      setNewPrice('');
    } catch (err) {
      setSystemLog(`POST Error: ${err.message}`);
    }
  };

  // 3. [UPDATE] Operation (HTTP PUT)
  const handleUpdate = async (id) => {
    const updatedPrice = prompt("Input updated retail price parameters:");
    if (!updatedPrice || isNaN(updatedPrice)) return alert("Value entry must map to a number format.");

    setSystemLog(`PUT: Amending record parameters on product ID #${id}...`);
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: parseFloat(updatedPrice) })
      });
      if (!response.ok) throw new Error('PUT modifications declined.');

      // Update state locally
      setProducts(products.map(p => p.id === id ? { ...p, price: parseFloat(updatedPrice) } : p));
      setSystemLog(`PUT Success! Server synchronized ID #${id}. Local views adjusted.`);
    } catch (err) {
      setSystemLog(`PUT Error: ${err.message}`);
    }
  };

  // 4. [DELETE] Operation (HTTP DELETE)
  const handleDelete = async (id) => {
    if (!confirm(`Confirm hard deletion profile sequence for record ID #${id}?`)) return;

    setSystemLog(`DELETE: Sending drop instruction for record ID #${id}...`);
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error('DELETE tracking drop handshake failed.');

      // Remove item from our array state
      setProducts(products.filter(p => p.id !== id));
      setSystemLog(`DELETE Success! Object ID #${id} unlinked from cloud structure and local views.`);
    } catch (err) {
      setSystemLog(`DELETE Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="tb-fallback">
        <div className="tb-spinner" />
        Loading the Tibeb catalog…
      </div>
    );
  }

  if (error) {
    return (
      <div className="tb-fallback is-error">
        <span style={{ fontSize: '2.5rem' }}>⚠️</span>
        Core data route blocked: {error}
      </div>
    );
  }

  return (
    <div className="tb-app">
      {/* Dynamic View Mode Toggle */}
      <nav className="tb-nav">
        <div className="tb-brand">
          <div className="tb-brand-mark">T</div>
          <span className="name">Tibeb Enterprise Hub</span>
        </div>
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`tb-mode-btn ${isAdminMode ? 'is-admin' : ''}`}
        >
          {isAdminMode ? "🔄 Switch to Storefront" : "🛠️ Switch to Admin"}
        </button>
      </nav>

      {isAdminMode ? (
        <main className="tb-main-admin">
          <AdminView
            products={products}
            systemLog={systemLog}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </main>
      ) : (
        <main>
          <PublicView products={products} />
        </main>
      )}
    </div>
  );
}