// routes/data.js
const express = require('express');
const router  = express.Router();

const StaticData = require('../models/StaticData');
const SensorData = require('../models/SensorData');
const Warehouse  = require('../models/Warehouse');
const authenticateToken = require('../middleware/auth');

// Helper to merge two objects, giving precedence to sensorProps
function mergeProps(staticProps = {}, sensorProps = {}) {
  return { ...staticProps, ...sensorProps };
}

// GET /data/all
// Returns combined rooms, machines, and cartons_num
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [staticDoc, sensorDoc, wh] = await Promise.all([
      StaticData.findOne().lean(),
      SensorData.findOne().lean(),
      Warehouse.findOne().lean()
    ]);

    const staticRooms   = staticDoc?.rooms   || [];
    const sensorRooms   = sensorDoc?.rooms   || [];
    const staticMachines = staticDoc?.machines || [];
    const sensorMachines = sensorDoc?.machines || [];

    // Combine rooms by matching name
    const rooms = sensorRooms.map(sr => {
      const st = staticRooms.find(r => r.name === sr.name) || {};
      return mergeProps(st, sr);
    });

    // Combine machines by matching name
    const machines = sensorMachines.map(sd => {
      const st = staticMachines.find(m => m.name === sd.name) || {};
      return mergeProps(st, sd);
    });

    res.json({
      rooms,
      machines,
      cartons_num: wh?.cartons_num ?? 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching combined data');
  }
});

// GET /data/rooms
// Returns combined room data only
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const [staticDoc, sensorDoc] = await Promise.all([
      StaticData.findOne().lean(),
      SensorData.findOne().lean()
    ]);

    const staticRooms = staticDoc?.rooms || [];
    const sensorRooms = sensorDoc?.rooms || [];

    const rooms = sensorRooms.map(sr => {
      const st = staticRooms.find(r => r.name === sr.name) || {};
      return mergeProps(st, sr);
    });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching rooms data');
  }
});

// GET /data/machines
// Returns combined machine data only
router.get('/machines', authenticateToken, async (req, res) => {
  try {
    const [staticDoc, sensorDoc] = await Promise.all([
      StaticData.findOne().lean(),
      SensorData.findOne().lean()
    ]);

    const staticMachines = staticDoc?.machines || [];
    const sensorMachines = sensorDoc?.machines || [];

    const machines = sensorMachines.map(sd => {
      const st = staticMachines.find(m => m.name === sd.name) || {};
      return mergeProps(st, sd);
    });

    res.json(machines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching machines data');
  }
});

// GET /data/warehouse
// Returns just the cartons count
router.get('/warehouse', authenticateToken, async (req, res) => {
  try {
    const wh = await Warehouse.findOne().lean();
    res.json({ cartons_num: wh?.cartons_num ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching warehouse data');
  }
});

module.exports = router;
