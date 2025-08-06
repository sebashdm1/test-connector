function parseTargetTable(sqlDefinition) {
  const insertPattern = /INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)/i;
  const match = sqlDefinition.match(insertPattern);
  
  if (match) {
    return match[1];
  }
  
  return null;
}

function getOperationType(sqlDefinition) {
  if (sqlDefinition.toUpperCase().includes('INSERT')) return 'INSERT';
  if (sqlDefinition.toUpperCase().includes('UPDATE')) return 'UPDATE';
  if (sqlDefinition.toUpperCase().includes('DELETE')) return 'DELETE';
  if (sqlDefinition.toUpperCase().includes('SELECT')) return 'SELECT';
  return 'UNKNOWN';
}

module.exports = {
  parseTargetTable,
  getOperationType
}; 