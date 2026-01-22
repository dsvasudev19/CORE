package com.dev.core.repository;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.ActionEntity;

@Repository
public interface ActionRepository extends JpaRepository<ActionEntity, Long>, JpaSpecificationExecutor<ActionEntity> {

    Optional<ActionEntity> findByCode(String code);

    boolean existsByCode(String code);

    Page<ActionEntity> findAll(Pageable pageable);

    Page<ActionEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

