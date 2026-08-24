const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;