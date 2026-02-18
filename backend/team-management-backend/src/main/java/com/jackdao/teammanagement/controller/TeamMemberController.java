package com.jackdao.teammanagement.controller;

import com.jackdao.teammanagement.model.TeamMember;
import com.jackdao.teammanagement.repository.TeamMemberRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamMemberController {

    private final TeamMemberRepository repository;

    public TeamMemberController(TeamMemberRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TeamMember> getAllTeamMembers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) TeamMember.JobFunction function,
            @RequestParam(required = false) TeamMember.Role role
    ) {
        if (q != null || function != null || role != null) {
            return repository.search(q, function, role);
        }
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<TeamMember> createTeamMember(@Valid @RequestBody TeamMember teamMember) {
        if (repository.existsByEmail(teamMember.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        TeamMember savedMember = repository.save(teamMember);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(@PathVariable Long id, @Valid @RequestBody TeamMember memberDetails) {
        TeamMember existingMember = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member not found"));

        if (!existingMember.getEmail().equals(memberDetails.getEmail()) &&
            repository.existsByEmail(memberDetails.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        existingMember.setFullName(memberDetails.getFullName());
        existingMember.setEmail(memberDetails.getEmail());
        existingMember.setFunction(memberDetails.getFunction());
        existingMember.setRole(memberDetails.getRole());

        TeamMember updatedMember = repository.save(existingMember);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}