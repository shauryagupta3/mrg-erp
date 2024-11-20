package database

import (
	"context"
	"fmt"
	"io"
	"myproject/data"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

func countExistingAttachments(uuid string) int {
	if _, err := os.Stat("./attachments/" + uuid); os.IsNotExist(err) {
		return 0
	}

	files, err := os.ReadDir("./attachments/" + uuid)
	if err != nil {
		return 0
	}

	count := 0
	for _, file := range files {
		if !file.IsDir() && strings.HasPrefix(file.Name(), uuid+"-") {
			count++
		}
	}

	return count
}

func saveFile(personUUID string, filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	personDir := "./attachments/" + personUUID
	if err := os.MkdirAll(personDir, 0755); err != nil {
		return "", err
	}

	existingCount := countExistingAttachments(personUUID) // Count logic discussed earlier
	newFileName := fmt.Sprintf("%s-%d", personUUID, existingCount+1)

	dstPath := filepath.Join(personDir, newFileName+filepath.Ext(filePath))
	dstFile, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dstFile.Close()

	if _, err := io.Copy(dstFile, file); err != nil {
		return "", err
	}

	return dstPath, nil
}

func InsertAttachment(queries *data.Queries, ctx context.Context, pathToFile string, personUUID string, personId int64, TypeOfFile string) (data.Attachment, error) {

	newFilePath, err := saveFile(personUUID, pathToFile)
	if err != nil {
		return data.Attachment{}, err

	}

	fileInfo, err := os.Stat(newFilePath)
	if err != nil {
		return data.Attachment{}, err
	}

	newAttachment, err := queries.CreateAttachment(ctx, data.CreateAttachmentParams{
		Uuid:         uuid.New().String(),
		Type:         TypeOfFile,
		FileName:     newFilePath,
		FileType:     filepath.Ext(newFilePath),
		FileSize:     fileInfo.Size(),
		Persondataid: personId,
	})

	if err != nil {
		return data.Attachment{}, err
	}
	return newAttachment, nil
}

func GetAllAttachments(queries *data.Queries, ctx context.Context, id int64) ([]data.Attachment, error) {
	attachments, err := queries.GetAttachmentsByPersonID(ctx, id)
	if err != nil {
		return nil, err
	}

	return attachments, nil
}
