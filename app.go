package main

import (
	"context"
	"database/sql"
	_ "embed"
	"encoding/base64"
	"os"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	_ "github.com/mattn/go-sqlite3"

	"log/slog"
	"myproject/data"
	"myproject/internal/database"
	"myproject/internal/utils/enums"
)

// App struct
type App struct {
	ctx     context.Context
	queries *data.Queries
}

//go:embed schema.sql
var ddl string

const dataFolder = "./attachments" // Path for the data folder

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func createDataFolder() error {
	if err := os.MkdirAll(dataFolder, os.ModePerm); err != nil {
		return err
	}
	return nil
}

func stringToStringArray(s string) []string {
	return strings.Split(s, ",")
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	if err := createDataFolder(); err != nil {
		panic(err)
	}

	db, err := sql.Open("sqlite3", "sqlite.db")
	if err != nil {
		panic(err)
	}

	if _, err := db.ExecContext(ctx, ddl); err != nil {
		slog.Error(err.Error())
		slog.Info("ddl", ddl)
		panic(err)
	}

	queries := data.New(db)
	a.queries = queries
}

func (a *App) InsertPerson(name string, sex string, dob time.Time, fatherName string, contact string, occupationType string, annualIncome float64, budget float64, biodataFiles string, picturesFiles string, pob string, notes string) error {
	newPerson := data.Person{
		Name:           name,
		Sex:            sex,
		DateOfBirth:    dob,
		PlaceOfBirth:   pob,
		FatherName:     fatherName,
		Contact:        contact,
		OccupationType: occupationType,
		AnnualIncome:   annualIncome,
		Budget:         budget,
		Notes:          notes,
	}
	person, err := database.InsertPerson(a.queries, a.ctx, newPerson)
	if err != nil {
		return err
	}

	if biodataFiles != "" {
		biodataFilesToArr := strings.Split(biodataFiles, ",")
		for _, str := range biodataFilesToArr {
			_, err := database.InsertAttachment(a.queries, a.ctx, str, person.Uuid, person.ID, "biodata")
			if err != nil {
				return err
			}
		}
	}

	if picturesFiles != "" {
		picturesFilesToArr := strings.Split(picturesFiles, ",")
		for _, str := range picturesFilesToArr {
			_, err := database.InsertAttachment(a.queries, a.ctx, str, person.Uuid, person.ID, "pictures")
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func (a *App) UpdatePerson(id int64, name string, sex string, dob time.Time, fatherName string, contact string, occupationType string, annualIncome float64, budget float64, pob string, notes string) error {
	newPerson := data.Person{
		ID:             id,
		Name:           name,
		Sex:            sex,
		DateOfBirth:    dob,
		PlaceOfBirth:   pob,
		FatherName:     fatherName,
		Contact:        contact,
		OccupationType: occupationType,
		AnnualIncome:   annualIncome,
		Budget:         budget,
		Notes:          notes,
	}
	err := database.UpdatePerson(a.queries, a.ctx, newPerson)
	if err != nil {
		slog.Error(err.Error())
	}
	return nil
}

func (a *App) ListPersonsByName() []data.Person {
	persons, err := database.ListPersonsByName(a.queries, a.ctx)
	if err != nil {
		return nil
	}
	return persons
}

func (a *App) GetPersonByID(id int64) data.Person {
	person, err := database.GetPersonByID(a.queries, a.ctx, id)
	if err != nil {
		return data.Person{}
	}
	return person
}

func (a *App) GetAllOccupationTypes() []string {
	return enums.GetAllOccupationTypes()
}

func (a *App) OpenMultipleFileSelectDialog() ([]string, error) {
	return runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{})
}

func (a *App) UpdateNoteForPerson(note string, id int64) error {
	return database.UpdatePersonNote(a.queries, a.ctx, note, id)

}

func (a *App) GetAttachmentsByUUID(personUUID string) ([]data.Attachment, error) {
	person, err := database.GetPersonByUUID(a.queries, a.ctx, personUUID)
	if err != nil {
		return nil, err
	}

	attachments, err := database.GetAllAttachments(a.queries, a.ctx, person.ID)
	if err != nil {
		return nil, err
	}

	return attachments, nil
}

func (a *App) GetAttachmentBase64(filePath string) (string, error) {
	pdfBytes, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(pdfBytes), nil
}

func (a *App) InsertAttachments(id int64, uuid string, biodataFiles string, picturesFiles string) error {
	if biodataFiles != "" {
		biodataFilesToArr := strings.Split(biodataFiles, ",")
		for _, str := range biodataFilesToArr {
			_, err := database.InsertAttachment(a.queries, a.ctx, str, uuid, id, "biodata")
			if err != nil {
				return err
			}
		}
	}

	if picturesFiles != "" {
		picturesFilesToArr := strings.Split(picturesFiles, ",")
		for _, str := range picturesFilesToArr {
			_, err := database.InsertAttachment(a.queries, a.ctx, str, uuid, id, "pictures")
			if err != nil {
				return err
			}
		}
	}

	return nil
}
