-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: bozsppyqyit7rubycbqd-mysql.services.clever-cloud.com:21385
-- Generation Time: Dec 16, 2023 at 08:18 AM
-- Server version: 8.0.33-25
-- PHP Version: 8.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bozsppyqyit7rubycbqd`
--
CREATE DATABASE IF NOT EXISTS `bj5wlxkn4p7pcx9cgj5l` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `bj5wlxkn4p7pcx9cgj5l`;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `teacher_ids` varchar(255) DEFAULT NULL,
  `class_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `is_valid`, `is_active`, `title`, `description`, `teacher_ids`, `class_code`, `created_at`, `updated_at`) VALUES
(4, 1, 0, 'CSC13112_20KTPM1', 'Thiết kế giao diện', '81, 61', '267126-cbad', '2023-11-28 15:50:43', '2023-12-15 15:52:31'),
(5, 1, 1, 'CSC14005_20KHDL2', 'Nhập môn học máy', '81, 61', '43gh-32131dgd', '2023-11-28 15:50:44', '2023-11-30 17:54:18'),
(6, 1, 1, 'CSC13009_20KTPM1', 'Phát triển phần mềm cho thiết bị di động', '61', '893da213-213bbe', '2023-11-28 15:50:44', '2023-11-30 17:54:18'),
(7, 1, 1, 'CSC13001_20KTPM', 'Lập trình Windows', '61', '1yhh213-21312dd', '2023-11-29 16:34:25', '2023-11-30 17:54:18'),
(10, 1, 1, 'CSC13112_20KTPM2', 'Pháp luật đại cương', '61', '3iybas72-1272d', '2023-11-30 17:24:40', '2023-12-09 15:24:19'),
(18, 1, 1, 'CSC13114_20KTPM2', 'Phát triển ứng dụng web nâng cao', '61', '3716abbf-1c20', '2023-12-01 09:14:17', '2023-12-16 03:36:23'),
(19, 1, 1, 'ABC', 'ABC', '86', 'POPOP', '2023-12-02 11:21:49', '2023-12-06 17:06:39'),
(25, 1, 1, 'Nhập môn lập trình', 'NMLT CLC 01', '86', 'khoaclc', '2023-12-03 14:09:11', '2023-12-03 14:09:11'),
(26, 1, 1, 'khoale khoale', '123123', '86', '123123', '2023-12-16 05:08:43', '2023-12-16 05:08:43'),
(27, 1, 1, 'khoale khoale', '123123', '86', '1231234', '2023-12-16 05:25:11', '2023-12-16 05:25:11');

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `name`, `content`, `created_at`, `updated_at`) VALUES
(1, 'verify_email', '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:36px 24px 0;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf\"><h1 style=\"margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px\">Confirm Your Email Address</h1></td></tr></table></td></tr><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px\"><p style=\"margin:0\">Hi, $user_name$</p><p style=\"margin:0\">This is your account verification email.</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px\"><p style=\"margin:0\">Tap the button below to confirm your email address.</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#ffffff\" style=\"padding:12px\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" bgcolor=\"#1a82e2\" style=\"border-radius:6px\"><a href=\"$url$/auth/verify-email?token=$token$\" target=\"_blank\" style=\"display:inline-block;padding:16px 36px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;color:#fff;text-decoration:none;border-radius:6px\">Verify Email</a></td></tr></table></td></tr></table></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-bottom:3px solid #d4dadf\"><p style=\"margin:0\">Cheers,<br>PTUDWNC Company</p></td></tr></table></td></tr></table>', '2023-11-20 15:27:42', '2023-12-04 17:08:31'),
(2, 'verify_reset_password', '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:36px 24px 0;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf\"><h1 style=\"margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px\">Forgot Password?</h1></td></tr></table></td></tr><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px\"><p style=\"margin:0\">Hi, $user_name$</p><p style=\"margin:0\">We have received a genuine request to reset your account password. </p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px\"><p style=\"margin:0\">Regenerate a new password by clicking the button below.</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#ffffff\" style=\"padding:12px\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" bgcolor=\"#1a82e2\" style=\"border-radius:6px\"><a href=\"$url$/auth/reset-password?token=$token$&email=$email$\" target=\"_blank\" style=\"display:inline-block;padding:16px 36px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;color:#fff;text-decoration:none;border-radius:6px\">Reset Password</a></td></tr></table></td></tr></table></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-bottom:3px solid #d4dadf\"><p style=\"margin:0\">Cheers,<br>PTUDWNC Company</p></td></tr></table></td></tr></table>', '2023-11-24 14:42:13', '2023-12-04 16:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `from` int DEFAULT NULL,
  `to` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `is_valid`, `title`, `content`, `from`, `to`, `created_at`, `updated_at`) VALUES
