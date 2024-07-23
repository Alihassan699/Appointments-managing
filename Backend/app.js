import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from 'dotenv';
import {connectdb} from "./config/connection.js";
import appointmentsRoutes from './router/router.js';

// Correct usage of config
config({ path: './config.env' });

const app = express();
const port = process.env.PORT || 3000;

//connection of frontend
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({ origin: frontendUrl }));

// Connect to the database and handle any connection errors
connectdb().catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
app.use('/api', appointmentsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
