package com.mascotanexus.backend.repository;

import com.mascotanexus.backend.model.Mascota;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ContextConfiguration(classes = MascotaRepositoryTest.JpaTestConfiguration.class)
class MascotaRepositoryTest {

    @Autowired
    private MascotaRepository mascotaRepository;

    @Test
    void filtrarDisponiblesAplicaEspecieEdadMaximaYEstado() {
        mascotaRepository.saveAll(List.of(
                new Mascota(null, "MascotaFiltroA", "EspecieFiltroUnicaXYZ", 2, "DISPONIBLE", null),
                new Mascota(null, "MascotaFiltroB", "ESPECIEFILTROUNICAXYZ", 5, "DISPONIBLE", null),
                new Mascota(null, "MascotaFiltroC", "OtraEspecieUnicaXYZ", 2, "DISPONIBLE", null),
                new Mascota(null, "MascotaFiltroD", "EspecieFiltroUnicaXYZ", 1, "ADOPTADO", null)));

        List<Mascota> resultado = mascotaRepository.filtrarDisponibles("especiefiltrounicaxyz", 2);

        assertEquals(1, resultado.size());
        assertEquals("MascotaFiltroA", resultado.get(0).getNombre());
    }

    @Test
    void filtrarDisponiblesPermiteOmitirCadaFiltro() {
        mascotaRepository.saveAll(List.of(
                new Mascota(null, "MascotaOpcionalA", "EspecieOpcionalXYZ", 2, "DISPONIBLE", null),
                new Mascota(null, "MascotaOpcionalB", "OtraEspecieOpcionalXYZ", 0, "DISPONIBLE", null),
                new Mascota(null, "MascotaOpcionalC", "EspecieOpcionalXYZ", 1, "ADOPTADO", null)));

        List<Mascota> sinFiltros = mascotaRepository.filtrarDisponibles(null, null);
        List<Mascota> soloEspecie = mascotaRepository.filtrarDisponibles("EspecieOpcionalXYZ", null);
        List<Mascota> soloEdad = mascotaRepository.filtrarDisponibles(null, 0);

        assertTrue(sinFiltros.stream().anyMatch(mascota -> mascota.getNombre().equals("MascotaOpcionalA")));
        assertEquals(1, soloEspecie.size());
        assertEquals("MascotaOpcionalA", soloEspecie.get(0).getNombre());
        assertTrue(soloEdad.stream().anyMatch(mascota -> mascota.getNombre().equals("MascotaOpcionalB")));
        assertTrue(soloEdad.stream().allMatch(mascota -> mascota.getEdad() <= 0));
    }

    @Configuration(proxyBeanMethods = false)
    @EntityScan(basePackageClasses = Mascota.class)
    @EnableJpaRepositories(basePackageClasses = MascotaRepository.class)
    static class JpaTestConfiguration {
    }
}
