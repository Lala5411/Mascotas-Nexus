package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.dto.MatchRequest;
import com.mascotanexus.backend.dto.MatchResponse;
import com.mascotanexus.backend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping
    public ResponseEntity<List<MatchResponse>> obtenerMatch(@RequestBody MatchRequest request) {
        return ResponseEntity.ok(matchService.calcularCompatibilidad(request));
    }
}