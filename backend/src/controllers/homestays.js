const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

const DATA_FILE = path.join(__dirname, '../../../data/homestays.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function listDb() {
  const [rows] = await pool.query('SELECT * FROM homestays');
  return rows.map(r => ({
    _id: r.id,
    name: r.name,
    address: r.address,
    googleMapEmbed: r.googleMapEmbed,
    images: r.images ? JSON.parse(r.images) : [],
    contact: r.contact ? JSON.parse(r.contact) : {},
  }));
}

async function getByIdDb(id) {
  const [rows] = await pool.query('SELECT * FROM homestays WHERE id = ?', [id]);
  if (!rows.length) return null;
  const r = rows[0];
  const [rooms] = await pool.query('SELECT * FROM rooms WHERE homestay_id = ?', [id]);
  return {
    _id: r.id,
    name: r.name,
    address: r.address,
    googleMapEmbed: r.googleMapEmbed,
    images: r.images ? JSON.parse(r.images) : [],
    contact: r.contact ? JSON.parse(r.contact) : {},
    rooms: rooms.map(room => ({
      roomName: room.roomName,
      amenities: room.amenities ? JSON.parse(room.amenities) : []
    }))
  };
}

exports.list = async (req, res) => {
  if (process.env.USE_DB === '1') {
    try {
      const data = await listDb();
      return res.json(data);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'DB error' });
    }
  }
  const list = readData();
  res.json(list);
};

exports.getById = async (req, res) => {
  if (process.env.USE_DB === '1') {
    try {
      const data = await getByIdDb(req.params.id);
      if (!data) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'DB error' });
    }
  }
  const list = readData();
  const item = list.find(h => h._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

exports.create = async (req, res) => {
  if (process.env.USE_DB === '1') {
    const body = req.body;
    const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
    const id = uuidv4();
    try {
      await pool.query('INSERT INTO homestays (id, name, address, googleMapEmbed, images, contact) VALUES (?, ?, ?, ?, ?, ?)', [
        id,
        body.name || '',
        body.address || '',
        body.googleMapEmbed || '',
        JSON.stringify(images),
        body.contact ? JSON.stringify(JSON.parse(body.contact)) : JSON.stringify({})
      ]);
      // rooms insertion if provided
      if (body.rooms) {
        const rooms = JSON.parse(body.rooms);
        for (const r of rooms) {
          const rid = uuidv4();
          await pool.query('INSERT INTO rooms (id, homestay_id, roomName, amenities) VALUES (?, ?, ?, ?)', [rid, id, r.roomName || '', JSON.stringify(r.amenities || [])]);
        }
      }
      const created = await getByIdDb(id);
      return res.status(201).json(created);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'DB error' });
    }
  }

  const list = readData();
  const body = req.body;
  const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
  const newItem = {
    _id: uuidv4(),
    name: body.name || '',
    address: body.address || '',
    googleMapEmbed: body.googleMapEmbed || '',
    images,
    rooms: body.rooms ? JSON.parse(body.rooms) : [],
    contact: body.contact ? JSON.parse(body.contact) : {},
  };
  list.push(newItem);
  writeData(list);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  if (process.env.USE_DB === '1') {
    const id = req.params.id;
    const body = req.body;
    const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
    try {
      const [rows] = await pool.query('SELECT * FROM homestays WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      const cur = rows[0];
      const newImages = (cur.images ? JSON.parse(cur.images) : []).concat(images);
      await pool.query('UPDATE homestays SET name = ?, address = ?, googleMapEmbed = ?, images = ?, contact = ? WHERE id = ?', [
        body.name || cur.name,
        body.address || cur.address,
        body.googleMapEmbed || cur.googleMapEmbed,
        JSON.stringify(newImages),
        body.contact ? JSON.stringify(JSON.parse(body.contact)) : cur.contact,
        id
      ]);
      // handle rooms replace
      if (body.rooms) {
        await pool.query('DELETE FROM rooms WHERE homestay_id = ?', [id]);
        const rooms = JSON.parse(body.rooms);
        for (const r of rooms) {
          const rid = uuidv4();
          await pool.query('INSERT INTO rooms (id, homestay_id, roomName, amenities) VALUES (?, ?, ?, ?)', [rid, id, r.roomName || '', JSON.stringify(r.amenities || [])]);
        }
      }
      const updated = await getByIdDb(id);
      return res.json(updated);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'DB error' });
    }
  }

  const list = readData();
  const idx = list.findIndex(h => h._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const body = req.body;
  const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
  const item = list[idx];
  item.name = body.name || item.name;
  item.address = body.address || item.address;
  item.googleMapEmbed = body.googleMapEmbed || item.googleMapEmbed;
  if (images.length) item.images = item.images.concat(images);
  if (body.rooms) item.rooms = JSON.parse(body.rooms);
  if (body.contact) item.contact = JSON.parse(body.contact);
  list[idx] = item;
  writeData(list);
  res.json(item);
};

exports.remove = async (req, res) => {
  if (process.env.USE_DB === '1') {
    const id = req.params.id;
    try {
      await pool.query('DELETE FROM homestays WHERE id = ?', [id]);
      return res.json({ message: 'Deleted' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'DB error' });
    }
  }
  const list = readData();
  const idx = list.findIndex(h => h._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const [removed] = list.splice(idx, 1);
  writeData(list);
  res.json({ message: 'Deleted', removed });
};
