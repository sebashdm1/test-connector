const { getDatabase } = require('../config/database');

class MetadataService {
  
  async getAllTables() {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM metadata.tables');
    return result.rows;
  }

  async getAllViews() {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM metadata.views');
    return result.rows;
  }

  async getAllProcedures() {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM metadata.procedures');
    return result.rows;
  }

  async getBusinessTables() {
    const allTables = await this.getAllTables();
    return allTables.filter(table => table.schema_name !== 'metadata');
  }

  async getUniqueViews() {
    const allViews = await this.getAllViews();
    const uniqueViews = new Map();
    
    allViews.forEach(view => {
      const key = `${view.schema_name}.${view.name}`;
      if (!uniqueViews.has(key)) {
        uniqueViews.set(key, view);
      }
    });
    
    return Array.from(uniqueViews.values());
  }

  async getAllMetadata() {
    const [tables, views, procedures] = await Promise.all([
      this.getAllTables(),
      this.getAllViews(),
      this.getAllProcedures()
    ]);

    return {
      tables,
      views,
      procedures
    };
  }
}

module.exports = new MetadataService(); 