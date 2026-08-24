const db = require('../config/db');

// Get all events
const getEvents = async (req, res) => {
  const { search, category } = req.query;
  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR organizer ILIKE $${params.length})`;
    }

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY event_date ASC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Create Event
const createEvent = async (req, res) => {
  const { title, description, category, venue, organizer, event_date, status, ticket_price, capacity } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO events (title, description, category, venue, organizer, event_date, status, ticket_price, capacity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title, 
        description || '', 
        category, 
        venue, 
        organizer, 
        event_date, 
        status || 'Upcoming', 
        ticket_price || 0, 
        capacity || 81044
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, venue, organizer, event_date, status, ticket_price, capacity } = req.body;
  try {
    const result = await db.query(
      `UPDATE events 
       SET title = $1, description = $2, category = $3, venue = $4, organizer = $5, event_date = $6, status = $7, ticket_price = $8, capacity = $9 
       WHERE id = $10 RETURNING *`,
      [
        title, 
        description || '', 
        category, 
        venue, 
        organizer, 
        event_date, 
        status, 
        ticket_price || 0, 
        capacity || 81044, 
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};