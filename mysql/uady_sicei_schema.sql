CREATE DATABASE IF NOT EXISTS uady_sicei;
USE uady_sicei;

CREATE TABLE student(
    enrollment_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_names VARCHAR(30) NOT NULL,
    last_names VARCHAR(30) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(1) NOT NULL,
    enrollment_date DATE NOT NULL
);
