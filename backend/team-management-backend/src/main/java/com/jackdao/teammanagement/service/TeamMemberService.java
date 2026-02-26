package com.jackdao.teammanagement.service;

import com.jackdao.teammanagement.model.TeamMember;
import com.jackdao.teammanagement.repository.TeamMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository repository;

    public TeamMemberService(TeamMemberRepository repository) {
        this.repository = repository;
    }

    public List<TeamMember> getAllTeamMembers(String q, TeamMember.JobFunction function, TeamMember.Role role) {
        if (q != null || function != null || role != null) {
            return repository.search(q, function, role);
        }
        return repository.findAll();
    }

    public TeamMember createTeamMember(TeamMember teamMember) {
        if (repository.existsByEmail(teamMember.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        return repository.save(teamMember);
    }

    public TeamMember updateTeamMember(Long id, TeamMember memberDetails) {
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

        return repository.save(existingMember);
    }

    public void deleteTeamMember(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member not found");
        }
        repository.deleteById(id);
    }
}