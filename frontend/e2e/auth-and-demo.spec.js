const { test, expect } = require('@playwright/test');
const {
  API_BASE_URL,
  cleanupTestData,
  login,
  uniqueSuffix
} = require('./support/fixtures');

test('un visitante ve el error de acceso y puede registrarse e iniciar sesión', async ({ page }) => {
  const suffix = uniqueSuffix();
  const email = `demo-${suffix}@example.test`;
  const password = `Demo-${suffix}-123`;
  let userId;

  try {
    await login(page, email, 'incorrecta');
    await expect(page.getByRole('alert')).toHaveText('Credenciales incorrectas. Intenta de nuevo.');

    await page.getByRole('button', { name: 'Regístrate' }).click();
    await page.getByLabel('Nombre completo:').fill(`Adoptante ${suffix}`);
    await page.getByLabel('Email:').fill(email);
    await page.getByLabel('Contraseña:').fill(password);
    const registrationPromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === '/api/auth/register'
      && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Crear Cuenta' }).click();
    const registrationResponse = await registrationPromise;
    userId = (await registrationResponse.json()).id;
    await expect(page.getByRole('status')).toHaveText('¡Registro exitoso! Ahora puedes iniciar sesión.');

    await page.getByLabel('Email:').fill(email);
    await page.getByLabel('Contraseña:').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page.getByRole('heading', { name: 'Encuentra a tu nuevo compañero' })).toBeVisible();
    await expect(page.getByText(`Hola, Adoptante ${suffix}`)).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Encuentra a tu nuevo compañero' })).toBeVisible();
  } finally {
    if (userId) await cleanupTestData({ userId });
  }
});
