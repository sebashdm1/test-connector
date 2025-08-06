const { Client } = require('pg');

// Configuración de conexión a PostgreSQL
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'foo_database',
  user: process.env.USER, // Tu usuario de sistema
  password: '', // Sin password para localhost
});

async function initializeDatabase() {
  try {
    // Conectar a PostgreSQL
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Crear esquemas
    await client.query('CREATE SCHEMA IF NOT EXISTS metadata');
    await client.query('CREATE SCHEMA IF NOT EXISTS humanresources');
    console.log('✅ Esquemas creados');

    // Crear tabla metadata.tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS metadata.tables (
        name VARCHAR(255),
        schema_name VARCHAR(255)
      )
    `);

    // Crear tabla metadata.views
    await client.query(`
      CREATE TABLE IF NOT EXISTS metadata.views (
        name VARCHAR(255),
        schema_name VARCHAR(255),
        source VARCHAR(255)
      )
    `);

    // Crear tabla metadata.procedures
    await client.query(`
      CREATE TABLE IF NOT EXISTS metadata.procedures (
        name VARCHAR(255),
        definition TEXT
      )
    `);

    console.log('✅ Tablas de metadata creadas');

    // Limpiar datos existentes
    await client.query('DELETE FROM metadata.tables');
    await client.query('DELETE FROM metadata.views');
    await client.query('DELETE FROM metadata.procedures');

    // Insertar datos de tables
    const tablesData = [
      ['tables', 'metadata'],
      ['views', 'metadata'], 
      ['procedures', 'metadata'],
      ['roles', 'humanresources'],
      ['employees', 'humanresources'],
      ['salary', 'humanresources']
    ];

    for (const [name, schema] of tablesData) {
      await client.query(
        'INSERT INTO metadata.tables (name, schema_name) VALUES ($1, $2)',
        [name, schema]
      );
    }

    // Insertar datos de views
    const viewsData = [
      ['employee_view', 'humanresources', 'roles'],
      ['employee_view', 'humanresources', 'employees'],
      ['employee_view', 'humanresources', 'salary']
    ];

    for (const [name, schema, source] of viewsData) {
      await client.query(
        'INSERT INTO metadata.views (name, schema_name, source) VALUES ($1, $2, $3)',
        [name, schema, source]
      );
    }

    // Insertar datos de procedures
    const proceduresData = [
      ['createEmployee', 'Insert into humanresources.employees (firstname, lastname, roleid) values ($1, $2, $3)'],
      ['createRole', 'Insert into humanresources.roles (name, department, level) values ($1, $2, $3)'],
      ['createSalary', 'Insert into humanresources.salary (employee_id, amount) values ($1, $2)']
    ];

    for (const [name, definition] of proceduresData) {
      await client.query(
        'INSERT INTO metadata.procedures (name, definition) VALUES ($1, $2)',
        [name, definition]
      );
    }

    console.log('✅ Datos insertados correctamente');
    console.log('🎉 Base de datos PostgreSQL lista para usar!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

initializeDatabase(); 