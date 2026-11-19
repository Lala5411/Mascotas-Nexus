const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const root = path.resolve(__dirname, '..');
const backendPort = process.env.E2E_BACKEND_PORT || '8081';
const frontendPort = process.env.E2E_FRONTEND_PORT || '3001';
const apiBaseUrl = process.env.E2E_API_BASE_URL || `http://localhost:${backendPort}/api`;
const backendCommand = process.platform === 'win32'
  ? '.\\mvnw.cmd spring-boot:run'
  : 'bash ./mvnw spring-boot:run';

process.env.E2E_API_BASE_URL = apiBaseUrl;

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: `http://127.0.0.1:${frontendPort}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      command: backendCommand,
      cwd: path.join(root, 'backend'),
      url: `http://127.0.0.1:${backendPort}/api/mascotas/disponibles`,
      timeout: 180000,
      reuseExistingServer: false,
      env: {
        ...process.env,
        SERVER_PORT: backendPort,
        SPRING_DATASOURCE_URL: process.env.SPRING_DATASOURCE_URL
          || 'jdbc:postgresql://localhost:5432/mascota_nexus_e2e',
        SPRING_DATASOURCE_USERNAME: process.env.SPRING_DATASOURCE_USERNAME || 'postgres',
        SPRING_DATASOURCE_PASSWORD: process.env.SPRING_DATASOURCE_PASSWORD || '123'
      }
    },
    {
      command: 'npm start',
      cwd: __dirname,
      url: `http://127.0.0.1:${frontendPort}`,
      timeout: 120000,
      reuseExistingServer: false,
      env: {
        ...process.env,
        BROWSER: 'none',
        E2E_API_BASE_URL: apiBaseUrl,
        HOST: '127.0.0.1',
        PORT: frontendPort,
        REACT_APP_API_BASE_URL: apiBaseUrl
      }
    }
  ]
});
