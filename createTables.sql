DROP TABLE 'comments';
DROP TABLE "locations";
DROP TABLE "attendees";
DROP TABLE "hosts";
DROP TABLE `events`;
DROP TABLE "alumni";

CREATE TABLE `events` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`name`	TEXT NOT NULL,
	`date`	INTEGER,
	`endTime`	INTEGER,
	`description`	TEXT,
	`category`	TEXT,
	`interested`	INTEGER,
	`approved`	INTEGER,
	`denied`	INTEGER,
	`created`	INTEGER NOT NULL
);


CREATE TABLE "hosts" (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`eventID`	INTEGER NOT NULL,
	`name`	TEXT,
	`email`	TEXT,
	`major`	TEXT,
	`graduation`	INTEGER,
	`created`	INTEGER NOT NULL
);

CREATE TABLE "attendees" (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`eventID`	INTEGER NOT NULL,
	`name`	TEXT,
	`major`	TEXT,
	`graduation`	INTEGER,
	`created`	INTEGER NOT NULL
);

CREATE TABLE "locations" (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`eventID`	INTEGER NOT NULL,
	`address`	TEXT,
	`city`	TEXT,
	`state`	TEXT,
	`zipcode`	TEXT,
	`country`	TEXT,
	`created`	INTEGER NOT NULL
);

CREATE TABLE "comments" (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`eventID`	INTEGER NOT NULL,
	`name`	TEXT,
	`rating`	INTEGER,
	`detail`	TEXT,
	`created`	INTEGER NOT NULL
);

--this table is a simulation of an alumni database we assume the Alumni Office has
CREATE TABLE "alumni" (
    `id`    INTEGER PRIMARY KEY AUTOINCREMENT,
    `name`  TEXT,
    `major` TEXT,
    `graduation`    INTEGER
);

INSERT INTO 'events' VALUES (1,'Law School Fundraising',1542160800,1542175200,'Join us for wine and food while we celebrate the new Law building and all the successful lawyers with it.','Fundraising',0,0,0,1540797431);
INSERT INTO 'events' VALUES (2,'Art Appreciation',1535544010,1535558410,'Join us as we appreciate the intricacies of the medieval art era.','Theatre & Arts',10,1,0,1540797596);
INSERT INTO 'events' VALUES (3,'2019 Reunion',1549580400,1549609200,'Come celebrate the years that have gone by and the years that are yet to come!','Reunion',0,1,0,1540797712);

INSERT INTO hosts VALUES (1,1,'Jerry Menikoff','jmen@gmail.com','Philosophy',1998,1540797431);
INSERT INTO hosts VALUES (2,2,'Nancy Cruzan','cruizinlife@gmail.com','Art History',2002,1540797596);
INSERT INTO hosts VALUES (3,3,'Alumni Office','alumni@scu.edu','N/A','N/A',1540797712);

INSERT INTO attendees VALUES (1,2,'Chris Hemsworth','Chinese',2009,1540797870);
INSERT INTO attendees VALUES (2,2,'Tamera Smith','Neuroscience',2003,1540797902);
INSERT INTO attendees VALUES (3,2,'Jordan Michael','Civil Engineering',2013,1540797923);

INSERT INTO locations VALUES (1,1,'604 El Camino Real, ','Santa Clara','CA',95050,'United States',1540797431);
INSERT INTO locations VALUES (2,2,'San Francisco Art History Museum, ','San Francisco','CA',93053,'United States',1540797596);
INSERT INTO locations VALUES (3,3,'500 El Camino Real, Locatelli','Santa Clara','CA',95050,'United States',1540797712);

INSERT INTO comments VALUES (1,2,'Jordan Michael',4,'Loved the art. Wish there was food.',1540797957);

INSERT INTO alumni VALUES (1,'Jerry Menikoff','Philosophy',1998);
INSERT INTO alumni VALUES (2,'Nancy Cruzan','Art History',2002);
INSERT INTO alumni VALUES (3,'Chris Hemsworth','Chinese',2009);
INSERT INTO alumni VALUES (4,'Tamera Smith','Neuroscience',2003);
INSERT INTO alumni VALUES (5,'Jordan Michael','Civil Engineering',2013);
INSERT INTO alumni VALUES (6,'Shannen Edwin','Computer Science and Engineering',2019);
INSERT INTO alumni VALUES (7,'Sarah Johnson','Computer Science and Engineering',2019);
INSERT INTO alumni VALUES (8,'Terry Shih','Computer Science and Engineering',2019);
INSERT INTO alumni VALUES (9,'Ken Wakaba','Computer Science and Engineering',2018);


