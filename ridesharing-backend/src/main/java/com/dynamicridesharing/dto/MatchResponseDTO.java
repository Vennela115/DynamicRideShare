package com.dynamicridesharing.dto;

import com.dynamicridesharing.dto.RideResponseDTO;
import java.util.List;

public class MatchResponseDTO {
    private List<RideResponseDTO> direct;
    private List<RideResponseDTO> partial;

    // Constructors
    public MatchResponseDTO() {}

    public MatchResponseDTO(List<RideResponseDTO> direct, List<RideResponseDTO> partial) {
        this.direct = direct;
        this.partial = partial;
    }

    // Getters and Setters
    public List<RideResponseDTO> getDirect() { return direct; }
    public void setDirect(List<RideResponseDTO> direct) { this.direct = direct; }
    public List<RideResponseDTO> getPartial() { return partial; }
    public void setPartial(List<RideResponseDTO> partial) { this.partial = partial; }
}
