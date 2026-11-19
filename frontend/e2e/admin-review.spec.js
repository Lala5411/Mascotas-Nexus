const { test, expect } = require('@playwright/test');
const {
  API_BASE_URL,
  cleanupTestData,
  createApplication,
  createPet,
  createUser,
  login,
  uniqueSuffix
} = require('./support/fixtures');

test('el administrador aprueba o rechaza y el adoptante recibe el mensaje correspondiente', async ({ page, request, browser }) => {
  const suffix = uniqueSuffix();
  let user;
  let pet;
  let application;
  let rejectedPet;
  let rejectedApplication;
  let adoptanteContext;

  try {
    user = await createUser(request);
    const petName = `Perro E2E ${suffix}`;
    pet = await createPet(request, petName, 'Perro');
    application = await createApplication(request, user, pet);
    rejectedPet = await createPet(request, `Perro Rechazado E2E ${suffix}`, 'Perro');
    rejectedApplication = await createApplication(request, user, rejectedPet);

    await login(page, 'admin@nexus.com', 'contrasena-incorrecta');
    await expect(page.getByRole('alert')).toHaveText('Credenciales incorrectas. Intenta de nuevo.');

    await login(page, 'admin@nexus.com', 'admin123');
    await expect(page.getByRole('heading', {
      name: 'Panel de Administración - Mascota Nexus'
    })).toBeVisible();

    const applicationRow = page.getByRole('row').filter({ hasText: petName });
    await expect(applicationRow).toContainText('PENDIENTE');
    await expect(applicationRow).toContainText('Casa');
    await expect(applicationRow).toContainText('6 h/día');
    await expect(applicationRow).toContainText('Activo');
    await applicationRow.getByRole('button', { name: 'Aprobar' }).click();
    await expect(applicationRow).toContainText('APROBADA');

    const rejectedRow = page.getByRole('row').filter({ hasText: rejectedPet.nombre });
    await rejectedRow.getByRole('button', { name: 'Rechazar' }).click();
    await expect(rejectedRow).toContainText('RECHAZADA');

    adoptanteContext = await browser.newContext();
    const adoptantePage = await adoptanteContext.newPage();
    await login(adoptantePage, user.email, user.password);
    await expect(adoptantePage.getByRole('heading', {
      name: 'Encuentra a tu nuevo compañero'
    })).toBeVisible();
    await adoptantePage.getByRole('button', { name: /Mis Postulaciones/ }).click();
    await expect(adoptantePage.getByRole('status').filter({
      hasText: 'Tu postulación fue aprobada'
    })).toBeVisible();
    await expect(adoptantePage.getByText(
      /En esta ocasión no fue posible continuar con esta postulación/
    )).toBeVisible();

    const petsResponse = await request.get(`${API_BASE_URL}/mascotas`);
    const pets = await petsResponse.json();
    expect(pets.find((candidate) => candidate.id === pet.id)).toMatchObject({
      estado: 'ADOPTADO'
    });

    const historyResponse = await request.get(`${API_BASE_URL}/solicitudes/usuario/${user.id}`);
    const history = await historyResponse.json();
    expect(history.find((candidate) => candidate.id === application.id)).toMatchObject({
      mascotaNombre: petName,
      estado: 'APROBADA'
    });
    expect(history.find((candidate) => candidate.id === rejectedApplication.id)).toMatchObject({
      mascotaNombre: rejectedPet.nombre,
      estado: 'RECHAZADA'
    });
  } finally {
    await adoptanteContext?.close();
    await cleanupTestData({
      applicationId: application?.id,
      petId: pet?.id,
      userId: user?.id
    });
    if (rejectedPet) {
      await cleanupTestData({
        applicationId: rejectedApplication?.id,
        petId: rejectedPet.id
      });
    }
  }
});
