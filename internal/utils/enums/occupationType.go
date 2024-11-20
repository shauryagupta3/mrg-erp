package enums

import (
	"fmt"
)

// OccupationType represents the allowed occupation values
type OccupationType string

// Enum values for OccupationType
const (
	OccupationBusiness     OccupationType = "business"
	OccupationJob          OccupationType = "job"
	OccupationSelfEmployed OccupationType = "self-employed"
)

// ValidOccupationTypes contains all allowed occupation types
var ValidOccupationTypes = map[OccupationType]bool{
	OccupationBusiness:     true,
	OccupationJob:          true,
	OccupationSelfEmployed: true,
}

// Validate checks if the provided occupation type is valid
func (o OccupationType) Validate() error {
	if _, isValid := ValidOccupationTypes[o]; !isValid {
		return fmt.Errorf("invalid occupation type: %s", o)
	}
	return nil
}

// ParseOccupationType converts a string to an OccupationType and checks if it's valid
func ParseOccupationType(value string) (OccupationType, error) {
	occupation := OccupationType(value)
	if err := occupation.Validate(); err != nil {
		return "", err
	}
	return occupation, nil
}

// GetAllOccupationTypes returns a list of all valid occupation types as strings
func GetAllOccupationTypes() []string {
	var occupations []string
	for occupation := range ValidOccupationTypes {
		occupations = append(occupations, string(occupation))
	}
	return occupations
}