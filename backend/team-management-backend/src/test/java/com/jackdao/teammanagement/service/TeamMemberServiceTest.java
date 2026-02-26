package com.jackdao.teammanagement.service;

import com.jackdao.teammanagement.model.TeamMember;
import com.jackdao.teammanagement.repository.TeamMemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamMemberServiceTest {

    @Mock
    private TeamMemberRepository repository;

    @InjectMocks
    private TeamMemberService service;

    private TeamMember testMember;

    @BeforeEach
    void setUp() {
        testMember = new TeamMember();
        testMember.setId(1L);
        testMember.setFullName("Test User");
        testMember.setEmail("test@example.com");
    }

    // --- GET TESTS ---
    
    @Test
    void getAllTeamMembers_noFilters_returnsAll() {
        when(repository.findAll()).thenReturn(Arrays.asList(testMember));
        
        List<TeamMember> result = service.getAllTeamMembers(null, null, null);
        
        assertEquals(1, result.size());
        verify(repository).findAll(); // Verifies our service actually asked the repository for all members
    }

    @Test
    void getAllTeamMembers_withFilters_returnsFiltered() {
        when(repository.search("Test", null, null)).thenReturn(Arrays.asList(testMember));
        
        List<TeamMember> result = service.getAllTeamMembers("Test", null, null);
        
        assertEquals(1, result.size());
        verify(repository).search("Test", null, null);
    }

    // --- CREATE TESTS ---

    @Test
    void createTeamMember_success() {
        when(repository.existsByEmail(testMember.getEmail())).thenReturn(false);
        when(repository.save(any(TeamMember.class))).thenReturn(testMember);

        TeamMember result = service.createTeamMember(testMember);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void createTeamMember_emailExists_throwsException() {
        // Tell our fake database to pretend this email is already taken
        when(repository.existsByEmail(testMember.getEmail())).thenReturn(true);

        // Assert that the service throws our 409 Conflict error
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            service.createTeamMember(testMember);
        });

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(repository, never()).save(any()); // Verify it never tries to save
    }

    // --- UPDATE TESTS ---

    @Test
    void updateTeamMember_success() {
        TeamMember updatedDetails = new TeamMember();
        updatedDetails.setEmail("test@example.com");
        updatedDetails.setFullName("Test User Updated");

        when(repository.findById(1L)).thenReturn(Optional.of(testMember));
        when(repository.save(any(TeamMember.class))).thenReturn(updatedDetails);

        TeamMember result = service.updateTeamMember(1L, updatedDetails);

        assertEquals("Test User Updated", result.getFullName());
    }

    @Test
    void updateTeamMember_notFound_throwsException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            service.updateTeamMember(99L, testMember);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void updateTeamMember_emailExists_throwsException() {
        TeamMember updatedDetails = new TeamMember();
        updatedDetails.setEmail("taken@example.com");

        when(repository.findById(1L)).thenReturn(Optional.of(testMember));
        when(repository.existsByEmail("taken@example.com")).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            service.updateTeamMember(1L, updatedDetails);
        });

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(repository, never()).save(any());
    }

    // --- DELETE TESTS ---

    @Test
    void deleteTeamMember_success() {
        when(repository.existsById(1L)).thenReturn(true);

        service.deleteTeamMember(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void deleteTeamMember_notFound_throwsException() {
        when(repository.existsById(99L)).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            service.deleteTeamMember(99L);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(repository, never()).deleteById(any());
    }
}