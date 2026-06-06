package com.travelbuddy.backend.repository;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.model.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelPlanRepository
        extends JpaRepository<TravelPlan, Long> {

    List<TravelPlan> findByDestination(
            String destination
    );
    List<TravelPlan>
findByUser(User user);
}