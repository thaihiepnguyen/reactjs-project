DROP DATABASE IF EXISTS `QLHSSV_DB`;

CREATE DATABASE `QLHSSV_DB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `QLHSSV_DB`;

CREATE TABLE `QLHSSV_DB`.`users`
(
    id         INT(11) NOT NULL AUTO_INCREMENT,
    is_valid   TINYINT(1) NOT NULL DEFAULT '1',
    is_active  TINYINT(1) NOT NULL DEFAULT '0',
    fullname   VARCHAR(255) NULL,
    password   VARCHAR(255) NULL,
    email      VARCHAR(255) NULL,
    avatar_url     TEXT NULL,
    role_id    INT(11) NOT NULL DEFAULT '1',
    refresh_token TEXT NULL,
    created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `QLHSSV_DB`.`roles`
(
    id         INT(11) NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NULL,
    created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('student');
INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('teacher');
INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('admin');