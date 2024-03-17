const router = require("express").Router();

router.get('/signOut', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Logging Out:', err);
            return res.status(500).send('Logging Out');
        }
    });
});

module.exports = router;