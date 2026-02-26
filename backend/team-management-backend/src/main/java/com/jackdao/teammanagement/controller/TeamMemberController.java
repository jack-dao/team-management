package com.jackdao.teammanagement.controller;

import com.jackdao.teammanagement.model.TeamMember;
import com.jackdao.teammanagement.service.TeamMemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamMemberController {

    private final TeamMemberService service;

    public TeamMemberController(TeamMemberService service) {
        this.service = service;
    }

    @GetMapping
    public List<TeamMember> getAllTeamMembers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) TeamMember.JobFunction function,
            @RequestParam(required = false) TeamMember.Role role
    ) {
        return service.getAllTeamMembers(q, function, role);
    }

    @PostMapping
    public ResponseEntity<TeamMember> createTeamMember(@Valid @RequestBody TeamMember teamMember) {
        TeamMember savedMember = service.createTeamMember(teamMember);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(@PathVariable Long id, @Valid @RequestBody TeamMember memberDetails) {
        TeamMember updatedMember = service.updateTeamMember(id, memberDetails);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long id) {
        service.deleteTeamMember(id);
        return ResponseEntity.noContent().build();
    }
}