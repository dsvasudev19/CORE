package com.dev.core.controller;

import com.dev.core.model.TeamDTO;
import com.dev.core.service.TeamService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamDTO> create(@RequestBody TeamDTO dto) {
        return ResponseEntity.ok(teamService.createTeam(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> update(@PathVariable Long id, @RequestBody TeamDTO dto) {
        return ResponseEntity.ok(teamService.updateTeam(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAll(@RequestParam Long organizationId) {
        return ResponseEntity.ok(teamService.getAllTeams(organizationId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TeamDTO>> search(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(teamService.searchTeams(organizationId, keyword, pageable));
    }

    // 🔹 Member management
    @PostMapping("/{teamId}/members")
    public ResponseEntity<Void> addMember(
            @PathVariable Long teamId,
            @RequestParam Long employeeId,
            @RequestParam(defaultValue = "false") boolean isLead,
            @RequestParam(defaultValue = "false") boolean isManager) {
        teamService.addMember(teamId, employeeId, isLead, isManager);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{teamId}/members/{employeeId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long teamId, @PathVariable Long employeeId) {
        teamService.removeMember(teamId, employeeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{teamId}/lead/{employeeId}")
    public ResponseEntity<Void> setLead(@PathVariable Long teamId, @PathVariable Long employeeId) {
        teamService.setTeamLead(teamId, employeeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{teamId}/manager/{managerId}")
    public ResponseEntity<Void> changeManager(@PathVariable Long teamId, @PathVariable Long managerId) {
        teamService.changeManager(teamId, managerId);
        return ResponseEntity.ok().build();
    }
}
