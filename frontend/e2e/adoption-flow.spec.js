const { test, expect } = require('@playwright/test');
const {
  API_BASE_URL,
  cleanupTestData,
  createPet,
  createUser,
  login,
  uniqueSuffix,
  readSuccessfulResponse
} = require('./support/fixtures');

test('un adoptante busca una mascota, postula y conserva su historial', async ({ page, request }) => {
  const suffix = uniqueSuffix();
  let user;
  let pet;
  let application;

  try {
    user = await createUser(request);
    const petName = `Gato E2E ${suffix}`;
    pet = await createPet(request, petName, 'Gato');

    await login(page, user.email, 'contrasena-incorrecta');
    await expect(page.getByRole('alert')).toHaveText('Credenciales incorrectas. Intenta de nuevo.');

    await login(page, user.email, user.password);
    await expect(page.getByRole('heading', { name: 'Encuentra a tu nuevo compañero' })).toBeVisible();

    await page.getByLabel('Buscar por nombre').fill(petName);
    await page.getByLabel('Filtrar por especie').selectOption('Gato');
    await expect(page.getByRole('heading', { name: petName })).toBeVisible();

    await page.getByRole('button', { name: 'Postularme para Adopción' }).click();
    await page.getByLabel('Tipo de vivienda').selectOption('APARTAMENTO');
    await page.getByLabel('Horas disponibles al día').fill('8');
    await page.getByLabel('Ritmo de vida').selectOption('ALTO');
    await page.getByLabel(/¿Por qué quieres adoptar/).fill(
      'Tengo espacio y tiempo para cuidar a esta mascota.'
    );
    await page.getByRole('button', { name: 'Calcular afinidad' }).click();
    await expect(page.getByRole('status')).toContainText('85% de afinidad estimada');
    const applicationResponsePromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === '/api/solicitudes'
      && response.request().method() === 'POST');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Enviar Postulación' }).click();
    application = await readSuccessfulResponse(
      await applicationResponsePromise,
      'Submit E2E adoption application'
    );

    await page.getByRole('button', { name: /Mis Postulaciones/ }).click();
    await expect(page.getByRole('cell', { name: petName })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'PENDIENTE' })).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: /Mis Postulaciones/ }).click();
    await expect(page.getByRole('cell', { name: petName })).toBeVisible();

    const historyResponse = await request.get(`${API_BASE_URL}/solicitudes/usuario/${user.id}`);
    expect(await historyResponse.json()).toEqual([
      expect.objectContaining({
        mascotaNombre: petName,
        estado: 'PENDIENTE',
        tipoVivienda: 'APARTAMENTO',
        horasLibres: 8,
        nivelActividad: 'ALTO'
      })
    ]);
  } finally {
    await cleanupTestData({
      applicationId: application?.id,
      petId: pet?.id,
      userId: user?.id
    });
  }
});
