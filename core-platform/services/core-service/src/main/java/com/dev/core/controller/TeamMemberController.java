package com.dev.core.controller;

import com.dev.core.model.TeamMemberDTO;
import com.dev.core.service.TeamMemberService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-members")
@RequiredArgsConstructor
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    @PostMapping
    public ResponseEntity<TeamMemberDTO> add(@RequestBody TeamMemberDTO dto) {
        return ResponseEntity.ok(teamMemberService.addMember(dto));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<TeamMemberDTO> updateRole(
            @PathVariable Long id,
            @RequestParam boolean isLead,
            @RequestParam boolean isManager) {
        return ResponseEntity.ok(teamMemberService.updateRole(id, isLead, isManager));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamMemberService.removeMember(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamMemberDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teamMemberService.getById(id));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamMemberDTO>> getByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamMemberService.getMembersByTeam(teamId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TeamMemberDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(teamMemberService.getTeamsByEmployee(employeeId));
    }
}
