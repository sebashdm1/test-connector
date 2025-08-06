const metadataService = require('./metadata-service');
const { parseTargetTable } = require('../utils/sql-parser');

class GraphService {

  createTableNodes(businessTables) {
    return businessTables.map(table => ({
      id: `table_${table.schema_name}_${table.name}`,
      type: 'TABLE',
      name: table.name,
      schema: table.schema_name,
      fullyQualifiedName: `${table.schema_name}.${table.name}`
    }));
  }

  createViewNodes(uniqueViews) {
    return uniqueViews.map(view => ({
      id: `view_${view.schema_name}_${view.name}`,
      type: 'VIEW',
      name: view.name,
      schema: view.schema_name,
      fullyQualifiedName: `${view.schema_name}.${view.name}`,
      sourceTable: view.source
    }));
  }

  createProcedureNodes(procedures) {
    return procedures.map(procedure => ({
      id: `procedure_${procedure.name}`,
      type: 'PROCEDURE',
      name: procedure.name,
      fullyQualifiedName: procedure.name
    }));
  }

  createTableToViewEdges(allViews, businessTables) {
    const edges = [];
    
    allViews.forEach(view => {
      if (view.source) {
        const sourceTable = businessTables.find(table => 
          table.name === view.source
        );
        
        if (sourceTable) {
          edges.push({
            id: `edge_table_${sourceTable.schema_name}_${sourceTable.name}_to_view_${view.schema_name}_${view.name}`,
            sourceId: `table_${sourceTable.schema_name}_${sourceTable.name}`,
            targetId: `view_${view.schema_name}_${view.name}`,
            type: 'TABLE_TO_VIEW',
            relationshipType: 'FEEDS_INTO'
          });
        }
      }
    });
    
    return edges;
  }

  createProcedureToTableEdges(procedures, businessTables) {
    const edges = [];
    
    procedures.forEach(procedure => {
      const targetTable = parseTargetTable(procedure.definition);
      
      if (targetTable) {
        const [targetSchema, targetTableName] = targetTable.includes('.') 
          ? targetTable.split('.')
          : ['', targetTable];
        
        const matchingTable = businessTables.find(table => {
          if (targetSchema) {
            return table.schema_name === targetSchema && table.name === targetTableName;
          } else {
            return table.name === targetTableName;
          }
        });
        
        if (matchingTable) {
          edges.push({
            id: `edge_procedure_${procedure.name}_to_table_${matchingTable.schema_name}_${matchingTable.name}`,
            sourceId: `procedure_${procedure.name}`,
            targetId: `table_${matchingTable.schema_name}_${matchingTable.name}`,
            type: 'PROCEDURE_TO_TABLE',
            relationshipType: 'INSERTS_INTO'
          });
        }
      }
    });
    
    return edges;
  }

  generateStatistics(nodes, edges) {
    const nodesByType = {
      tables: nodes.filter(node => node.type === 'TABLE').length,
      views: nodes.filter(node => node.type === 'VIEW').length,
      procedures: nodes.filter(node => node.type === 'PROCEDURE').length
    };

    const edgesByType = {
      tableToView: edges.filter(edge => edge.type === 'TABLE_TO_VIEW').length,
      procedureToTable: edges.filter(edge => edge.type === 'PROCEDURE_TO_TABLE').length
    };

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodesByType,
      edgesByType
    };
  }

  async buildDataLineageGraph() {
    const { tables, views, procedures } = await metadataService.getAllMetadata();
    
    const businessTables = tables.filter(table => table.schema_name !== 'metadata');
    
    const uniqueViews = new Map();
    views.forEach(view => {
      const key = `${view.schema_name}.${view.name}`;
      if (!uniqueViews.has(key)) {
        uniqueViews.set(key, view);
      }
    });
    const uniqueViewsArray = Array.from(uniqueViews.values());
    
    const tableNodes = this.createTableNodes(businessTables);
    const viewNodes = this.createViewNodes(uniqueViewsArray);
    const procedureNodes = this.createProcedureNodes(procedures);
    
    const allNodes = [...tableNodes, ...viewNodes, ...procedureNodes];
    
    const tableToViewEdges = this.createTableToViewEdges(views, businessTables);
    const procedureToTableEdges = this.createProcedureToTableEdges(procedures, businessTables);
    
    const allEdges = [...tableToViewEdges, ...procedureToTableEdges];
    
    const statistics = this.generateStatistics(allNodes, allEdges);
    
    return {
      success: true,
      graph: {
        nodes: allNodes,
        edges: allEdges
      },
      statistics
    };
  }
}

module.exports = new GraphService(); 