import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import ClientView from './components/ClientView';
import AddClientModal from './components/AddClientModal';
import Login from './components/Login';

const defaultData = {
  clients: [],
  activities: {},
  pendingItems: {},
  psaItems: {},
};

function mapItemsByClient(items, keyName = 'clientId') {
  return items.reduce((acc, item) => {
    const clientId = item[keyName];
    if (!acc[clientId]) acc[clientId] = [];
    acc[clientId].push(item);
    return acc;
  }, {});
}

function makeSyncPayload(currentData) {
  const activities = [];
  const pendingItems = [];
  const psaItems = [];

  Object.entries(currentData.activities).forEach(([clientId, items]) => {
    items.forEach(i => activities.push({ ...i, clientId }));
  });
  Object.entries(currentData.pendingItems).forEach(([clientId, items]) => {
    items.forEach(i => pendingItems.push({ ...i, clientId }));
  });
  Object.entries(currentData.psaItems).forEach(([clientId, items]) => {
    items.forEach(i => psaItems.push({ ...i, clientId }));
  });

  return {
    clients: currentData.clients,
    activities,
    pendingItems,
    psaItems,
  };
}

export default function App() {
  const [data, setData] = useState(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Response not ok');
        const json = await res.json();

        setData({
          clients: json.clients || [],
          activities: mapItemsByClient(json.activities || []),
          pendingItems: mapItemsByClient(json.pending || []),
          psaItems: mapItemsByClient(json.psa || []),
        });
      } catch (error) {
        console.warn('No DB data, using defaults:', error); // fallback
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    async function syncData() {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeSyncPayload(data)),
        });
      } catch (error) {
        console.error('Error syncing to local DB', error);
      }
    }

    syncData();
  }, [data, isLoaded]);

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');

  const selectedClient = data.clients.find(c => c.id === selectedClientId);
  const clientActivities = (data.activities[selectedClientId] || []).slice().sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const clientPending = data.pendingItems[selectedClientId] || [];
  const clientPsa = data.psaItems[selectedClientId] || [];

  const addClient = (client) => {
    const newClient = { ...client, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient],
      activities: { ...prev.activities, [newClient.id]: [] },
      pendingItems: { ...prev.pendingItems, [newClient.id]: [] },
      psaItems: { ...prev.psaItems, [newClient.id]: [] },
    }));
    setSelectedClientId(newClient.id);
    setShowAddClient(false);
  };

  const updateClient = (clientId, changes) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === clientId ? { ...c, ...changes } : c),
    }));
  };

  const deleteClient = (clientId) => {
    setData(prev => {
      const { [clientId]: _a, ...restActivities } = prev.activities;
      const { [clientId]: _p, ...restPending } = prev.pendingItems;
      const { [clientId]: _psa, ...restPsa } = prev.psaItems;
      return {
        ...prev,
        clients: prev.clients.filter(c => c.id !== clientId),
        activities: restActivities,
        pendingItems: restPending,
        psaItems: restPsa,
      };
    });
    if (selectedClientId === clientId) setSelectedClientId(null);
  };

  const addActivity = (clientId, text, date) => {
    const activity = {
      id: Date.now().toString(),
      text,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [clientId]: [...(prev.activities[clientId] || []), activity],
      },
    }));
  };

  const updateActivity = (clientId, activityId, changes) => {
    setData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [clientId]: (prev.activities[clientId] || []).map(a =>
          a.id === activityId ? { ...a, ...changes } : a
        ),
      },
    }));
  };

  const deleteActivity = (clientId, activityId) => {
    setData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [clientId]: (prev.activities[clientId] || []).filter(a => a.id !== activityId),
      },
    }));
  };

  const addPending = (clientId, text) => {
    const item = { id: Date.now().toString(), text, done: false, createdAt: new Date().toISOString() };
    setData(prev => ({
      ...prev,
      pendingItems: {
        ...prev.pendingItems,
        [clientId]: [...(prev.pendingItems[clientId] || []), item],
      },
    }));
  };

  const togglePending = (clientId, itemId) => {
    setData(prev => ({
      ...prev,
      pendingItems: {
        ...prev.pendingItems,
        [clientId]: (prev.pendingItems[clientId] || []).map(i =>
          i.id === itemId ? { ...i, done: !i.done } : i
        ),
      },
    }));
  };

  const deletePending = (clientId, itemId) => {
    setData(prev => ({
      ...prev,
      pendingItems: {
        ...prev.pendingItems,
        [clientId]: (prev.pendingItems[clientId] || []).filter(i => i.id !== itemId),
      },
    }));
  };

  const updatePending = (clientId, itemId, text) => {
    setData(prev => ({
      ...prev,
      pendingItems: {
        ...prev.pendingItems,
        [clientId]: (prev.pendingItems[clientId] || []).map(i =>
          i.id === itemId ? { ...i, text } : i
        ),
      },
    }));
  };

  const addPsa = (clientId, text) => {
    const item = { id: Date.now().toString(), text, createdAt: new Date().toISOString() };
    setData(prev => ({
      ...prev,
      psaItems: {
        ...prev.psaItems,
        [clientId]: [...(prev.psaItems[clientId] || []), item],
      },
    }));
  };

  const deletePsa = (clientId, itemId) => {
    setData(prev => ({
      ...prev,
      psaItems: {
        ...prev.psaItems,
        [clientId]: (prev.psaItems[clientId] || []).filter(i => i.id !== itemId),
      },
    }));
  };

  const updatePsa = (clientId, itemId, text) => {
    setData(prev => ({
      ...prev,
      psaItems: {
        ...prev.psaItems,
        [clientId]: (prev.psaItems[clientId] || []).map(i =>
          i.id === itemId ? { ...i, text } : i
        ),
      },
    }));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        clients={data.clients}
        activities={data.activities}
        pendingItems={data.pendingItems}
        selectedClientId={selectedClientId}
        onSelectClient={(id) => { setSelectedClientId(id); setActiveTab('activities'); }}
        onAddClient={() => setShowAddClient(true)}
        onDeleteClient={deleteClient}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selectedClient ? (
          <ClientView
            client={selectedClient}
            activities={clientActivities}
            pendingItems={clientPending}
            psaItems={clientPsa}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUpdateClient={(changes) => updateClient(selectedClientId, changes)}
            onDeleteClient={() => deleteClient(selectedClientId)}
            onAddActivity={(text, date) => addActivity(selectedClientId, text, date)}
            onUpdateActivity={(id, changes) => updateActivity(selectedClientId, id, changes)}
            onDeleteActivity={(id) => deleteActivity(selectedClientId, id)}
            onAddPending={(text) => addPending(selectedClientId, text)}
            onTogglePending={(id) => togglePending(selectedClientId, id)}
            onDeletePending={(id) => deletePending(selectedClientId, id)}
            onUpdatePending={(id, text) => updatePending(selectedClientId, id, text)}
            onAddPsa={(text) => addPsa(selectedClientId, text)}
            onDeletePsa={(id) => deletePsa(selectedClientId, id)}
            onUpdatePsa={(id, text) => updatePsa(selectedClientId, id, text)}
          />
        ) : (
          <EmptyState onAddClient={() => setShowAddClient(true)} />
        )}
      </main>

      {showAddClient && (
        <AddClientModal onAdd={addClient} onClose={() => setShowAddClient(false)} />
      )}
    </div>
  );
}

function EmptyState({ onAddClient }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: 64, opacity: 0.3 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text2)', marginBottom: 8 }}>Ningún cliente seleccionado</p>
        <p style={{ fontSize: '0.95rem' }}>Selecciona un cliente del panel izquierdo o agrega uno nuevo</p>
      </div>
      <button onClick={onAddClient} style={{
        background: 'var(--accent)', color: '#fff', border: 'none',
        borderRadius: 'var(--radius)', padding: '10px 20px', fontSize: '0.95rem',
        fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        + Agregar cliente
      </button>
    </div>
  );
}
