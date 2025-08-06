const express = require('express');
const metadataService = require('./services/metadata-service');
const graphService = require('./services/graph-service');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Foo Database Connector',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      metadata: {
        tables: '/api/metadata/tables',
        views: '/api/metadata/views',
        procedures: '/api/metadata/procedures'
      },
      graph: '/api/graph'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/metadata/tables', async (req, res) => {
  try {
    const tables = await metadataService.getAllTables();
    res.json({
      success: true,
      data: tables,
      count: tables.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/metadata/views', async (req, res) => {
  try {
    const views = await metadataService.getAllViews();
    res.json({
      success: true,
      data: views,
      count: views.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/metadata/procedures', async (req, res) => {
  try {
    const procedures = await metadataService.getAllProcedures();
    res.json({
      success: true,
      data: procedures,
      count: procedures.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/graph', async (req, res) => {
  try {
    const graphData = await graphService.buildDataLineageGraph();
    res.json(graphData);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = app; 