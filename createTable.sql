DROP TABLE Comm;
DROP TABLE Attendee;
DROP TABLE Location;
DROP TABLE Host;
DROP TABLE Event;

CREATE TABLE Event(
	id VARCHAR(15) PRIMARY KEY,
	name VARCHAR(20),
	startTime INTEGER,
	endTime INTEGER,
	description VARCHAR(500),
	category VARCHAR(15),
	numInt INTEGER,
	status INTEGER CHECK (status IN (0,1,2)),
--0 is pending, 1 is accepted, 2 is denied
	created INTEGER
);

CREATE TABLE Host(
	id VARCHAR(15) PRIMARY KEY,
	eventId REFERENCES Event(id),
	name VARCHAR(20),
	email VARCHAR(30),
	major VARCHAR(30),
	graduation INTEGER
);

CREATE TABLE Location(
	id VARCHAR(15) PRIMARY KEY,
	eventId REFERENCES Event(id),
	address VARCHAR(50),
	city VARCHAR(30),
	state VARCHAR(30),
	zipcode NUMBER(5),
	country VARCHAR(20)
);

CREATE TABLE Attendee(
	id VARCHAR(15) PRIMARY KEY,
	eventId REFERENCES Event(id),
	name VARCHAR(20),
	major VARCHAR(30),
	graduation INTEGER
);

--Comm == Comment/Feedback
CREATE TABLE Comm(
	id VARCHAR(15) PRIMARY KEY,
	eventId REFERENCES Event(id),
	name VARCHAR(20),
	rating NUMBER(1) CHECK (rating in (0,1,2,3,4,5)),
	detail VARCHAR(500),
	created INTEGER
);