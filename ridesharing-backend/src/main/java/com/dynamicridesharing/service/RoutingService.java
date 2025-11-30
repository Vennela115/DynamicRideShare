package com.dynamicridesharing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.dynamicridesharing.service.RouteInfo;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class RoutingService {

    @Value("${ors.api.key}")
    private String orsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Convert place name → coordinates
    public double[] geocode(String place) {
        try {
            String encodedPlace = URLEncoder.encode(place, StandardCharsets.UTF_8);
            String url = "https://api.openrouteservice.org/geocode/search?api_key=" +
                    orsApiKey + "&text=" + encodedPlace;

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map body = response.getBody();

            if (body == null || !body.containsKey("features")) return null;

            List features = (List) body.get("features");
            if (features.isEmpty()) return null;

            Map feature = (Map) features.get(0);
            Map geometry = (Map) feature.get("geometry");
            List coords = (List) geometry.get("coordinates");

            double lon = ((Number) coords.get(0)).doubleValue();
            double lat = ((Number) coords.get(1)).doubleValue();
            return new double[]{lat, lon};
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ Get driver’s route coordinates (polyline)
    /* public List<double[]> getRouteCoordinates(String source, String destination) {
        try {
            double[] start = geocode(source);
            double[] end = geocode(destination);
            if (start == null || end == null) return Collections.emptyList();

            String url = "https://api.openrouteservice.org/v2/directions/driving-car?start=" +
                    start[1] + "," + start[0] + "&end=" + end[1] + "," + end[0];

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", orsApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map body = response.getBody();
            if (body == null || !body.containsKey("features")) return Collections.emptyList();

            Map feature = (Map) ((List) body.get("features")).get(0);
            Map geometry = (Map) feature.get("geometry");
            List<List<Double>> coords = (List<List<Double>>) geometry.get("coordinates");

            List<double[]> result = new ArrayList<>();
            for (List<Double> coord : coords) {
                result.add(new double[]{coord.get(1), coord.get(0)}); // lat, lon
            }
            return result;

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }*/
    
    public RouteInfo getRouteInfo(String source, String destination) {
        try {
            double[] start = geocode(source);
            double[] end = geocode(destination);
            if (start == null || end == null) return null;

            String url = "https://api.openrouteservice.org/v2/directions/driving-car?start=" +
                    start[1] + "," + start[0] + "&end=" + end[1] + "," + end[0];

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", orsApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map body = response.getBody();
            if (body == null || !body.containsKey("features") || ((List) body.get("features")).isEmpty()) {
            	 System.err.println("ORS Warning: No route features found for " + source + " -> " + destination);
                return null;
            }

            Map feature = (Map) ((List) body.get("features")).get(0);
	
	    // --- THE CORE FIX IS HERE ---
        // 1. Get the 'properties' object first.
        Map properties = (Map) feature.get("properties");
        if (properties == null) return null; // Defensive check

        // 2. Get the 'summary' object from within 'properties'.
        Map summary = (Map) properties.get("summary");
        if (summary == null) return null; // Defensive check
        // --- END OF CORE FIX ---
	    
            // Extract Coordinates
            Map geometry = (Map) feature.get("geometry");
            List<List<Double>> coords = (List<List<Double>>) geometry.get("coordinates");
            List<double[]> routeCoordinates = new ArrayList<>();
            for (List<Double> coord : coords) {
                routeCoordinates.add(new double[]{coord.get(1), coord.get(0)}); // lat, lon
            }

            // EXTRACT DISTANCE (New Part)
            // The distance is in meters in the API response, so we convert to km
           
            double distanceMeters = ((Number) summary.get("distance")).doubleValue();
            double distanceKm = distanceMeters / 1000.0;

            return new RouteInfo(routeCoordinates, distanceKm);

        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error getting route info: " + e.getMessage());
            return null;
        }
    }

    // ✅ Check if a point is near a route (within threshold km)
    public boolean isPointNearRoute(double[] point, List<double[]> route, double thresholdKm) {
        for (double[] routePoint : route) {
            double dist = haversineKm(point[0], point[1], routePoint[0], routePoint[1]);
            if (dist <= thresholdKm) return true;
        }
        return false;
    }

    // Haversine formula (km)
    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}
