import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://192.168.100.16:5000/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  const [loginForm, setLoginForm] = useState({ email: 'admin@test.com', password: '' });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', category: 'Match', venue: '', organizer: '', 
    event_date: '', status: 'Upcoming', ticket_price: 0, capacity: 81044 
  });

  const [newEvent, setNewEvent] = useState({
    title: '', description: '', category: 'Match',
    venue: 'Santiago Bernabéu', organizer: 'Real Madrid C.F.',
    event_date: '', status: 'Upcoming', ticket_price: 50.00, capacity: 81044
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events`, { params: { search, category } });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, loginForm);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed: Invalid credentials');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/events`, newEvent);
      setNewEvent({ 
        title: '', description: '', category: 'Match', 
        venue: 'Santiago Bernabéu', organizer: 'Real Madrid C.F.', 
        event_date: '', status: 'Upcoming', ticket_price: 50.00, capacity: 81044 
      });
      fetchEvents();
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleStartEdit = (evt) => {
    setEditingId(evt.id);
    setEditForm({
      title: evt.title,
      category: evt.category,
      venue: evt.venue,
      organizer: evt.organizer,
      event_date: evt.event_date ? new Date(evt.event_date).toISOString().slice(0, 16) : '',
      status: evt.status || 'Upcoming',
      ticket_price: evt.ticket_price || 0,
      capacity: evt.capacity || 81044,
      description: evt.description || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`${API_BASE}/events/${id}`, editForm);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      alert('Error updating event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Error deleting event');
    }
  };
  // Calculate KPI Summary Metrics
const totalEvents = events.length;
const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
const totalRevenuePotential = events.reduce((sum, e) => sum + (Number(e.ticket_price) || 0) * (Number(e.capacity) || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
  
  return (
    <div className="container">
    <header className="header">
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <img 
      src="https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" 
      alt="Real Madrid Badge" 
      style={{ width: '45px', height: '45px', objectFit: 'contain' }}
    />
    <h1>Real Madrid Event Dashboard</h1>
  </div>
  {token ? (
    <button onClick={() => { setToken(''); localStorage.removeItem('token'); }}>Logout</button>
  ) : (
    <form onSubmit={handleLogin} className="login-form">
      <input 
        type="email" 
        placeholder="Email"
        value={loginForm.email} 
        onChange={e => setLoginForm({...loginForm, email: e.target.value})} 
      />
      <input 
        type="password" 
        placeholder="Password"
        value={loginForm.password} 
        onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
      />
      <button className="btn-primary" type="submit">Admin Login</button>
    </form>
  )}
</header>
       <div className="stats-grid">
  <div className="stat-card">
    <span className="stat-label">Total Events</span>
    <span className="stat-value">{totalEvents}</span>
  </div>
  <div className="stat-card">
    <span className="stat-label">Upcoming Events</span>
    <span className="stat-value">{upcomingEvents}</span>
  </div>
  <div className="stat-card">
    <span className="stat-label">Est. Revenue Potential</span>
    <span className="stat-value">€{totalRevenuePotential.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
  </div>
  <div className="stat-card">
    <span className="stat-label">Total Seat Capacity</span>
    <span className="stat-value">{totalCapacity.toLocaleString()}</span>
  </div>
</div>
      <div className="controls-bar">
        <input 
          type="text" 
          placeholder="Search events or organizers..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Match">Match</option>
          <option value="Training">Training</option>
          <option value="Press Conference">Press Conference</option>
        </select>
      </div>

      {token && (
        <form onSubmit={handleCreateEvent} className="form-card">
          <h3>Add New Event</h3>
          <div className="form-grid">
            <input placeholder="Event Title" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
            <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
              <option value="Match">Match</option>
              <option value="Training">Training</option>
              <option value="Press Conference">Press Conference</option>
            </select>
            <input placeholder="Venue" required value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} />
            <input placeholder="Organizer" required value={newEvent.organizer} onChange={e => setNewEvent({...newEvent, organizer: e.target.value})} />
            <input type="datetime-local" required value={newEvent.event_date} onChange={e => setNewEvent({...newEvent, event_date: e.target.value})} />
            <select value={newEvent.status} onChange={e => setNewEvent({...newEvent, status: e.target.value})}>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <input type="number" placeholder="Ticket Price (€)" value={newEvent.ticket_price} onChange={e => setNewEvent({...newEvent, ticket_price: e.target.value})} />
            <input type="number" placeholder="Capacity" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: e.target.value})} />
          </div>
          <button className="btn-primary" type="submit">Create Event</button>
        </form>
      )}

      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Organizer</th>
              <th>Price (€)</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                {editingId === evt.id ? (
                  <>
                    <td><input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} /></td>
                    <td>
                      <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                        <option value="Match">Match</option>
                        <option value="Training">Training</option>
                        <option value="Press Conference">Press Conference</option>
                      </select>
                    </td>
                    <td><input type="datetime-local" value={editForm.event_date} onChange={e => setEditForm({...editForm, event_date: e.target.value})} /></td>
                    <td><input value={editForm.venue} onChange={e => setEditForm({...editForm, venue: e.target.value})} /></td>
                    <td><input value={editForm.organizer} onChange={e => setEditForm({...editForm, organizer: e.target.value})} /></td>
                    <td><input type="number" value={editForm.ticket_price} onChange={e => setEditForm({...editForm, ticket_price: e.target.value})} /></td>
                    <td><input type="number" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})} /></td>
                    <td>
                      <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-primary" onClick={() => handleSaveEdit(evt.id)}>Save</button>
                        <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: '600' }}>{evt.title}</td>
                    <td><span className="badge">{evt.category}</span></td>
                    <td>{new Date(evt.event_date).toLocaleString()}</td>
                    <td>{evt.venue}</td>
                    <td>{evt.organizer}</td>
                    <td>€{Number(evt.ticket_price || 0).toFixed(2)}</td>
                    <td>{Number(evt.capacity || 0).toLocaleString()}</td>
                    <td><span className={`status-${(evt.status || 'upcoming').toLowerCase()}`}>{evt.status || 'Upcoming'}</span></td>
                    <td>
                      {token ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-warning" onClick={() => handleStartEdit(evt)}>Edit</button>
                          <button className="btn-danger" onClick={() => handleDelete(evt.id)}>Delete</button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Login required</span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}