(42, 1, 'Thông báo kiểm tra giữa kì', '<h5>Thông báo từ lớp học CSC14005_20KHDL2 </h5> <p>Lớp chúng ta sẽ kiểm tra giữa kì vào ngày 12/ 12 /2023 lúc 12:00</p> <h5>Trân trọng, </h5> <h5>Hiệp Nguyễn</h5>', 81, 61, '2023-12-10 13:46:45', '2023-12-10 13:46:45'),
(43, 1, 'Thông báo kiểm tra cuối kì', '<h5>Thông báo từ lớp học CSC13114_20KTPM2 </h5> <p>Chúng ta sẽ kiểm tra cuối kì vào tuần sau. Chúc các em học tốt!!!</p> <h5>Trân trọng, </h5> <h5>Nguyễn Thái Hiệp</h5>', 61, 81, '2023-12-10 13:48:00', '2023-12-10 13:48:00');

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `id` int NOT NULL,
  `course_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`id`, `course_id`, `student_id`, `created_at`, `updated_at`) VALUES
(1, 4, 61, '2023-11-28 15:53:52', '2023-11-28 15:53:52'),
(2, 5, 61, '2023-11-28 15:53:52', '2023-11-28 15:53:52'),
(3, 6, 61, '2023-11-28 15:53:52', '2023-11-28 15:53:52'),
(5, 10, 61, '2023-11-30 18:37:07', '2023-11-30 18:37:07'),
(7, 25, 23, '2023-12-03 14:16:16', '2023-12-03 14:16:16'),
(8, 7, 61, '2023-12-06 17:04:32', '2023-12-06 17:04:32'),
(9, 7, 81, '2023-12-09 08:38:25', '2023-12-09 08:38:25'),
(11, 27, 23, '2023-12-16 05:31:06', '2023-12-16 05:31:06'),
(19, 5, 81, '2023-12-16 06:39:51', '2023-12-16 06:39:51');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'student', '2023-11-07 17:28:07', '2023-11-07 17:28:07'),
(2, 'teacher', '2023-11-07 17:28:08', '2023-11-07 17:28:08'),
(3, 'admin', '2023-11-07 17:28:09', '2023-11-07 17:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `fullname` varchar(255) DEFAULT NULL,
  `studentId` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar_url` text,
  `role_id` int NOT NULL DEFAULT '1',
  `refresh_token` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `is_valid`, `is_active`, `fullname`, `studentId`, `password`, `email`, `avatar_url`, `role_id`, `refresh_token`, `created_at`, `updated_at`, `phone`) VALUES
