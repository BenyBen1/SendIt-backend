const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    res.send("orders reached")
})

router.get('/:id', (req, res) => {
    res.send(`order details for id: ${req.params.id}`)
})

module.exports = router;