package database

import (
	"context"
	"myproject/data"

	"github.com/google/uuid"
)

func GetPersonByID(queries *data.Queries, ctx context.Context, id int64) (data.Person, error) {
	person, err := queries.GetPerson(ctx, id)
	if err != nil {
		return data.Person{}, err
	}
	return person, nil
}

func GetPersonByUUID(queries *data.Queries, ctx context.Context, uuid string) (data.Person, error) {
	person, err := queries.GetPersonByUUID(ctx, uuid)
	if err != nil {
		return data.Person{}, err
	}
	return person, nil
}

func ListPersonsByName(queries *data.Queries, ctx context.Context) ([]data.Person, error) {
	persons, err := queries.ListPersons(ctx)
	if err != nil {
		return nil, err
	}
	return persons, nil
}

func InsertPerson(queries *data.Queries, ctx context.Context, person data.Person) (data.Person, error) {
	newPerson, err := queries.CreatePerson(ctx, data.CreatePersonParams{
		Name:           person.Name,
		Sex:            person.Sex,
		Uuid:           uuid.New().String(),
		DateOfBirth:    person.DateOfBirth,
		Contact:        person.Contact,
		FatherName:     person.FatherName,
		OccupationType: person.OccupationType,
		Budget:         person.Budget,
		AnnualIncome:   person.AnnualIncome,
		PlaceOfBirth:   person.PlaceOfBirth,
		Notes:          person.Notes,
	})

	if err != nil {
		return data.Person{}, err
	}
	return newPerson, nil
}

func UpdatePerson(queries *data.Queries, ctx context.Context, person data.Person) error {
	err := queries.UpdatePerson(ctx, data.UpdatePersonParams{
		ID:             person.ID,
		Name:           person.Name,
		Sex:            person.Sex,
		DateOfBirth:    person.DateOfBirth,
		Contact:        person.Contact,
		FatherName:     person.FatherName,
		OccupationType: person.OccupationType,
		Budget:         person.Budget,
		AnnualIncome:   person.AnnualIncome, PlaceOfBirth: person.PlaceOfBirth,
		Notes: person.Notes})

	if err != nil {
		return err
	}
	return nil
}

func UpdatePersonNote(queries *data.Queries, ctx context.Context, notes string, id int64) error {
	err := queries.UpdatePersonNote(ctx, data.UpdatePersonNoteParams{Notes: notes, ID: id})
	if err != nil {
		return err
	}
	return nil
}