(1, 1, 1, 'Super Admin', NULL, '$2a$12$KTOb3DX/ZAWNdOw3rE3saOuXsExlG/C2BhXWm1HgizSLKwqBKlN7.', 'admin@admin.com', 'http://localhost:3001/uploads\\7bd64d52d6da495e4fc890a830a19fac.jpg', 3, '$argon2id$v=19$m=65536,t=3,p=4$b40K1Y6NpvxS2XtOKmc9NQ$q8ruDhC7zXqajJbf82J5HZZ+Ti3MFE28k2RmWHETZWY', '2023-11-28 17:00:45', '2023-12-16 07:56:48', '0344441111'),
(7, 1, 1, 'Tran Nguyen Phong', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuFDU4RXtHUv7sXqbzNeHxnD8bVFyDKNy', 'trannguyenphongg123@gmail.com', NULL, 1, NULL, '2023-11-10 13:39:26', '2023-12-03 12:12:36', NULL),
(8, 1, 0, 'Tran Nguyen Phong', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuLTy8u41Isk.FrFX0KAu1lYjKQ8aJO.O', 'trannguyenphongg456@gmail.com', NULL, 1, NULL, '2023-11-10 14:03:05', '2023-12-03 12:13:41', NULL),
(9, 0, 0, 'DB nam o host?', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zu53KEID5jPhT/i4Dgp92UKMPVWSkPnWO', 'dbdivedau@gmail.com', NULL, 1, NULL, '2023-11-10 14:34:50', '2023-12-03 05:27:28', NULL),
(12, 1, 1, 'gogojungle', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'gogojungle.document@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocL5z2shdwGvNU301xg2jPt1FOLlncyyJ6M3iz4eYKQ59A=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$l1J1JNm+XOWidN+2frLGcg$OvBawSa7OnTaruMB0hcyKd6C5CYrq99gbhSxVQkhY18', '2023-11-10 17:31:31', '2023-11-20 15:36:40', NULL),
(15, 1, 0, 'thaihiepnguyen', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'nthiep232002@gmail.com', NULL, 1, NULL, '2023-11-11 03:21:08', '2023-11-11 03:21:08', NULL),
(20, 1, 1, 'Lê Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002@gmail.com', 'http://localhost:3001/uploads/e3356b1f5d2d5849c5f0d8f5f433a1a8.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$0qkR2zLKg/wondAkpA3ymA$Zy2egvLzkAEI8dK7hXj3AW88v+vJIbF2JQ3u/DPbYH0', '2023-11-13 13:49:27', '2023-12-06 13:55:44', '0344102242'),
(21, 1, 1, 'Khoa Lê', NULL, '', 'nq.ledangkhoa@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLlVjkFMHlcS4L_HWEeSwRS8DN0yYrcVY3-nYGc8ch2Jg=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$lQVJUQJZtCTZs6YN8yRFFw$PKnzR8v1OjtISmW+oo5sjv0VjGj1ZJUqozj21xhHFIE', '2023-11-14 18:10:41', '2023-11-14 18:59:12', '0344102242'),
(22, 1, 1, 'Lê Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa20@clc.fitus.edu.vn', 'uploads\\c9b23a55acc52a7f2685d879fa049c43.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$+yqJRdPkffak7ykk8NV/ug$S+ZuuKovi/cx/Ok67ROScdWiJMbp6YvJay9ntWK7/Ag', '2023-11-14 18:59:43', '2023-11-26 10:35:03', '0344102242'),
(23, 1, 1, 'Lê Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa.11402@gmail.com', 'https://avatars.githubusercontent.com/u/103125520?v=4', 1, '$argon2id$v=19$m=65536,t=3,p=4$pa7dS28Jri6sjNLkBh/N3Q$PIr+Hzay8x03X409la70issp8viqFPAYP+fjh/UlEXs', '2023-11-14 19:03:23', '2023-12-16 05:24:10', '0344444444'),
(24, 1, 1, 'Khoa Lê', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022@gmail.com', NULL, 1, NULL, '2023-11-15 02:49:19', '2023-11-15 02:51:00', NULL),
(25, 0, 1, 'Lê Đặng Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa@gmail.com', 'http://localhost:3001/uploads/59f9a77f10a7847b83b410d079a2bc7476.jpg', 2, '$argon2id$v=19$m=65536,t=3,p=4$PcznPOSyef7Zuvgn3dDIvw$C2FKvZ0JA+vJ/ATSLQ+mYqa9VHusrtWMJvsS6nQlyoU', '2023-11-15 04:15:40', '2023-12-14 07:56:31', '0344444444'),
(26, 1, 0, 'test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002222@gmail.com', NULL, 1, NULL, '2023-11-15 04:22:09', '2023-11-15 04:22:09', NULL),
(27, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022222@gmail.com', NULL, 1, NULL, '2023-11-15 04:22:43', '2023-11-15 04:22:43', NULL),
(28, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420202@gmail.com', NULL, 1, NULL, '2023-11-15 04:23:14', '2023-11-15 04:23:14', NULL),
(61, 1, 1, 'Nguyễn Thái Hiệp', '20127496', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuNIayp0x.ulg9eiNytcs98xkfl9Wcy.m', 'thaihiep232002@gmail.com', 'http://localhost:3001/uploads/42b865bf510642f91fee0f233e8fc33ee.JPEG', 2, '$argon2id$v=19$m=65536,t=3,p=4$A5xiVDZBz2BxXqWzMHCOig$y+4HQQlNIg15Z20UUnKjpElZUrr95WSE6M6xLX7cwWc', '2023-11-23 03:23:02', '2023-12-14 07:50:28', '0977328391'),
(66, 1, 0, 'a', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa11s402@gmail.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$PfXoN5u6YvV/qKJYjcSHaA$Hu0ghywtq4ciEk3HNTi1WHg4s9alwRi6ZsQCkaX4mxc', '2023-11-26 09:39:33', '2023-11-26 09:39:34', NULL),
(67, 1, 0, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa1s1s402@gmail.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$VC1FKci130ru5QNjwDKUIA$Kk+0tYDUA/zlt+CpnGcpgfFQ3fXaOuy6s1wMfvT9Pv4', '2023-11-26 09:44:53', '2023-11-26 09:44:53', NULL),
(68, 1, 0, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', '123123@gmail.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$FmufSrbiDnGcGCjlJk2pPg$v8JHiwkrbUn+A9yybLanuUyRPfulg2BAWj0VobzLjTs', '2023-11-26 09:49:56', '2023-11-26 09:49:57', NULL),
(72, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'lvr18659@zslsz.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$liNPbe2fjHtGNth3mHAQjA$OVLGncgOQrkC//Ka4KP3xQ0Zx0HxipMcJg/+2qxGKLM', '2023-11-28 16:19:23', '2023-11-28 16:19:23', NULL),
(73, 1, 0, 'test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'klc41868@nezid.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$WX1KDXRDEA7GvVxNEw7zCA$BsnZbruC11fukIIxaS5mPqLOf6MMJp6xnCCKoNDuGJI', '2023-11-28 16:22:43', '2023-11-28 16:22:44', NULL),
(74, 1, 0, 'hap95104@zbock.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'hap95104@zbock.com', NULL, 1, NULL, '2023-11-28 16:32:04', '2023-11-28 16:32:04', NULL),
(75, 1, 0, 'jwj22726@omeie.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'jwj22726@omeie.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$nju8yssS42d9dX/8nB4HtQ$7mV8fI7WPE8AO5fjMZvYPUowcTgKsGw7G7JKh8N7t/w', '2023-11-28 16:32:52', '2023-11-28 16:32:53', NULL),
(76, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'eim20447@omeie.com', 'http://localhost:3001/uploads\\6c30d1dd4dbfbd046b91a4a8d1cada9f.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$Z8XBxyqUqRozbwZK70rTYQ$8/9bZfOpKpeDyYyyKZoUq0oMCNUBGtSboqNwsAqz/Lc', '2023-11-28 16:36:57', '2023-11-29 16:24:01', '0344444444'),
(81, 1, 1, 'Hiệp Nguyễn', 'null', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuNIayp0x.ulg9eiNytcs98xkfl9Wcy.m', 'nthiep20@clc.fitus.edu.vn', 'http://localhost:3001/uploads/8f5138e370af68b4f815e5e22b4a2e26.png', 2, '$argon2id$v=19$m=65536,t=3,p=4$Zo3DJi5ZcH23fX3yr6pPIQ$bWCA2UqCQJGh8vJwb2kVPkMuIEFqoreTu62cF6NYayQ', '2023-11-29 16:19:54', '2023-12-16 06:54:16', '0977328391'),
(82, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'test@gmail.com', NULL, 3, NULL, '2023-12-03 11:19:05', '2023-12-03 11:19:05', NULL),
(83, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'test@gmail.com', NULL, 3, NULL, '2023-12-03 11:19:41', '2023-12-03 11:19:41', NULL),
(86, 1, 1, 'Khoa Teacher', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'khoa@gmail.com', 'http://localhost:3001/uploads\\5efea6bd282b6e77996f637278948293.jpg', 2, '$argon2id$v=19$m=65536,t=3,p=4$eWIJ+2MgtlXovtbw1DU3eg$pR3k3NqlLOu75oehtwb2XODZUOC829e3IM5tBMF5IMQ', '2023-12-03 11:29:21', '2023-12-16 07:47:02', NULL),
(87, 1, 1, 'ohn68844@omeie.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'ohn68844@omeie.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$8KFqyP3vXQp+wu0/1Ydrqw$AFATL0U+b8HdrDIvEzT9+b45fu3WNCSePUMD8HBUY5A', '2023-12-04 15:43:56', '2023-12-04 15:51:54', NULL),
(88, 1, 0, 'tsq08998@nezid.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'tsq08998@nezid.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$hUIOFWzoq+bEEMbDttliAw$mfpfX4/t8wlbsNkbIbGfZxQCiRAgUFjDCKAIKbKiERw', '2023-12-05 16:08:43', '2023-12-05 16:08:44', NULL),
(89, 1, 0, 'dekgfyooysekmbfaia@cazlq.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'dekgfyooysekmbfaia@cazlq.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$2CeRyLodJO7KZyPn13ommg$ybJT0Bpx4VVxGVDOcUqFZte7Cof8mZ7djJqo3BYccvI', '2023-12-05 16:10:04', '2023-12-05 16:10:06', NULL),
(97, 1, 1, 'Phong Trần Nguyên', NULL, '', 'tnphong20@clc.fitus.edu.vn', 'https://lh3.googleusercontent.com/a/ACg8ocJKbVMabJpnA2nSHvnTgKZmctaVAFLsG5nu-vl23u5r=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$bMApC8fceJ5xUO9k0AhH6A$v8aoDpHLU9YMX3+IS5jcs3iS4f8PHWADkCmXHXqYKro', '2023-12-06 08:35:11', '2023-12-06 08:35:12', NULL),
(99, 1, 1, 'PhongTran', '2012759000', '', 'trannguyenphongg@gmail.com', 'https://avatars.githubusercontent.com/u/74850769?v=4', 1, '$argon2id$v=19$m=65536,t=3,p=4$ly8L1B1KQVL/Svu9H2IZ4Q$WZHztVqNgS1zYAHQHqEDRk5pMTHh2GqBwuhVk8hfB1Q', '2023-12-06 08:39:38', '2023-12-16 02:58:50', '0827907444'),
(100, 1, 1, 'PhongTran', '20127590', '', 'trannguyenphongg@gmail.com', 'https://avatars.githubusercontent.com/u/74850769?v=4', 1, '$argon2id$v=19$m=65536,t=3,p=4$ZqVAoCxD/y3nKwFHY7ThgQ$Dz7ueSA3PyUJjI1LUlUBfTO9voPlbRp0YbjwARF13p8', '2023-12-06 08:39:38', '2023-12-10 13:59:06', NULL),
(101, 1, 0, 'jpt63825@zslsz.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'jpt63825@zslsz.com', NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$nBX+SsK4uGFqayFL7638TA$Myqc/VUY4Qt5wUMrrleXyIoDA1UYJR463c+rzu1EFMo', '2023-12-06 14:00:21', '2023-12-06 14:00:22', NULL),
(102, 1, 1, 'Đăng Khoa Lê', '20127533', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'khoale@pixelcent.com', 'https://lh3.googleusercontent.com/a/ACg8ocJExSACg6xhgU0ArV4j_kNMhxy9SnBY6-exeSXQenGBMw=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$kLxlDB2bcl7Z9gBg9Mln8g$MU+BZYfo9Pe8jJAK+NCJuT7E5j0AlAtjpOHaIQBP4ro', '2023-12-06 14:02:25', '2023-12-16 03:51:29', '0344102242');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `courses` ADD FULLTEXT KEY `title` (`title`,`description`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_from_fk` (`from`),
  ADD KEY `user_to_fk` (`to`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `participant_unikey` (`course_id`,`student_id`),
  ADD KEY `courses_student_fk` (`student_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);
ALTER TABLE `users` ADD FULLTEXT KEY `fullname` (`fullname`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `user_from_fk` FOREIGN KEY (`from`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_to_fk` FOREIGN KEY (`to`) REFERENCES `users` (`id`);

--
-- Constraints for table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `courses_student_fk` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;
