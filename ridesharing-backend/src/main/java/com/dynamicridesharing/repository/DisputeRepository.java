package com.dynamicridesharing.repository;

import com.dynamicridesharing.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dynamicridesharing.model.DisputeStatus;
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    // We can add more specific query methods here later if needed
    long countByStatus(DisputeStatus status);
}
