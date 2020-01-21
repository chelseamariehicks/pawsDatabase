-- NOTE we have more entities than required for project so
-- we have selected to apply the 4 insert queries to 
-- dogs, cats, staff, locations, and staff-locations(m:m)
-- NOTE we have used :varname throughout to represent when variables are provided by client-side


-- HOME PAGE QUERIES
-- select dogs and cats for homepage general query
-- get the query of all cats and dogs
WITH animals AS (
SELECT d.name, d.description, d.status, d.species, d.photo, d.dog_id AS id
FROM dogs d UNION SELECT c.name, c.description, c.status, c.species, c.photo, c.cat_id AS id
FROM cats c) 
SELECT name, description, photo, species, CASE species WHEN "Dog" THEN "dogs" WHEN "Cat" THEN "cats" END animaltype, a.status AS state, s.status, id 
FROM animals AS a INNER JOIN status s ON s.st_id = a.status
WHERE a.status = 1
ORDER BY name ASC;

-- select dogs and cats filtered by status for homepage
-- :varname used to denote what is provided by front-end
-- 
WITH animals AS (
SELECT d.name, d.description, d.status, d.species, d.photo, d.dog_id AS id
FROM dogs d UNION SELECT c.name, c.description, c.status, c.species, c.photo, c.cat_id AS id
FROM cats c) 
SELECT name, description, photo, species, CASE species WHEN "Dog" THEN "dogs" WHEN "Cat" THEN "cats" END animaltype, a.status AS state, s.status, id 
FROM animals AS a INNER JOIN status s ON s.st_id = a.status
WHERE a.status = :stid
ORDER BY name ASC
;

-- DOG PAGE QUERIES

-- select dogs query to get dog record with necessary data for rendering dog page
SELECT d.name, d.sex, d.dob, d.dog_id, d.breed, d.description, s.status, l.l_name, d.photo FROM dogs d
INNER JOIN status s ON s.st_id = d.status
INNER JOIN location l ON l.loc_id = d.location
ORDER BY name ASC
;

-- select individual dog query to get a dog record
SELECT d.name, d.sex, d.dob, d.dog_id, d.color, d.breed, d.description, s.status, s.st_id, l.loc_id, l.l_name, d.photo, date_format(d.dob, '%Y-%m-%d') AS dobformat 
FROM dogs d 
INNER JOIN status s ON s.st_id = d.status 
INNER JOIN location l ON l.loc_id = d.location 
WHERE d.dog_id= :id;

-- insert individual dog query to add a new dog
INSERT INTO dogs (`name`, `dob`, `sex`, `description`, `color`, `status`, `breed`, `species`, `location`, `photo`) VALUES (:name, :dob, :sex, :description, :color, :status, :breed, :species, :location, :photo);

-- update individual dog query to update a dog record
UPDATE dogs d SET d.name= :name, d.dob = :dob, d.sex = :sex, d.description = :description, d.color = :color, d.status = :status, d.breed = :breed, d.location = :location
WHERE d.dog_id = :id;

-- delete individual dog query
DELETE FROM dogs WHERE dog_id = :id;


-- CAT PAGE QUERIES
-- select cats query to get cat record with necessary data for rendering cat page
SELECT c.name, c.sex, date_format(c.dob, '%m/%d/%Y') AS dob, c.cat_id, c.breed, c.description, s.status, l.l_name, c.photo 
FROM cats c 
INNER JOIN status s ON s.st_id = c.status 
INNER JOIN location l ON l.loc_id = c.location 
ORDER BY name ASC;

-- select individual cat query to get a cat record
SELECT c.name, c.sex, date_format(c.dob, '%m/%d/%Y') AS dob, c.cat_id, c.breed, c.description, s.status, l.l_name, c.photo, c.color 
FROM cats c 
INNER JOIN status s ON s.st_id = c.status 
INNER JOIN location l ON l.loc_id = c.location 
WHERE c.cat_id= :id;

-- insert individual cat query to add a new cat
INSERT INTO cats (`name`, `dob`, `sex`, `description`, `color`, `status`, `breed`, `species`, `location`, `photo`) 
VALUES (:name, :dob, :sex, :description, :color, :status, :breed, :species, :location, :photo);

-- update individual cat query to update a cat record
UPDATE cats c SET c.name= :name, c.dob = :dob, c.sex = :sex, c.description = :description, c.color = :color, c.status = :status, c.breed = :breed, c.location = :location
WHERE c.cat_id = :id;

-- delete cat query to delete a cat
DELETE FROM cats WHERE cat_id = :id;


-- POPULATE LOCATION AND STATUS DATA FOR DOG/CAT INSERTION
-- get locations for rendering location selects on forms
SELECT loc_id, l_name FROM location;

-- get statuses for rendering status selects on forms
SELECT st_id, status FROM status;

-- STAFF QUERIES
-- select all staff for viewing on page
SELECT s.staff_id, s.f_name, s.l_name 
FROM staff s 
ORDER BY s.l_name ASC;

-- insert query for adding a new staff
INSERT INTO staff (`f_name`, `l_name`) VALUES (:fname, :lname);

-- LOCATION QUERIES
-- select all locations for viewing on page
SELECT l.loc_id, l.l_name FROM location l ORDER BY l.loc_id ASC;

-- insert a location into database
INSERT INTO location (`l_name`) VALUES (:l_name);

-- STAFF-LOCATIONS QUERIES M:M
-- staff-locations data select query for viewing all staff-location assignments grouped by location
-- First CTE formats data for future group_concat
WITH raw_data AS (
SELECT
	sl.sl_id
	, sl.lid
    , sl.stid
    , l.l_name AS location
    , s.f_name
    , s.l_name
    , CONCAT(s.f_name, ' ', s.l_name) AS full_name
FROM staff_location sl
INNER JOIN location l ON l.loc_id = sl.lid
INNER JOIN staff s ON s.staff_id = sl.stid
ORDER BY l.l_name
)

-- Perform group_concat to complete result set
SELECT
	lid
    , location
    , GROUP_CONCAT(DISTINCT full_name SEPARATOR ', ') AS test
FROM raw_data
GROUP BY lid
;

-- select the m:m staff-location records for one location
SELECT sl.sl_id, sl.lid, sl.stid, l.l_name AS location, s.f_name, s.l_name
FROM staff_location sl
INNER JOIN location l on l.loc_id = sl.lid
INNER JOIN staff s ON s.staff_id = sl.stid
WHERE sl.lid = :lid;


-- insert a new m:m staff-location record
INSERT INTO staff_location (lid, stid) VALUES (:lid, :stid);

-- delete a m:m staff-location record
DELETE FROM staff_location WHERE sl_id = :id;

-- select staff NOT in a location for populating dropdown to allow
-- adding a staff to a location (INSERT)
SELECT s.staff_id, s.f_name, s.l_name FROM staff s
WHERE s.staff_id NOT IN (SELECT s.staff_id FROM staff s
INNER JOIN staff_location sl ON sl.stid = s.staff_id 
WHERE sl.lid = :lid);






