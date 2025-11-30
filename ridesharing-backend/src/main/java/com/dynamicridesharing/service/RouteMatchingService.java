package com.dynamicridesharing.service;

import com.dynamicridesharing.model.Ride;
import org.springframework.stereotype.Service;
import com.dynamicridesharing.service.RouteInfo;

import java.util.List;

@Service
public class RouteMatchingService {

    private final RoutingService routingService;  // ✅ use RoutingService instead of DistanceService

    public RouteMatchingService(RoutingService routingService) { // ✅ inject it via constructor
        this.routingService = routingService;
    }

    // Direct: exact source & destination (case-insensitive)
    public boolean isDirect(Ride r, String src, String dst) {
        return r.getSource() != null && r.getDestination() != null
                && r.getSource().equalsIgnoreCase(src)
                && r.getDestination().equalsIgnoreCase(dst);
    }

    // Partial match using ORS
    public boolean isNear(Ride r, String src, String dst) {
        if (r.getSource() == null || r.getDestination() == null) return false;

        /*List<double[]> driverRoute = routingService.getRouteCoordinates(r.getSource(), r.getDestination());
        */
        
        RouteInfo driverRouteInfo = routingService.getRouteInfo(r.getSource(), r.getDestination());
        
        if (driverRouteInfo == null || driverRouteInfo.getCoordinates().isEmpty()) return false;

        double[] passengerSrc = routingService.geocode(src);
        double[] passengerDst = routingService.geocode(dst);

        if (passengerSrc == null || passengerDst == null) return false;

        /* boolean nearStart = routingService.isPointNearRoute(passengerSrc, driverRoute, 5.0);
        boolean nearEnd = routingService.isPointNearRoute(passengerDst, driverRoute, 5.0);
        */
        // Pass the coordinates to the check
        boolean nearStart = routingService.isPointNearRoute(passengerSrc, driverRouteInfo.getCoordinates(), 5.0);
        boolean nearEnd = routingService.isPointNearRoute(passengerDst, driverRouteInfo.getCoordinates(), 5.0);

        return nearStart && nearEnd;
    }
}
