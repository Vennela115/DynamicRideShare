package com.dynamicridesharing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class DistanceService {

    @Value("${google.api.key:}")
    private String googleApiKey;

    private final RestTemplate rest = new RestTemplate();

    // Returns distance in KM (fallback to 0 if any issue)
    public double distanceKm(String source, String destination) {
        try {
            String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/distancematrix/json")
                    .queryParam("origins", source)
                    .queryParam("destinations", destination)
                    .queryParam("key", googleApiKey)
                    .toUriString();

            Map<?,?> resp = rest.getForObject(url, Map.class);
            var rows = (java.util.List<?>) resp.get("rows");
            if (rows == null || rows.isEmpty()) return 0d;
            var elements = (java.util.List<?>) ((Map<?,?>) rows.get(0)).get("elements");
            if (elements == null || elements.isEmpty()) return 0d;
            var dist = (Map<?,?>) ((Map<?,?>) elements.get(0)).get("distance");
            if (dist == null) return 0d;
            Object metersObj = dist.get("value");
            double meters = metersObj instanceof Number ? ((Number) metersObj).doubleValue() : 0d;
            return meters / 1000.0;
        } catch (Exception e) {
            return 0d;
        }
    }
}
