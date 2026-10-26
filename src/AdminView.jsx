import React from 'react';

export default function AdminView({ 
  products, systemLog, newTitle, setNewTitle, newPrice, setNewPrice, 
  onCreate, onUpdate, onDelete 
}) {
  return (
    <div style={styles.appContainer}>
      <h1 style={styles.title}>System Control Panel (CRUD Operations)</h1>
      
      <div style={styles.logBox}>
        <strong>Active API Operations Monitor:</strong>
        <p style={styles.logText}>{systemLog}</p>
      </div>

      <section style={styles.formSection}>
        <h2>[C]reate New Store Item (HTTP POST)</h2>
        <form onSubmit={onCreate} style={styles.formLines}>
          <input 
            type="text" 
            placeholder="Product Name (e.g., Enterprise Server Module)" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)}
            style={styles.inputField}
          />
          <input 
            type="number" 
            placeholder="Retail Price ($)" 
            value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)}
            style={styles.inputField}
          />
          <button type="submit" style={styles.createBtn}>Execute POST Request</button>
        </form>
      </section>

      <section style={styles.catalogSection}>
        <h2>[R]ead, [U]pdate, and [D]elete Index Records</h2>
        <div style={styles.tableHead}>
          <div style={{ flex: 1 }}>ID</div>
          <div style={{ flex: 4 }}>Product Record Name</div>
          <div style={{ flex: 1.5 }}>Database Price</div>
          <div style={{ flex: 2.5, textAlign: 'right' }}>Method Dispatchers</div>
        </div>

        {products.map((product) => (
          <div key={product.id} style={styles.tableRow}>
            <div style={{ flex: 1, fontWeight: 'bold', color: '#64748b' }}>#{product.id}</div>
            <div style={{ flex: 4, fontWeight: '500' }}>{product.title}</div>
            <div style={{ flex: 1.5, color: '#10b981', fontWeight: 'bold' }}>${product.price}</div>
            <div style={{ flex: 2.5, display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => onUpdate(product.id)} style={styles.updateBtn}>✏️ PUT (Edit)</button>
              <button onClick={() => onDelete(product.id)} style={styles.deleteBtn}>🗑️ DELETE</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const styles = {
  appContainer: { maxWidth: '950px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' },
  title: { color: '#0f172a', marginBottom: '20px', fontSize: '24px', fontWeight: '700' },
  logBox: { backgroundColor: '#0f172a', color: '#38bdf8', padding: '15px', borderRadius: '12px', fontFamily: 'monospace', marginBottom: '25px' },
  logText: { margin: '5px 0 0 0', color: '#fff', fontSize: '14px' },
  formSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  formLines: { display: 'flex', gap: '12px', marginTop: '15px' },
  inputField: { flex: 2, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' },
  createBtn: { flex: 1, backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  catalogSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  tableHead: { display: 'flex', borderBottom: '2px solid #cbd5e1', paddingBottom: '12px', fontWeight: 'bold', color: '#475569', fontSize: '14px' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
  updateBtn: { backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }
};