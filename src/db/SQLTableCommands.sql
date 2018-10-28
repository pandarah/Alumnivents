DROP TABLE Comm;
DROP TABLE Location;
DROP TABLE Host;
DROP TABLE Attendee;
DROP TABLE Alumni;
DROP TABLE Event;

CREATE TABLE Event(
	id INTEGER PRIMARY KEY,
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
	id INTEGER PRIMARY KEY,
	name VARCHAR(20),
	major VARCHAR(30),
	graduation INTEGER
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
	id INTEGER PRIMARY KEY,
	eventId REFERENCES Event(id),
	nameId REFERENCES Alumni(id),
	rating NUMBER(1) CHECK (rating in (0,1,2,3,4,5)),
	detail VARCHAR(500),
	created INTEGER
);

--INSERT INTO Event VALUES (0,'SCU Alumnivents Anniversary',1530600900,1530603900,'Celebrating the one year anniversary of the platform that got all of us together','Food & Drinks',0,0,1520603900);
--INSERT INTO Event VALUES (1,'ASU SCU Gathering Afterparty',1530604900,1530656900,'The afterparty to the main event of course','Food & Drinks',0,0,1520603900);

--INSERT INTO Alumni VALUES (0,'Bob Billy', 'Anthropology', 2006);
--INSERT INTO Host VALUES (0,0,'bbilly@scu.edu');
--INSERT INTO Host VALUES (0,1,'bbilly@scu.edu');

