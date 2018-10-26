DROP TABLE Comm;
DROP TABLE Location;
DROP TABLE Host;
DROP TABLE Attendee;
DROP TABLE Alumni;
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

--On Scope, we assume that name major and graduation year can uniquely identify someone

CREATE TABLE Alumni(
	id VARCHAR(15) UNIQUE,
	name VARCHAR(20),
	major VARCHAR(30),
	graduation INTEGER,
	PRIMARY KEY(name,major,graduation)
);


CREATE TABLE Host(
	id REFERENCES Alumni(id),
	eventId REFERENCES Event(id),
	email VARCHAR(30),
	PRIMARY KEY(id,eventId)
);

CREATE TABLE Attendee(
	id REFERENCES Alumni(id),
	eventId REFERENCES Event(id),
	PRIMARY KEY(id,eventId)
);

CREATE TABLE Location(
	eventId REFERENCES Event(id),
	address VARCHAR(50),
	city VARCHAR(30),
	state VARCHAR(30),
	zipcode NUMBER(5),
	country VARCHAR(20),
	PRIMARY KEY(eventId)
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
