const API_BASE_URL = process.env.E2E_API_BASE_URL || 'http://localhost:8081/api';
const { Client } = require('pg');

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

async function readSuccessfulResponse(response, operation) {
  if (!response.ok()) {
    throw new Error(`${operation} failed with ${response.status()}: ${await response.text()}`);
  }
  return response.json();
}

async function createUser(request, name = 'Adoptante E2E') {
  const suffix = uniqueSuffix();
  const user = {
    nombre: `${name} ${suffix}`,
    email: `adoptante-${suffix}@example.test`,
    password: `Demo-${suffix}-123`,
    rol: 'ROLE_USER'
  };
  const response = await request.post(`${API_BASE_URL}/auth/register`, { data: user });
  const savedUser = await readSuccessfulResponse(response, 'Register E2E user');

  return { ...user, id: savedUser.id };
}

async function createPet(request, name, species = 'Gato') {
  const response = await request.post(`${API_BASE_URL}/mascotas`, {
    data: {
      nombre: name,
      especie: species,
      edad: 2,
      estado: 'DISPONIBLE',
      imagenUrl: ''
    }
  });

  return readSuccessfulResponse(response, 'Create E2E pet');
}

async function createApplication(request, user, pet) {
  const response = await request.post(`${API_BASE_URL}/solicitudes`, {
    data: {
      usuario: { id: user.id },
      mascota: { id: pet.id },
      mensaje: 'Solicitud creada por la prueba de extremo a extremo.',
      tipoVivienda: 'CASA',
      horasLibres: 6,
      nivelActividad: 'ALTO'
    }
  });

  return readSuccessfulResponse(response, 'Create E2E adoption application');
}

async function login(page, email, password) {
  await page.goto('/');
  await page.getByLabel('Email:').fill(email);
  await page.getByLabel('Contraseña:').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

async function cleanupTestData({ applicationId, petId, userId }) {
  const jdbcUrl = process.env.SPRING_DATASOURCE_URL
    || 'jdbc:postgresql://localhost:5432/mascota_nexus_e2e';
  const databaseUrl = new URL(jdbcUrl.replace(/^jdbc:/, ''));
  const database = databaseUrl.pathname.slice(1);
  if (database !== 'mascota_nexus_e2e') {
    throw new Error('E2E cleanup is restricted to the mascota_nexus_e2e database.');
  }

  const client = new Client({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 5432),
    database,
    user: process.env.SPRING_DATASOURCE_USERNAME || 'postgres',
    password: process.env.SPRING_DATASOURCE_PASSWORD || '123'
  });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      `DELETE FROM solicitud
       WHERE ($1::bigint IS NOT NULL AND id = $1)
          OR ($2::bigint IS NOT NULL AND mascota_id = $2)
          OR ($3::bigint IS NOT NULL AND usuario_id = $3)`,
      [applicationId || null, petId || null, userId || null]
    );
    if (petId) {
      await client.query('DELETE FROM mascota WHERE id = $1', [petId]);
    }
    if (userId) {
      await client.query('DELETE FROM usuario WHERE id = $1', [userId]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  API_BASE_URL,
  cleanupTestData,
  createApplication,
  createPet,
  createUser,
  login,
  readSuccessfulResponse,
  uniqueSuffix
};
