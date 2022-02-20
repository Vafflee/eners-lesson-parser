const express = require('express');
const cors = require('cors');
const getLessons = require('./getLessons');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}))

app.get('/lessons/:week', async (req, res) => {
    if (!req.params.week) return res.status(400).json({message: 'No week number'});
    try {
        const lessons = await getLessons(req.params.week);
        return res.status(200).json(lessons);
    } catch (err) {
        return res.status(500).json({message: "Getting lessons error"});
    }
});

app.listen(PORT, () => {
    console.log('Server is listening on port: ' + PORT)
});