const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/:room', async (req, res) => {
    try {
        const messages = await Message.find({ chatRoom: req.params.room });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
