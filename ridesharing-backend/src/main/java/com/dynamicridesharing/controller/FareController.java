package com.dynamicridesharing.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/fare")
public class FareController {

    @Value("${ors.api.key}")
    private String orsApiKey; // Add in application.properties

    private final RestTemplate restTemplate = new RestTemplate();

    // Endpoint: /api/fare?source=Bangalore&destination=Chennai&passengers=3
    @GetMapping
    public ResponseEntity<?> calculateFare(@RequestParam String source,
                                           @RequestParam String destination,
                                           @RequestParam int passengers) {
        try {
            // 1. Convert place name → coordinates using ORS geocoding API
            double[] startCoords = getCoordinatesFromName(source);
            double[] endCoords = getCoordinatesFromName(destination);

            if (startCoords == null || endCoords == null) {
                return ResponseEntity.badRequest().body("Invalid source or destination");
            }

            // 2. Call ORS directions API for distance
            String url = "https://api.openrouteservice.org/v2/directions/driving-car?start=" +
                    startCoords[1] + "," + startCoords[0] + "&end=" + endCoords[1] + "," + endCoords[0];

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", orsApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map body = response.getBody();

            if (body == null || !body.containsKey("features")) {
                return ResponseEntity.badRequest().body("Error fetching route");
            }

            // 3. Extract distance in meters
            Map feature = (Map) ((java.util.List) body.get("features")).get(0);
            Map properties = (Map) feature.get("properties");
            Map summary = (Map) properties.get("summary");
            double distanceMeters = (double) summary.get("distance");
            double distanceKm = distanceMeters / 1000.0;

            // 4. Calculate fare (example: ₹10 per km per passenger)
            double farePerKm = 5.0;
            int totalFare = (int) Math.ceil(distanceKm * farePerKm * passengers);

            // 5. Prepare response
            Map<String, Object> result = new HashMap<>();
            result.put("source", source);
            result.put("destination", destination);
            result.put("passengers", passengers);
            result.put("distance_km", distanceKm);
            result.put("total_fare", totalFare);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Helper function: get lat/lng from place name
    private double[] getCoordinatesFromName(String place) {
        try {
            String encodedPlace = URLEncoder.encode(place, StandardCharsets.UTF_8);
            String url = "https://api.openrouteservice.org/geocode/search?api_key=" + orsApiKey + "&text=" + encodedPlace;

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map body = response.getBody();

            if (body == null || !body.containsKey("features")) return null;

            java.util.List features = (java.util.List) body.get("features");
            if (features.isEmpty()) return null;

            Map feature = (Map) features.get(0);
            Map geometry = (Map) feature.get("geometry");
            java.util.List coords = (java.util.List) geometry.get("coordinates");

            double lon = ((Number) coords.get(0)).doubleValue();
            double lat = ((Number) coords.get(1)).doubleValue();
            return new double[]{lat, lon};

        } catch (Exception e) {
            return null;
        }
    }
}
