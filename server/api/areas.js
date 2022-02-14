import { Router } from 'express';
const area = Router();
import format from 'pg-format';
import pool from '../database/pool.js';

// get all areas
area.get('/', async (req, res, next) => {});

// get an area by type
area.get('/', async (req, res, next) => {});

// get a single area

export default area;
