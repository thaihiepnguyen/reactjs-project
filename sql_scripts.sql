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
    phone  VARCHAR(255) NULL ,
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

ALTER TABLE `QLHSSV_DB`.`users`
    ADD FOREIGN KEY (role_id) REFERENCES `QLHSSV_DB`.`roles`(id);


INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('student');
INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('teacher');
INSERT INTO `QLHSSV_DB`.`roles` (name) VALUES ('admin');

INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Tran Nguyen Phong', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuFDU4RXtHUv7sXqbzNeHxnD8bVFyDKNy', 'trannguyenphongg@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLUiBWONPcqlLcwcSBAQh-_0H73PfHsByeyQm4QLZDs-Q=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$gMfLNp/W3zMYY29UU5M7Iw$encW71vCUYNuodwr7tP4403rtJHiX8Dktn3CSU0z0uk', '2023-11-10 13:31:57', '2023-11-15 05:37:41', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'Tran Nguyen Phong', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuFDU4RXtHUv7sXqbzNeHxnD8bVFyDKNy', 'trannguyenphongg123@gmail.com', null, 1, null, '2023-11-10 13:39:26', '2023-11-10 13:39:26', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'Tran Nguyen Phong', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuLTy8u41Isk.FrFX0KAu1lYjKQ8aJO.O', 'trannguyenphongg456@gmail.com', null, 1, null, '2023-11-10 14:03:05', '2023-11-10 14:03:05', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'DB nam o host?', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zu53KEID5jPhT/i4Dgp92UKMPVWSkPnWO', 'dbdivedau@gmail.com', null, 1, null, '2023-11-10 14:34:50', '2023-11-10 14:34:50', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'gogojungle', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'gogojungle.document@gmail.com', null, 1, '$argon2id$v=19$m=65536,t=3,p=4$/rp0F1Z+msIu1zzPm1PREQ$r5flI8pvxNEGa77GPgcgC+tCukAfYYaqqC9Cxno3JhM', '2023-11-10 17:31:31', '2023-11-10 18:10:28', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'thaihiepnguyen', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'nthiep232002@gmail.com', null, 1, null, '2023-11-11 03:21:08', '2023-11-11 03:21:08', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'thaihiepnguyen', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'nthiep20@clc.fitus.edu.vn', null, 1, '$argon2id$v=19$m=65536,t=3,p=4$J9YjhrnU3yIG367kNNZf1A$2I2YmKfWaSb3/jtc44VvvT9ORMP78KJQ984HWXiDmg4', '2023-11-11 03:21:25', '2023-11-11 03:23:09', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Nguyễn Thái Hiệp', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuNIayp0x.ulg9eiNytcs98xkfl9Wcy.m', 'thaihiep232002@gmail.com', 'uploads/4156a78af6eef27ca76f94fde8c58e5e.JPEG', 1, '$argon2id$v=19$m=65536,t=3,p=4$8RdREUwI/GsEqSYXvfBPCQ$vN4U/87fSWNQmMA0Ya3zXSktsPMSWbs6z7bO1gqb2qM', '2023-11-12 16:13:09', '2023-11-14 14:11:02', '0977328391');
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Lê Đăng Khoa', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002@gmail.com', 'uploads/117c92fc3e3f2140fa53100a4a6bd1ed5.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$m4Kp003z31s0X28rhtsz4A$W4DQFcQa59f8QTv7Slf1Ss3w4qIG+h/Qft0/uVr9+v4', '2023-11-13 13:49:27', '2023-11-15 04:16:18', '0344102242');
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Khoa Lê', '', 'nq.ledangkhoa@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLlVjkFMHlcS4L_HWEeSwRS8DN0yYrcVY3-nYGc8ch2Jg=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$lQVJUQJZtCTZs6YN8yRFFw$PKnzR8v1OjtISmW+oo5sjv0VjGj1ZJUqozj21xhHFIE', '2023-11-14 18:10:41', '2023-11-14 18:59:12', '0344102242');
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Lê Đăng Khoa', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa20@clc.fitus.edu.vn', 'uploads\\d639f09d219fe329a1d3048c107c5f64e.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$7Mew5O3mfUSXFmkwTB7v+g$hHPoaNsYnN7GFv50jvoGJ1KL7JXddSbnhHLuOSbr84I', '2023-11-14 18:59:43', '2023-11-15 04:48:19', '0344102242');
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'test', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa.114022@gmail.com', null, 1, null, '2023-11-14 19:03:23', '2023-11-14 19:03:23', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Khoa Lê', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022@gmail.com', null, 1, null, '2023-11-15 02:49:19', '2023-11-15 02:51:00', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 1, 'Lê Đặng Đăng Khoa', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa@gmail.com', 'uploads/59f9a77f10a7847b83b410d079a2bc7476.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$PcznPOSyef7Zuvgn3dDIvw$C2FKvZ0JA+vJ/ATSLQ+mYqa9VHusrtWMJvsS6nQlyoU', '2023-11-15 04:15:40', '2023-11-15 04:34:11', '0344444444');
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'test', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002222@gmail.com', null, 1, null, '2023-11-15 04:22:09', '2023-11-15 04:22:09', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'Nichi Test', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022222@gmail.com', null, 1, null, '2023-11-15 04:22:43', '2023-11-15 04:22:43', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'Nichi Test', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420202@gmail.com', null, 1, null, '2023-11-15 04:23:14', '2023-11-15 04:23:14', null);
INSERT INTO `QLHSSV_DB`.users (is_valid, is_active, fullname, password, email, avatar_url, role_id, refresh_token, created_at, updated_at, phone) VALUES (1, 0, 'Đăng Lê', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa.11402@gmail.com', null, 1, null, '2023-11-15 05:26:00', '2023-11-15 05:26:00', null);



CREATE TABLE `QLHSSV_DB`.`email_templates`
(
    id         INT(11) NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NULL,
    content    TEXT NULL,
    created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;


INSERT INTO `QLHSSV_DB`.`email_templates` (name, content)
VALUES ('verify_email', '
  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; font-size: 16px;">
              <p style="margin: 0;">Hi, $user_name$</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; font-size: 16px;">
              <p style="margin: 0;">This is your account verification email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to confirm your email address.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="http://localhost:3001/auth/verify-email?token=$token$" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: ''Source Sans Pro'', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> PTUDWNC Company</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
      </td>
    </tr>
    <!-- end copy block -->
  </table>');
