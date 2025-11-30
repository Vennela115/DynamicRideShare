package com.dynamicridesharing.controller;

import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.repository.RideRepository;
import com.dynamicridesharing.service.RouteMatchingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/match")
public class RouteMatchingController {

    private final RideRepository rideRepo;
    private final RouteMatchingService matcher;

    public RouteMatchingController(RideRepository rideRepo, RouteMatchingService matcher) {
        this.rideRepo = rideRepo;
        this.matcher = matcher;
    }

    @GetMapping
    public List<Ride> findMatches(@RequestParam String source,
                                  @RequestParam String destination) {
        var all = rideRepo.findAll();
        return all.stream()
                .filter(r -> matcher.isDirect(r, source, destination) || matcher.isNear(r, source, destination))
                .toList();
    }
}
