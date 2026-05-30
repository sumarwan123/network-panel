import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import db from '../database/dbManager.js';
import { config } from '../config/config.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

const getPanelConfig = () => {
  const settings = db.getAdminSettings();
  return {
    url: settings.pterodactyl_url,
    apiKey: settings.pterodactyl_api_key,
    locationId: settings.location_id,
    nodeId: settings.node_id,
    eggId: settings.egg_id
  };
};

// Create Panel User
const createPanelUser = async (username, email, password) => {
  try {
    const panelConfig = getPanelConfig();
    
    const response = await axios.post(
      `${panelConfig.url}/api/application/users`,
      {
        email,
        username,
        first_name: username,
        last_name: 'User',
        language: 'en',
        root_admin: false,
        password
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${panelConfig.apiKey}`
        }
      }
    );

    if (response.data.object === 'user') {
      return { success: true, data: response.data.attributes };
    }
    return { success: false, error: 'Failed to create user' };
  } catch (error) {
    console.error('Create panel user error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.errors?.[0]?.detail || 'Error creating user' };
  }
};

// Create Panel Server
const createPanelServer = async (userId, serverName, ram) => {
  try {
    const panelConfig = getPanelConfig();
    const uniqueServerName = `${serverName}-${Date.now()}`;
    const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const response = await axios.post(
      `${panelConfig.url}/api/application/servers`,
      {
        name: uniqueServerName,
        user: userId,
        egg: panelConfig.eggId,
        docker_image: 'ghcr.io/pterodactyl/yolks:nodejs_20',
        startup: 'npm start',
        environment: {
          INST: 'npm',
          USER_UPLOAD: '0',
          AUTO_UPDATE: '0',
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: ram * 1024,
          swap: 0,
          disk: 10240,
          io: 500,
          cpu: 100
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 5
        },
        deploy: {
          locations: [panelConfig.locationId],
          dedicated_ip: false,
          port_range: []
        }
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${panelConfig.apiKey}`
        }
      }
    );

    if (response.data.object === 'server') {
      return {
        success: true,
        data: {
          serverId: response.data.attributes.id,
          serverName: response.data.attributes.name,
          uuid: response.data.attributes.uuid,
          password
        }
      };
    }
    return { success: false, error: 'Failed to create server' };
  } catch (error) {
    console.error('Create panel server error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.errors?.[0]?.detail || 'Error creating server' };
  }
};

// Create Panel
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { username, ram } = req.body;
    const user = db.getUserById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    // Create panel user
    const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const userResult = await createPanelUser(username, `${username}@panel.local`, password);

    if (!userResult.success) {
      return res.status(400).json({ success: false, message: userResult.error });
    }

    // Create panel server
    const serverResult = await createPanelServer(userResult.data.id, username, ram);

    if (!serverResult.success) {
      return res.status(400).json({ success: false, message: serverResult.error });
    }

    // Save to database
    const panel = db.addPanel({
      userId: req.userId,
      username,
      email: `${username}@panel.local`,
      ram,
      serverId: serverResult.data.serverId,
      serverName: serverResult.data.serverName,
      uuid: serverResult.data.uuid
    });

    res.json({
      success: true,
      message: 'Panel berhasil dibuat',
      panel: {
        username,
        email: `${username}@panel.local`,
        password,
        ...serverResult.data
      }
    });
  } catch (error) {
    console.error('Create panel error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get User Panels
router.get('/my-panels', verifyToken, (req, res) => {
  try {
    const panels = db.getPanelsByUserId(req.userId);
    res.json({ success: true, panels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;
