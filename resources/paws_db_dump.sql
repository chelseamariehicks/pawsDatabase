-- data definition and sample data insertion queries


--
-- deleting existing tables if exists
--
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS staff_location;
DROP TABLE IF EXISTS species;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS dogs;
DROP TABLE IF EXISTS cats;
SET FOREIGN_KEY_CHECKS = 1;

--
-- creating table structure for location
--
CREATE TABLE `location` (
`loc_id` int(11) NOT NULL AUTO_INCREMENT,
`l_name` varchar(255) NOT NULL,
PRIMARY KEY (`loc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Adding data to table `location`
--
INSERT INTO `location` (`loc_id`, `l_name`) VALUES
(1, 'Dog Kennel'),
(2, 'Cat Kennel');

--
-- creating table structure for staff
--
CREATE TABLE `staff` (
`staff_id` int(11) NOT NULL AUTO_INCREMENT,
`f_name` varchar(255) NOT NULL,
`l_name` varchar(255) NOT NULL,
PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Adding data to table `staff`
--
INSERT INTO `staff` (`staff_id`, `f_name`, `l_name`) VALUES
(1, 'Mary', 'Contrary'),
(2, 'Joe', 'Schmoe'),
(3, 'Jill', 'Smith');

--
-- creating table structure for staff_location
--
CREATE TABLE `staff_location` (
`sl_id` int(11) NOT NULL AUTO_INCREMENT,
`lid` int(11),
`stid` int(11),
PRIMARY KEY (`sl_id`),
FOREIGN KEY (`lid`) REFERENCES `location`(`loc_id`)
ON UPDATE CASCADE ON DELETE SET NULL, 
FOREIGN KEY (`stid`) REFERENCES `staff`(`staff_id`)
ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Adding data to table `staff_location`
--
INSERT INTO `staff_location` (`sl_id`, `lid`, `stid`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 1, 2),
(4, 1, 3),
(5, 2, 3);

--
-- creating table structure for species
--
CREATE TABLE `species` (
`sp_id` int(11) NOT NULL AUTO_INCREMENT,
`sp_name` char(15),
PRIMARY KEY (`sp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Adding data to table species
--
INSERT INTO `species` (`sp_id`, `sp_name`) VALUES
(1, 'Dog'),
(2, 'Cat');

--
-- creating table structure for animal status
--
CREATE TABLE `status` (
`st_id` int(11) NOT NULL AUTO_INCREMENT,
`status` varchar(255) NOT NULL, 
PRIMARY KEY (`st_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Adding data to table status
--
INSERT INTO `status` (`st_id`, `status`) VALUES
(1, 'Ready for Adoption'),
(2, 'Medical Review'),
(3, 'Quarantine'),
(4, 'Adopted');

--
-- creating table structure for cats
--
CREATE TABLE `cats` (
`cat_id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`dob` date,
`description` varchar(255),
`color` varchar(255),
`sex` char(1),
`status` int(11),
`breed` varchar(50),
`species` int(11) DEFAULT 2,
`location` int(11),
`photo` varchar(50),
PRIMARY KEY (`cat_id`),
FOREIGN KEY (`status`) REFERENCES `status`(`st_id`)
ON UPDATE CASCADE ON DELETE SET NULL, 
FOREIGN KEY (`species`) REFERENCES `species`(`sp_id`)
ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY (`location`) REFERENCES `location`(`loc_id`)
ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
--
-- Adding data to table cats
--
INSERT INTO `cats` (`cat_id`, `name`, `dob`, `description`, `color`, `sex`, `status`, `species`, `location`, `photo`, `breed`) VALUES
(1, 'Grumpy Cat', '2012-04-12', 'Often exhibits a sour expression and unfriendly demeanor, but actually a nice cat.',  'Multi', 'F', 1, 2, 2, 'grumpy.png', 'Persian'),
(2, 'Lil Bub', '2011-06-11', 'The runt of the litter but still full of spunk. Often demands food.',  'Multi', 'F', 1, 2, 2, 'lilbub.png', 'Mixed Breed'),
(3, 'Colonel Meow', '2012-01-29', 'Requires a lot of grooming to keep his looks up to date. Otherwise well behaved.',  'Grey', 'M', 1, 2, 2, 'colonel.png', 'Himalayan'),
(4, 'Stubbs', '2019-01-01', 'Recently arrived from Alaska. Thinks he is mayor.',  'Cream', 'M', 1, 2, 2, 'stubs.png', 'Mixed Breed'),
(5, 'George', '2018-01-01', 'Very well behaved. Likes to sit and get petted.',  'Black', 'M', 1, 2, 2, 'george.png', 'American Shorthair');


--
-- creating table structure for dogs
--
CREATE TABLE `dogs` (
`dog_id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`dob` date,
`description` varchar(255),
`color` varchar(255),
`sex` char(1),
`status` int(11),
`breed` varchar(50),
`species` int(11) DEFAULT 1,
`location` int(11),
`photo` varchar(50),
PRIMARY KEY (`dog_id`),
FOREIGN KEY (`status`) REFERENCES `status`(`st_id`)
ON UPDATE CASCADE ON DELETE SET NULL, 
FOREIGN KEY (`species`) REFERENCES `species`(`sp_id`)
ON UPDATE CASCADE ON DELETE SET NULL,
FOREIGN KEY (`location`) REFERENCES `location`(`loc_id`)
ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
--
-- Adding data to table dogs - note different field order than cats
--
INSERT INTO `dogs` (`dog_id`, `name`, `dob`, `description`, `color`, `sex`, `species`, `status`,  `location`, `photo`, `breed`) VALUES
(1, 'Mr. Bubz', '2017-01-12', 'Might be a demon. Has a strange growl and does not like many people.',  'Multi', 'M', 1, 1, 1, 'bubz.png', 'Mixed Breed - Medium'),
(2, 'Boo', '2006-03-16', 'Such a cute and sweet boy but has some heart problems.',  'Ginger', 'M', 1, 1, 1, 'boo.png', 'Pomeranian'),
(3, 'Maraturo', '2007-10-20', 'So doge. Much coat. Such love.',  'Ginger', 'M', 1, 1, 1, 'maturo.png', 'Shiba-Inu'),
(4, 'Tuna', '2010-01-01', 'Very sweet mixed breed. Small in size, funny in face, big in heart.',  'Brown', 'M', 1, 1, 1, 'tuna.png', 'Mixed Breed - Toy'),
(5, 'Doug', '2012-05-20', 'Extremely photogenic and likes a nice lifestyle.',  'Multi', 'M', 1, 1, 1, 'doug.png', 'Pug'),
(6, 'Bully', '2018-06-01', 'Always stunting. Likes cuddles.',  'Multi', 'M', 1, 1, 1, 'bully.png', 'Bulldog'),
(7, 'Punky Brewster', '2018-09-01', 'A permanent member of the good boy club. Punky loves walks, toys and everyone.',  'Multi', 'M', 1, 4, 1, 'punkybrewster.png', 'Chihuahua'),
(8, 'Porgy', '2019-08-01', 'Porgy is super wiggly and just wants to have fun. Very smart and trainable. Will be available soon.',  'Multi', 'F', 1, 3, 1, 'porgy.png', 'Cardigan Welsh Corgi'),
(9, 'Samson', '2017-08-01', 'Samson knows basic commands and appears to like other dogs. Will be good in a family with no young kids.',  'Multi', 'M', 1, 2, 1, 'samson.png', 'American Staffordshire Terrier'),
(10, 'Bella', '2017-07-01', 'Very active, playful and will need lots of work on training. In treatment for worms.',  'Brown', 'F', 1, 2, 1, 'bella.png', 'Mixed Breed - Large');

