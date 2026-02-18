package com.jackdao.teammanagement.repository;

import com.jackdao.teammanagement.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    boolean existsByEmail(String email);

    @Query("SELECT t FROM TeamMember t WHERE " +
           "(:q IS NULL OR (LOWER(t.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(t.email) LIKE LOWER(CONCAT('%', :q, '%')))) " +
           "AND (:function IS NULL OR t.function = :function) " +
           "AND (:role IS NULL OR t.role = :role)")
    List<TeamMember> search(
            @Param("q") String q,
            @Param("function") TeamMember.JobFunction function,
            @Param("role") TeamMember.Role role
    );
}