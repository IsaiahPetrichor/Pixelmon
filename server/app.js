import express from 'express';
const app = express();
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

import areas from './api/areas.js';
app.use('/api/areas', areas);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
