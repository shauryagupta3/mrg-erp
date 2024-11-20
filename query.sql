-- name: GetPerson :one
SELECT
  *
FROM
  Person
WHERE
  id = ?
LIMIT
  1;

-- name: GetPersonByUUID :one
SELECT
  *
FROM
  Person
WHERE
  uuid = ?
LIMIT
  1;

-- name: ListPersons :many
SELECT
  *
FROM
  Person;

-- name: CreatePerson :one
INSERT INTO
  Person (
    uuid,
    name,
    sex,
    date_of_birth,
    contact,
    father_name,
    occupation_type,
    budget,
    annual_income,
    place_of_birth,
    notes
  )
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;

-- name: UpdatePerson :exec
UPDATE Person
SET
  name = ?,
  sex = ?,
  date_of_birth = ?,
  contact = ?,
  father_name = ?,
  occupation_type = ?,
  budget = ?,
  annual_income = ?,
  place_of_birth = ?,
  notes = ?,
  modifiedAt = CURRENT_TIMESTAMP
WHERE
  id = ?;

-- name: UpdatePersonNote :exec
UPDATE Person
SET
  notes = ?,
  modifiedAt = CURRENT_TIMESTAMP
WHERE
  id = ?;

-- name: DeletePerson :exec
DELETE FROM Person
WHERE
  id = ?;

-- name: CreateAttachment :one
INSERT INTO
  Attachment (
    uuid,
    type,
    file_name,
    file_type,
    file_size,
    personDataID
  )
VALUES
  (?, ?, ?, ?, ?, ?) RETURNING *;

-- name: GetAttachmentsByPersonID :many
SELECT
  *
FROM
  Attachment
WHERE
  personDataID = ?;