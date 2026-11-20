package com.mascotanexus.backend.service;

import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MascotaServiceRegistroTest {

    private MascotaRepository mascotaRepository;
    private MascotaService mascotaService;

    @BeforeEach
    void setUp() {
        mascotaRepository = mock(MascotaRepository.class);
        mascotaService = new MascotaService(mascotaRepository, mock(SolicitudRepository.class));
        when(mascotaRepository.save(any(Mascota.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    @Test
    void rechazaNombreVacio() {
        assertRechazado(mascota("   ", "Gato", 2, null));
    }

    @Test
    void rechazaNombreDeMasDeSesentaCaracteres() {
        assertRechazado(mascota("a".repeat(61), "Gato", 2, null));
    }

    @Test
    void rechazaEspecieVacia() {
        assertRechazado(mascota("Luna", "", 2, null));
    }

    @Test
    void rechazaEdadAusente() {
        assertRechazado(mascota("Luna", "Gato", null, null));
    }

    @Test
    void rechazaEdadNegativa() {
        assertRechazado(mascota("Luna", "Gato", -1, null));
    }

    @Test
    void rechazaEdadMayorQueTreinta() {
        assertRechazado(mascota("Luna", "Gato", 31, null));
    }

    @Test
    void rechazaEstadoNoPermitido() {
        assertRechazado(mascota("Luna", "Gato", 2, "PERDIDO"));
    }

    @Test
    void guardaMascotaValidaRecortadaYDisponiblePorDefecto() {
        Mascota guardada = mascotaService.guardar(mascota("  Luna  ", " Gato ", 2, null));

        assertEquals("Luna", guardada.getNombre());
        assertEquals("Gato", guardada.getEspecie());
        assertEquals("DISPONIBLE", guardada.getEstado());
        verify(mascotaRepository).save(guardada);
    }

    @Test
    void aceptaLasEdadesLimite() {
        assertEquals(0, mascotaService.guardar(mascota("Cachorro", "Perro", 0, null)).getEdad());
        assertEquals(30, mascotaService.guardar(mascota("Abuelo", "Gato", 30, null)).getEdad());
    }

    @Test
    void guardaElEstadoEnMayusculas() {
        assertEquals("ADOPTADO", mascotaService.guardar(mascota("Luna", "Gato", 2, "adoptado")).getEstado());
    }

    private void assertRechazado(Mascota mascota) {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> mascotaService.guardar(mascota));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(mascotaRepository, never()).save(any());
    }

    private Mascota mascota(String nombre, String especie, Integer edad, String estado) {
        return new Mascota(null, nombre, especie, edad, estado, "/foto.jpg");
    }
}
