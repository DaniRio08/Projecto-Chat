--Base de datos para la aplicación "xat"

CREATE DATABASE projecte_xat;
USE projecte_xat;

--Tabla países
CREATE TABLE IF NOT EXISTS country 
(code VARCHAR(2),
name VARCHAR(100) NOT NULL,
PRIMARY KEY(code));

--Tabla persona
CREATE TABLE persona (
user varchar(50) NOT NULL,
mail varchar(50),
pass varchar(50) NOT NULL,
last_log date DEFAULT NULL,
session varchar(9) DEFAULT NULL,
country varchar(4) NOT NULL,
PRIMARY KEY(mail)
);


--Tabla amistad
CREATE TABLE amistad (
mail1 varchar(50),
mail2 varchar(50),
PRIMARY KEY (mail1, mail2)
);


--Tabla mensaje
CREATE TABLE message (
id bigint(20) AUTO_INCREMENT,
origen varchar(20) NOT NULL,
desti varchar(20) NOT NULL,
text varchar(100) NOT NULL,
PRIMARY KEY (id)
);