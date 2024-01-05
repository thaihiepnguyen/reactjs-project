-- Host: bck3mm97awdhhrgcudor-mysql.services.clever-cloud.com:21385
-- Generation Time: Jan 05, 2024 at 08:08 AM
-- Server version: 8.0.33-25
-- PHP Version: 8.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `bck3mm97awdhhrgcudor`
--
CREATE DATABASE IF NOT EXISTS `bck3mm97awdhhrgcudor` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `bck3mm97awdhhrgcudor`;

-- --------------------------------------------------------

--
-- Table structure for table `absent_participants`
--

CREATE TABLE `absent_participants` (
  `id` int NOT NULL,
  `course_id` int NOT NULL DEFAULT '0',
  `student_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `absent_participants`
--

INSERT INTO `absent_participants` (`id`, `course_id`, `student_id`, `created_at`, `updated_at`) VALUES
(22, 28, '20127496', '2023-12-27 06:00:40', '2023-12-27 06:00:40'),
(23, 28, '20117444', '2023-12-27 06:00:40', '2023-12-27 06:00:40'),
(26, 6, '20127654', '2023-12-27 08:49:06', '2023-12-27 08:49:06'),
(48, 28, '361277312', '2023-12-27 13:25:06', '2023-12-27 13:25:06'),
(50, 28, '20127444', '2023-12-27 13:30:41', '2023-12-27 13:30:41'),
(53, 6, '20127999', '2023-12-27 13:34:32', '2023-12-27 13:34:32'),
(55, 6, '20128000', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(56, 6, '20128001', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(57, 6, '20128002', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(58, 6, '20128003', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(59, 6, '20128004', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(60, 6, '20128005', '2024-01-02 08:50:04', '2024-01-02 08:50:04'),
(61, 6, '20128006', '2024-01-02 08:50:04', '2024-01-02 08:50:04');

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
(4, 1, 1, 'CSC13112_20KTPM1', 'Thiết kế giao diện', '81, 61', '267126-cbad', '2023-11-28 15:50:43', '2023-12-18 14:51:31'),
(5, 1, 1, 'CSC14005_20KHDL2', 'Nhập môn học máy', '81, 61, 86', '43gh-32131dgd', '2023-11-28 15:50:44', '2023-12-18 15:42:59'),
(6, 1, 1, 'CSC13009_20KTPM1', 'Phát triển phần mềm cho thiết bị di động', '61, 86', '893da213-213bbe', '2023-11-28 15:50:44', '2023-12-18 17:52:53'),
(7, 1, 1, 'CSC13001_20KTPM', 'Lập trình Windows', '61', '1yhh213-21312dd', '2023-11-29 16:34:25', '2023-11-30 17:54:18'),
(10, 1, 1, 'CSC13112_20KTPM2', 'Pháp luật đại cương', '61', '3iybas72-1272d', '2023-11-30 17:24:40', '2023-12-09 15:24:19'),
(18, 1, 0, 'CSC13114_20KTPM2', 'Phát triển ứng dụng web nâng cao', '61', '3716abbf-1c20', '2023-12-01 09:14:17', '2023-12-17 08:54:43'),
(19, 0, 1, 'ABC', 'ABC', '86', 'POPOP', '2023-12-02 11:21:49', '2023-12-16 12:32:56'),
(25, 1, 1, 'Nhập môn lập trình', 'NMLT CLC 01', '86', 'khoaclc', '2023-12-03 14:09:11', '2023-12-03 14:09:11'),
(26, 0, 1, 'khoale khoale', '123123', '86', '123123', '2023-12-16 05:08:43', '2023-12-16 14:29:19'),
(27, 1, 1, 'khoale khoale', '123123', '86, 81', '1231234', '2023-12-16 05:25:11', '2023-12-19 13:52:33'),
(28, 1, 1, 'CSC13001_20KTPM', 'Lập trình Windows', '81', '5a261eb9-7a7c-480f-9980-0fd28678bcb4', '2023-12-26 14:09:42', '2023-12-26 14:09:42'),
(29, 1, 1, 'Khoa Test Course', 'Test', '86', 'khoale', '2023-12-26 14:30:02', '2023-12-26 14:30:02'),
(30, 0, 1, 'sdasdas', 'dasdsadsadsaa', '81', '83735055-66bd-40ae-afca-a860caf50b1b', '2023-12-26 14:41:39', '2023-12-26 14:43:42'),
(31, 1, 1, 'Test 2', 'test2', '86', 'test2', '2023-12-26 14:43:25', '2023-12-26 14:43:25'),
(32, 0, 1, 'test3', 'test3', '86', 'test3', '2023-12-26 14:46:43', '2024-01-02 09:38:50'),
(33, 0, 1, 'test4', 'test4', '86', 'test4', '2023-12-26 14:49:15', '2024-01-02 09:38:47'),
(34, 0, 1, 'test 5', 'test 5', '86', 'test 5', '2023-12-26 14:50:35', '2024-01-02 09:38:44'),
(35, 0, 1, 'test 6', 'test 6', '86', 'test 6', '2023-12-26 14:52:45', '2024-01-02 09:38:42');

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
(2, 'verify_reset_password', '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:36px 24px 0;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf\"><h1 style=\"margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px\">Forgot Password?</h1></td></tr></table></td></tr><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px\"><p style=\"margin:0\">Hi, $user_name$</p><p style=\"margin:0\">We have received a genuine request to reset your account password. </p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px\"><p style=\"margin:0\">Regenerate a new password by clicking the button below.</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#ffffff\" style=\"padding:12px\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" bgcolor=\"#1a82e2\" style=\"border-radius:6px\"><a href=\"$url$/auth/reset-password?token=$token$&email=$email$\" target=\"_blank\" style=\"display:inline-block;padding:16px 36px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;color:#fff;text-decoration:none;border-radius:6px\">Reset Password</a></td></tr></table></td></tr></table></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-bottom:3px solid #d4dadf\"><p style=\"margin:0\">Cheers,<br>PTUDWNC Company</p></td></tr></table></td></tr></table>', '2023-11-24 14:42:13', '2023-12-04 16:15:52'),
(3, 'course_invitation', '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:36px 24px 0;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf\"><h1 style=\"margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px\">You have received an invitation to join the class: $courseName$</h1></td></tr></table></td></tr><tr><td align=\"center\" bgcolor=\"#e9ecef\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:600px\"><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px\"><p style=\"margin:0\">Hi, $user_name$</p><p style=\"margin:0\">Teacher in $courseName$ has invited you to this class</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px\"><p style=\"margin:0\">Tap the button below to join our class. (Your role in the class is the role set in your account)</p></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" bgcolor=\"#ffffff\" style=\"padding:12px\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" bgcolor=\"#1a82e2\" style=\"border-radius:6px\"><a href=\"$url$/join-class?code=classCode\" target=\"_blank\" style=\"display:inline-block;padding:16px 36px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;color:#fff;text-decoration:none;border-radius:6px\">Accept the invitation</a></td></tr></table></td></tr></table></td></tr><tr><td align=\"left\" bgcolor=\"#ffffff\" style=\"padding:24px;font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-bottom:3px solid #d4dadf\"><p style=\"margin:0\">Cheers,<br>PTUDWNC Company</p></td></tr></table></td></tr></table>', '2023-12-20 14:52:49', '2023-12-20 14:52:49');

-- --------------------------------------------------------

--
-- Table structure for table `grade_compositions`
--

CREATE TABLE `grade_compositions` (
  `id` int NOT NULL,
  `course_id` int NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `scale` int NOT NULL DEFAULT '0',
  `order` int DEFAULT '0',
  `is_final` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `grade_compositions`
--

INSERT INTO `grade_compositions` (`id`, `course_id`, `name`, `scale`, `order`, `is_final`, `created_at`, `updated_at`) VALUES
(2, 1, 'cot thu 1', 20, 0, 1, '2023-12-19 16:28:24', '2023-12-24 18:21:26'),
(9, 2, 'dasdasd', 5, 0, 1, '2023-12-19 17:33:10', '2023-12-24 18:21:26'),
(11, 5, 'Điểm cuối kì', 70, 1, 1, '2023-12-20 04:55:07', '2023-12-24 18:49:20'),
(12, 25, 'Điểm giữa kì', 20, 0, 0, '2023-12-20 09:08:02', '2023-12-20 09:08:02'),
(13, 25, 'Điểm cuối kì', 80, 0, 0, '2023-12-20 09:08:02', '2023-12-20 09:08:02'),
(134, 4, 'Giữa Kì', 40, 1, 0, '2023-12-24 16:23:44', '2023-12-24 16:26:37'),
(135, 4, 'Lab 1', 10, 0, 0, '2023-12-24 16:23:44', '2023-12-24 16:26:37'),
(136, 4, 'Cuối Kì', 50, 2, 0, '2023-12-24 16:23:44', '2023-12-24 16:23:44'),
(140, 5, 'Lab', 20, 2, 1, '2023-12-24 16:56:07', '2023-12-24 18:49:20'),
(142, 5, 'Seminar', 10, 0, 1, '2023-12-24 17:01:54', '2023-12-26 04:55:49'),
(146, 6, 'Lab 1', 10, 0, 1, '2023-12-24 17:38:35', '2024-01-03 16:57:48'),
(147, 28, 'Giữa Kỳ', 20, 0, 1, '2023-12-26 14:11:01', '2023-12-26 14:29:20'),
(148, 28, 'Lab 1', 20, 1, 1, '2023-12-26 14:11:01', '2023-12-27 04:14:45'),
(149, 28, 'Cuối Kỳ', 50, 2, 1, '2023-12-26 14:11:01', '2023-12-26 14:29:47'),
(153, 29, 'Lab 1', 50, 0, 0, '2023-12-26 14:35:07', '2023-12-26 14:35:07'),
(154, 29, 'Lab 2', 50, 1, 0, '2023-12-26 14:35:07', '2023-12-26 14:35:07'),
(155, 30, 'dsadsadasd', 100, 0, 0, '2023-12-26 14:41:56', '2023-12-26 14:41:56'),
(157, 31, 'Fnial', 100, 0, 0, '2023-12-26 14:44:37', '2023-12-26 14:44:37'),
(158, 32, 'a', 100, 0, 0, '2023-12-26 14:46:56', '2023-12-26 14:46:56'),
(160, 33, '1', 50, 0, 0, '2023-12-26 14:50:05', '2023-12-26 14:50:05'),
(161, 33, '2', 50, 1, 0, '2023-12-26 14:50:05', '2023-12-26 14:50:05'),
(162, 34, '100', 100, 0, 0, '2023-12-26 14:50:47', '2023-12-26 14:50:47'),
(163, 35, '100', 100, 0, 1, '2023-12-26 14:52:56', '2023-12-31 10:18:12'),
(164, 28, 'Lab 2', 10, 3, 1, '2023-12-27 04:14:44', '2023-12-27 04:52:50'),
(165, 6, 'Lab 2', 10, 1, 1, '2023-12-27 08:35:27', '2024-01-03 16:57:48'),
(166, 6, 'Lab 3', 10, 2, 1, '2023-12-27 08:35:27', '2024-01-02 10:33:12'),
(167, 6, 'Midterm', 30, 3, 1, '2023-12-27 08:35:27', '2024-01-02 10:34:24'),
(168, 6, 'Final', 40, 4, 1, '2023-12-27 08:35:27', '2024-01-02 10:41:05'),
(169, 27, 'Giua ki', 40, 0, 1, '2023-12-28 16:59:47', '2023-12-28 17:04:44'),
(170, 27, 'Cuoi ki', 60, 1, 1, '2023-12-28 16:59:47', '2023-12-28 17:04:44');

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
(246, 1, 'x', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>x</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 21, '2024-01-03 16:57:31', '2024-01-03 16:57:31'),
(247, 1, 'x', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>x</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 16:57:31', '2024-01-03 16:57:31'),
(248, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 1 của bạn là: 10.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 102, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(249, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 1 của bạn là: 10.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(250, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 1 của bạn là: 10.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 21, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(251, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 2 của bạn là: 1.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 102, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(252, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 2 của bạn là: 10.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(253, 1, 'Thông báo điểm thi', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm Lab 2 của bạn là: 10.00</p> <p>Xem chi tiết điểm <a href=http://localhost:3000/course/6?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 21, '2024-01-03 16:57:49', '2024-01-03 16:57:49'),
(254, 1, 'Thông báo xin được phúc khảo Lab 3', '<h5>Thông báo xin được phúc khảo điểm ở lớp CSC13009_20KTPM1 </h5> <p>Xin cô chấm lại ạ</p> <h5>Trân trọng, </h5> <h5>Lê Đăng Khoa</h5>', 23, 86, '2024-01-03 17:05:18', '2024-01-03 17:05:18'),
(255, 1, 'Thông báo phúc khảo Lab 3', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm sau khi phúc khảo của em là: 9.75 điểm</p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 17:11:02', '2024-01-03 17:11:02'),
(256, 1, 'Thông báo xin được phúc khảo Lab 3', '<h5>Thông báo xin được phúc khảo điểm ở lớp CSC13009_20KTPM1 </h5> <p>Xin cô chấm lại ạ</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=http://localhost:3000/course/6?tab=request-review&scoreId=99>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Lê Đăng Khoa</h5>', 23, 86, '2024-01-03 17:11:40', '2024-01-03 17:11:40'),
(257, 1, 'Thông báo phúc khảo Lab 3', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p>Điểm sau khi phúc khảo của em là: 5 điểm</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=http://localhost:3000/course/6?tab=score&scoreId=99>tại đây</a></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 17:32:44', '2024-01-03 17:32:44'),
(258, 1, 's', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>sss</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 21, '2024-01-04 19:14:37', '2024-01-04 19:14:37'),
(259, 1, 's', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>ssss</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-03 17:32:44', '2024-01-04 19:19:14'),
(261, 1, 's', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>sss</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 21, '2024-01-04 19:26:42', '2024-01-04 19:26:42'),
(262, 1, 's', '<h5>Thông báo từ lớp học CSC13009_20KTPM1 </h5> <p><p>sss</p></p> <h5>Trân trọng, </h5> <h5>Khoa Teacher</h5>', 86, 23, '2024-01-04 19:26:42', '2024-01-04 19:26:42');

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
(5, 10, 61, '2023-11-30 18:37:07', '2023-11-30 18:37:07'),
(7, 25, 23, '2023-12-03 14:16:16', '2023-12-03 14:16:16'),
(25, 18, 81, '2023-12-17 08:34:31', '2023-12-17 08:34:31'),
(27, 25, 61, '2023-12-20 09:15:19', '2023-12-20 09:15:19'),
(36, 5, 7, '2023-12-21 16:24:56', '2023-12-21 16:24:56'),
(37, 5, 12, '2023-12-21 16:24:56', '2023-12-21 16:24:56'),
(40, 5, 23, '2023-12-21 16:24:56', '2023-12-21 16:24:56'),
(41, 5, 61, '2023-12-21 16:24:56', '2023-12-21 16:24:56'),
(42, 5, 99, '2023-12-21 16:24:56', '2023-12-21 16:24:56'),
(44, 5, 105, '2023-12-24 15:33:30', '2023-12-24 15:33:30'),
(46, 29, 23, '2023-12-26 14:30:46', '2023-12-26 14:30:46'),
(47, 35, 23, '2023-12-26 15:11:30', '2023-12-26 15:11:30'),
(48, 34, 23, '2023-12-26 15:12:38', '2023-12-26 15:12:38'),
(56, 28, 61, '2023-12-27 13:25:06', '2023-12-27 13:25:06'),
(59, 27, 61, '2023-12-28 16:56:51', '2023-12-28 16:56:51'),
(61, 6, 23, '2024-01-02 08:56:43', '2024-01-02 08:56:43'),
(62, 6, 21, '2024-01-02 09:13:21', '2024-01-02 09:13:21');

--
-- Triggers `participants`
--
CREATE TRIGGER `trigger_upd_participants` AFTER INSERT ON `participants` FOR EACH ROW BEGIN
	DELETE FROM absent_participants
	WHERE course_id = NEW.course_id AND student_id = (SELECT student_id FROM users WHERE id = NEW.student_id);
END;

-- --------------------------------------------------------

--
-- Table structure for table `request_message`
--

CREATE TABLE `request_message` (
  `id` int NOT NULL,
  `request_id` int NOT NULL,
  `from` int NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `order` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `request_message`
--

INSERT INTO `request_message` (`id`, `request_id`, `from`, `message`, `order`, `created_at`, `updated_at`) VALUES
(6, 7, 23, 's', '0', '2023-12-27 18:47:41', '2023-12-27 18:47:41'),
(7, 7, 86, 'Chỉnh lại r nha', '1', '2023-12-27 20:06:25', '2023-12-27 20:06:25'),
(8, 8, 23, 'Xin cô chấm lại ạ', '0', '2023-12-27 20:08:18', '2023-12-27 20:08:18'),
(13, 8, 86, 'Oke em', '1', '2023-12-28 07:12:54', '2023-12-28 07:12:54'),
(14, 9, 23, 'Midterm em điểm thấp quá thầy ạ. Mong thầy chấm lại', '0', '2023-12-28 07:48:39', '2023-12-28 07:48:39'),
(15, 9, 86, 'Chấm lại r nha em kiểm tra lại giúp thầy!', '1', '2023-12-28 07:49:43', '2023-12-28 07:49:43'),
(16, 7, 23, 'Chưa được ạ!', '2', '2023-12-28 08:02:14', '2023-12-28 08:02:14'),
(17, 7, 86, '-1 luôn', '3', '2023-12-28 08:02:41', '2023-12-28 08:02:41'),
(18, 8, 23, 'Pleaseeee', '2', '2023-12-28 08:21:03', '2023-12-28 08:21:03'),
(19, 8, 86, 'Lần cuối nha', '3', '2023-12-28 08:21:39', '2023-12-28 08:21:39'),
(20, 10, 23, 'Chấm lại đi ạ', '0', '2023-12-28 14:47:44', '2023-12-28 14:47:44'),
(21, 10, 86, 'Chấm lại rồi nhe', '1', '2023-12-28 14:49:08', '2023-12-28 14:49:08'),
(22, 11, 61, 'Điểm của em quá cao, nhờ Thầy hạ với ạ', '0', '2023-12-28 15:28:17', '2023-12-28 15:28:17'),
(23, 12, 61, 'Thầy chấm gì mà 10 điểm luôn vậy ????', '0', '2023-12-28 15:36:18', '2023-12-28 15:36:18'),
(24, 12, 81, 'Đã hạ xuống 8.5 rồi. Em đã vừa lòng chưa ????', '1', '2023-12-28 15:51:28', '2023-12-28 15:51:28'),
(25, 13, 61, 'Điểm của em cao quá thầy ơi', '0', '2023-12-28 16:35:35', '2023-12-28 16:35:35'),
(26, 14, 61, 'test noti', '0', '2023-12-28 16:39:27', '2023-12-28 16:39:27'),
(27, 15, 61, 'test noti 22222', '0', '2023-12-28 16:40:35', '2023-12-28 16:40:35'),
(32, 20, 61, 'chấm lại cho em với !!!!', '0', '2023-12-28 17:26:36', '2023-12-28 17:26:36'),
(33, 21, 61, 'chấm lại cho em với :)))', '0', '2023-12-28 17:29:15', '2023-12-28 17:29:15'),
(34, 20, 81, 'xuống 9 điểm nhé :)', '1', '2023-12-29 03:04:12', '2023-12-29 03:04:12'),
(35, 20, 61, 'aloooo', '2', '2023-12-29 03:49:06', '2023-12-29 03:49:06'),
(36, 20, 81, 'ALOOOOOO', '3', '2023-12-29 03:51:17', '2023-12-29 03:51:17'),
(37, 20, 61, 'Hello em', '4', '2023-12-29 03:52:07', '2023-12-29 03:52:07'),
(38, 20, 81, 'OKe cho 10 điểm', '5', '2023-12-29 04:03:44', '2023-12-29 04:03:44'),
(39, 20, 61, 'Test notiiii', '6', '2023-12-29 04:04:13', '2023-12-29 04:04:13'),
(40, 21, 81, 'Okeee', '1', '2023-12-29 04:07:15', '2023-12-29 04:07:15'),
(41, 21, 61, 'AHIHIHII', '2', '2023-12-29 04:09:44', '2023-12-29 04:09:44'),
(42, 21, 81, 'HEllo', '3', '2023-12-29 04:15:10', '2023-12-29 04:15:10'),
(43, 21, 61, 'Test notiiiii', '4', '2023-12-29 04:15:42', '2023-12-29 04:15:42'),
(44, 21, 81, 'Roi oke', '5', '2023-12-29 04:45:02', '2023-12-29 04:45:02'),
(45, 21, 61, 'Hello Thay', '6', '2023-12-29 04:45:35', '2023-12-29 04:45:35'),
(46, 20, 81, 'Hạ điểm ', '7', '2023-12-29 04:57:15', '2023-12-29 04:57:15'),
(47, 20, 61, 'Téttttt rồi', '8', '2023-12-29 04:57:54', '2023-12-29 04:57:54'),
(48, 12, 61, 'Thầy chấm thấp quá Thầy ơi :<<', '2', '2023-12-31 07:20:52', '2023-12-31 07:20:52'),
(49, 11, 81, 'Thầy sửa rồi đó em', '1', '2023-12-31 07:36:09', '2023-12-31 07:36:09'),
(50, 11, 61, 'dạ em cảm ơn Thầy', '2', '2023-12-31 07:37:53', '2023-12-31 07:37:53'),
(51, 11, 81, '7 điểm thôi em nha', '3', '2023-12-31 07:41:37', '2023-12-31 07:41:37'),
(52, 12, 81, '6 điểm thôi nha', '3', '2023-12-31 07:43:23', '2023-12-31 07:43:23'),
(53, 11, 61, 'test notiiii 3333', '4', '2023-12-31 07:44:59', '2023-12-31 07:44:59'),
(54, 12, 61, 'dạ oke thầy', '4', '2023-12-31 07:58:16', '2023-12-31 07:58:16'),
(55, 11, 81, 'test 333', '5', '2023-12-31 07:59:02', '2023-12-31 07:59:02'),
(56, 11, 61, 'test reply 3333', '6', '2023-12-31 08:00:49', '2023-12-31 08:00:49'),
(57, 11, 81, 'test noti 444', '7', '2023-12-31 08:04:23', '2023-12-31 08:04:23'),
(58, 11, 61, 'reply notiii 4444', '8', '2023-12-31 08:04:59', '2023-12-31 08:04:59'),
(59, 11, 81, 'test notii 555', '9', '2023-12-31 08:13:06', '2023-12-31 08:13:06'),
(60, 11, 61, 'Test reply 5555', '10', '2023-12-31 08:19:22', '2023-12-31 08:19:22'),
(61, 13, 81, 'okee', '1', '2023-12-31 08:23:15', '2023-12-31 08:23:15'),
(62, 13, 61, 'test reply 111', '2', '2023-12-31 08:25:27', '2023-12-31 08:25:27'),
(63, 13, 81, 'test 222', '3', '2023-12-31 08:28:31', '2023-12-31 08:28:31'),
(64, 13, 61, 'tesst rely 222', '4', '2023-12-31 08:31:33', '2023-12-31 08:31:33'),
(65, 13, 81, 'test 111', '5', '2023-12-31 08:33:36', '2023-12-31 08:33:36'),
(66, 13, 61, 'test reply 1111111', '6', '2023-12-31 08:34:07', '2023-12-31 08:34:07'),
(67, 13, 81, 'test', '7', '2023-12-31 08:35:23', '2023-12-31 08:35:23'),
(68, 13, 61, 'reply test 11', '8', '2023-12-31 08:35:52', '2023-12-31 08:35:52'),
(69, 13, 81, 'test again', '9', '2023-12-31 08:49:51', '2023-12-31 08:49:51'),
(70, 13, 61, 'reply again', '10', '2023-12-31 08:50:29', '2023-12-31 08:50:29'),
(71, 11, 81, 'giưã kỳ', '11', '2023-12-31 08:53:27', '2023-12-31 08:53:27'),
(72, 11, 61, 'test reply', '12', '2023-12-31 08:55:20', '2023-12-31 08:55:20'),
(73, 11, 81, 'test ', '13', '2023-12-31 09:04:10', '2023-12-31 09:04:10'),
(74, 11, 61, 'reply noti 555555', '14', '2023-12-31 09:04:53', '2023-12-31 09:04:53'),
(75, 22, 23, 'Xin chào cô ạ. Mong cô xem lại điểm của em', '0', '2023-12-31 10:18:46', '2023-12-31 10:18:46'),
(76, 23, 23, '1', '0', '2023-12-31 10:29:10', '2023-12-31 10:29:10'),
(77, 23, 86, '2', '1', '2023-12-31 10:32:16', '2023-12-31 10:32:16'),
(78, 23, 23, '3', '2', '2023-12-31 10:33:07', '2023-12-31 10:33:07'),
(79, 23, 86, '4', '3', '2023-12-31 10:36:41', '2023-12-31 10:36:41'),
(80, 23, 23, '5', '4', '2023-12-31 10:37:15', '2023-12-31 10:37:15'),
(81, 13, 81, 'testt', '11', '2023-12-31 10:38:11', '2023-12-31 10:38:11'),
(82, 23, 86, '6', '5', '2023-12-31 10:38:11', '2023-12-31 10:38:11'),
(83, 23, 23, '7', '6', '2023-12-31 10:38:46', '2023-12-31 10:38:46'),
(84, 13, 61, 'testtttt', '12', '2023-12-31 10:39:18', '2023-12-31 10:39:18'),
(85, 12, 81, 'testt NOTI', '5', '2023-12-31 10:40:30', '2023-12-31 10:40:30'),
(86, 13, 81, 'test', '13', '2023-12-31 10:42:11', '2023-12-31 10:42:11'),
(87, 12, 61, 'test NOTI reply', '6', '2023-12-31 10:43:15', '2023-12-31 10:43:15'),
(88, 24, 23, '1', '0', '2023-12-31 10:44:52', '2023-12-31 10:44:52'),
(89, 11, 81, 'test noti', '15', '2023-12-31 10:57:07', '2023-12-31 10:57:07'),
(90, 13, 61, 'test reply again', '14', '2023-12-31 11:06:40', '2023-12-31 11:06:40'),
(91, 11, 61, 'Test noti', '16', '2024-01-01 14:34:12', '2024-01-01 14:34:12'),
(92, 13, 81, 'dhaisdhidw', '15', '2024-01-01 15:03:54', '2024-01-01 15:03:54'),
(93, 12, 81, 'alooo em', '7', '2024-01-01 15:05:13', '2024-01-01 15:05:13'),
(94, 11, 81, 'Thầy chấm lại điểm cho em ', '17', '2024-01-01 15:22:41', '2024-01-01 15:22:41'),
(95, 13, 61, 'Thầy chấm lại cho em với', '16', '2024-01-01 15:30:53', '2024-01-01 15:30:53'),
(96, 13, 81, 'đã chấm lại ', '17', '2024-01-01 15:31:59', '2024-01-01 15:31:59'),
(97, 14, 81, 'thầy chấm lại rồi thanks em', '1', '2024-01-01 15:35:33', '2024-01-01 15:35:33'),
(98, 15, 81, 'ahihia', '1', '2024-01-01 15:40:25', '2024-01-01 15:40:25'),
(99, 14, 61, 'Chấm điểm lại cho em ạ', '2', '2024-01-01 16:06:55', '2024-01-01 16:06:55'),
(100, 7, 23, 'huhu', '4', '2024-01-02 09:33:57', '2024-01-02 09:33:57'),
(101, 25, 23, 'Xin cô chấm lại ạ', '0', '2024-01-03 17:05:17', '2024-01-03 17:05:17'),
(102, 25, 86, 'Rồi nha', '1', '2024-01-03 17:11:01', '2024-01-03 17:11:01'),
(103, 25, 23, 'Xin cô chấm lại ạ', '2', '2024-01-03 17:11:39', '2024-01-03 17:11:39'),
(104, 25, 86, 'Chấm lại rồi nha', '3', '2024-01-03 17:32:42', '2024-01-03 17:32:42');

-- --------------------------------------------------------

--
-- Table structure for table `request_review`
--

CREATE TABLE `request_review` (
  `id` int NOT NULL,
  `score_id` int NOT NULL,
  `accept_new_request` tinyint(1) DEFAULT '0',
  `isFinal` tinyint(1) DEFAULT '0',
  `isSeen` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `request_review`
--

INSERT INTO `request_review` (`id`, `score_id`, `accept_new_request`, `isFinal`, `isSeen`, `created_at`, `updated_at`) VALUES
(7, 97, 0, 0, 0, '2023-12-27 18:47:40', '2024-01-02 09:33:58'),
(8, 98, 0, 1, 0, '2023-12-27 20:08:17', '2023-12-28 08:21:39'),
(9, 100, 0, 1, 0, '2023-12-28 07:48:38', '2023-12-28 07:49:42'),
(10, 101, 0, 1, 0, '2023-12-28 14:47:43', '2023-12-28 14:49:07'),
(11, 122, 1, 0, 0, '2023-12-28 15:28:16', '2024-01-01 15:22:41'),
(12, 123, 1, 0, 0, '2023-12-28 15:36:18', '2024-01-01 15:05:12'),
(13, 124, 1, 0, 0, '2023-12-28 16:35:34', '2024-01-01 15:31:58'),
(14, 127, 0, 0, 0, '2023-12-28 16:39:26', '2024-01-01 16:06:55'),
(15, 128, 1, 0, 0, '2023-12-28 16:40:34', '2024-01-01 15:40:24'),
(20, 136, 0, 0, 0, '2023-12-28 17:26:35', '2023-12-29 04:57:55'),
(21, 135, 0, 0, 0, '2023-12-28 17:29:14', '2023-12-29 04:45:36'),
(22, 137, 0, 0, 0, '2023-12-31 10:18:46', '2023-12-31 10:18:46'),
(23, 138, 0, 0, 0, '2023-12-31 10:29:09', '2023-12-31 10:38:46'),
(24, 139, 0, 0, 0, '2023-12-31 10:44:51', '2023-12-31 10:44:51'),
(25, 99, 1, 0, 0, '2024-01-03 17:05:16', '2024-01-03 17:32:42');

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
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int NOT NULL,
  `grade_id` int NOT NULL DEFAULT '0',
  `student_id` varchar(50) DEFAULT NULL,
  `teacher_id` int NOT NULL DEFAULT '0',
  `score` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `grade_id`, `student_id`, `teacher_id`, `score`, `created_at`, `updated_at`) VALUES
(1, 147, '20127491', 81, 10.00, '2023-12-27 03:25:33', '2023-12-27 03:25:33'),
(2, 148, '20127491', 81, 6.00, '2023-12-27 03:25:33', '2023-12-27 03:25:33'),
(3, 149, '20127491', 81, 5.00, '2023-12-27 03:25:33', '2023-12-27 03:25:33'),
(4, 147, '20127495', 81, 10.00, '2023-12-27 03:27:02', '2023-12-27 03:27:02'),
(5, 148, '20127495', 81, 10.00, '2023-12-27 03:27:02', '2023-12-27 03:27:02'),
(6, 149, '20127495', 81, 9.00, '2023-12-27 03:27:02', '2023-12-27 03:27:02'),
(10, 147, '20127499', 81, 7.00, '2023-12-27 03:39:59', '2023-12-27 03:59:56'),
(11, 148, '20127499', 81, 10.00, '2023-12-27 03:39:59', '2023-12-27 03:39:59'),
(12, 149, '20127499', 81, 7.00, '2023-12-27 03:39:59', '2023-12-27 03:39:59'),
(20, 164, '20127499', 81, 10.00, '2023-12-27 04:15:01', '2023-12-27 04:15:01'),
(24, 164, '20127495', 81, 9.00, '2023-12-27 04:18:23', '2023-12-27 04:18:23'),
(32, 147, '20127444', 81, 19.00, '2023-12-27 06:17:24', '2023-12-27 06:20:18'),
(33, 148, '20127444', 81, 111.00, '2023-12-27 06:17:24', '2023-12-27 13:30:42'),
(34, 149, '20127444', 81, 10.00, '2023-12-27 06:17:24', '2023-12-27 06:17:24'),
(35, 164, '20127444', 81, 10.00, '2023-12-27 06:17:24', '2023-12-27 06:17:24'),
(77, 146, '20127999', 86, 9.00, '2023-12-27 13:34:33', '2024-01-04 18:14:43'),
(78, 165, '20127999', 86, 9.00, '2023-12-27 13:34:33', '2024-01-04 18:14:43'),
(79, 166, '20127999', 86, 9.00, '2023-12-27 13:34:33', '2024-01-04 18:14:43'),
(80, 167, '20127999', 86, 9.00, '2023-12-27 13:34:33', '2024-01-04 18:14:43'),
(81, 168, '20127999', 86, 9.00, '2023-12-27 13:34:33', '2024-01-04 18:14:43'),
(87, 146, '20127533', 86, 10.00, '2023-12-27 13:37:17', '2023-12-28 03:11:43'),
(88, 165, '20127533', 86, 1.00, '2023-12-27 13:37:17', '2023-12-27 13:37:17'),
(89, 166, '20127533', 86, 2.00, '2023-12-27 13:37:17', '2023-12-27 13:37:17'),
(90, 167, '20127533', 86, 3.00, '2023-12-27 13:37:17', '2023-12-27 13:37:17'),
(91, 168, '20127533', 86, 4.00, '2023-12-27 13:37:17', '2023-12-27 13:37:17'),
(92, 146, '123456', 86, 10.00, '2023-12-27 13:37:34', '2023-12-27 13:37:34'),
(93, 165, '123456', 86, 10.00, '2023-12-27 13:37:34', '2023-12-27 13:37:34'),
(94, 166, '123456', 86, 10.00, '2023-12-27 13:37:34', '2023-12-27 13:37:34'),
(95, 167, '123456', 86, 10.00, '2023-12-27 13:37:34', '2023-12-27 13:37:34'),
(96, 168, '123456', 86, 1.00, '2023-12-27 13:37:34', '2023-12-27 13:37:34'),
(97, 146, '20127564', 86, 10.00, '2023-12-27 13:39:49', '2024-01-02 10:54:08'),
(98, 165, '20127564', 86, 10.00, '2023-12-27 13:39:49', '2023-12-28 08:21:39'),
(99, 166, '20127564', 86, 5.00, '2023-12-27 13:39:49', '2024-01-03 17:32:42'),
(100, 167, '20127564', 86, 10.00, '2023-12-27 13:39:49', '2024-01-02 10:54:08'),
(101, 168, '20127564', 86, 10.00, '2023-12-27 13:39:49', '2024-01-02 10:54:08'),
(117, 167, '20127599', 86, 10.00, '2023-12-28 08:27:52', '2024-01-02 10:54:08'),
(118, 146, '20127599', 86, 10.00, '2023-12-28 08:27:52', '2024-01-02 10:54:08'),
(119, 166, '20127599', 86, 10.00, '2023-12-28 08:27:52', '2024-01-02 10:54:08'),
(120, 165, '20127599', 86, 10.00, '2023-12-28 08:27:52', '2024-01-02 10:54:08'),
(121, 168, '20127599', 86, 10.00, '2023-12-28 08:27:52', '2023-12-28 08:27:52'),
(122, 147, '20127480', 81, 10.00, '2023-12-28 15:25:35', '2024-01-01 15:22:41'),
(123, 148, '20127480', 81, 10.00, '2023-12-28 15:25:35', '2024-01-01 15:05:12'),
(124, 149, '20127480', 81, 9.00, '2023-12-28 15:25:35', '2024-01-01 15:31:58'),
(125, 164, '20127480', 81, 4.00, '2023-12-28 15:25:35', '2023-12-28 15:25:35'),
(126, 142, '20127480', 81, 10.00, '2023-12-28 16:38:54', '2023-12-28 16:38:54'),
(127, 11, '20127480', 81, 10.00, '2023-12-28 16:38:54', '2024-01-02 13:38:07'),
(128, 140, '20127480', 81, 10.00, '2023-12-28 16:38:54', '2024-01-02 13:38:07'),
(132, 135, '20127480', 81, 10.00, '2023-12-28 16:55:45', '2023-12-28 16:55:45'),
(133, 134, '20127480', 81, 10.00, '2023-12-28 16:55:45', '2023-12-28 16:55:45'),
(134, 136, '20127480', 81, 10.00, '2023-12-28 16:55:45', '2023-12-28 16:55:45'),
(135, 169, '20127480', 81, 1.00, '2023-12-28 17:00:00', '2023-12-29 04:45:01'),
(136, 170, '20127480', 81, 10.00, '2023-12-28 17:00:00', '2023-12-29 04:03:44'),
(139, 163, '20127564', 86, 10.00, '2023-12-31 10:44:36', '2023-12-31 10:44:36'),
(207, 146, '20127654', 86, 9.00, '2024-01-02 11:00:54', '2024-01-04 18:14:43'),
(208, 165, '20127654', 86, 9.00, '2024-01-02 11:00:54', '2024-01-04 18:14:43'),
(209, 166, '20127654', 86, 9.00, '2024-01-02 11:00:54', '2024-01-04 18:14:43'),
(210, 167, '20127654', 86, 9.00, '2024-01-02 11:00:54', '2024-01-04 18:14:43'),
(211, 168, '20127654', 86, 9.00, '2024-01-02 11:00:54', '2024-01-04 18:14:43'),
(237, 142, '20127564', 81, 10.00, '2024-01-02 13:38:07', '2024-01-02 13:38:07'),
(238, 11, '20127564', 81, 10.00, '2024-01-02 13:38:07', '2024-01-02 13:38:07'),
(239, 140, '20127564', 81, 10.00, '2024-01-02 13:38:07', '2024-01-02 13:38:07'),
(240, 142, '2012759000', 81, 10.00, '2024-01-02 13:38:07', '2024-01-02 13:38:07'),
(258, 11, '2012759000', 81, 10.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(259, 140, '2012759000', 81, 10.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(260, 142, '20127412', 81, 9.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(261, 11, '20127412', 81, 9.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(262, 140, '20127412', 81, 9.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(263, 142, '20127655', 81, 3.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(264, 11, '20127655', 81, 3.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(265, 140, '20127655', 81, 3.00, '2024-01-02 13:49:37', '2024-01-02 13:49:37'),
(278, 146, '20128000', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(279, 165, '20128000', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(280, 166, '20128000', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(281, 167, '20128000', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(282, 168, '20128000', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(283, 146, '20128001', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(284, 165, '20128001', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(285, 166, '20128001', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(286, 167, '20128001', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(287, 168, '20128001', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(288, 146, '20128002', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(289, 165, '20128002', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(290, 166, '20128002', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(291, 167, '20128002', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(292, 168, '20128002', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(293, 146, '20128003', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(294, 165, '20128003', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(295, 166, '20128003', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(296, 167, '20128003', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(297, 168, '20128003', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(298, 146, '20128004', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(299, 165, '20128004', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(300, 166, '20128004', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(301, 167, '20128004', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(302, 168, '20128004', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(303, 146, '20128005', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(304, 165, '20128005', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(305, 166, '20128005', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(306, 167, '20128005', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(307, 168, '20128005', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(308, 146, '20128006', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(309, 165, '20128006', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(310, 166, '20128006', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(311, 167, '20128006', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43'),
(312, 168, '20128006', 86, 9.00, '2024-01-04 18:14:43', '2024-01-04 18:14:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `fullname` varchar(255) DEFAULT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar_url` text,
  `role_id` int NOT NULL DEFAULT '1',
  `refresh_token` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `is_valid`, `is_active`, `fullname`, `student_id`, `password`, `email`, `phone`, `avatar_url`, `role_id`, `refresh_token`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Super Admin', NULL, '$2a$12$KTOb3DX/ZAWNdOw3rE3saOuXsExlG/C2BhXWm1HgizSLKwqBKlN7.', 'admin@admin.com', '0344441111', 'http://localhost:3001/uploads\\7bd64d52d6da495e4fc890a830a19fac.jpg', 3, '$argon2id$v=19$m=65536,t=3,p=4$tc8kha4Dvg0dV+WhndQpzQ$G3T8/5u2xiBuDZAG/Q7ceUEAZnzggn3aYIxBucfU/Zg', '2023-11-28 17:00:45', '2024-01-05 05:47:01'),
(7, 1, 1, 'Tran Nguyen Phong', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuFDU4RXtHUv7sXqbzNeHxnD8bVFyDKNy', 'trannguyenphongg123@gmail.com', NULL, NULL, 1, NULL, '2023-11-10 13:39:26', '2023-12-03 12:12:36'),
(8, 1, 0, 'Tran Nguyen Phong', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuLTy8u41Isk.FrFX0KAu1lYjKQ8aJO.O', 'trannguyenphongg456@gmail.com', NULL, NULL, 1, NULL, '2023-11-10 14:03:05', '2023-12-03 12:13:41'),
(9, 0, 0, 'DB nam o host?', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zu53KEID5jPhT/i4Dgp92UKMPVWSkPnWO', 'dbdivedau@gmail.com', NULL, NULL, 1, NULL, '2023-11-10 14:34:50', '2023-12-03 05:27:28'),
(12, 1, 1, 'gogojungle', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'gogojungle.document@gmail.com', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocL5z2shdwGvNU301xg2jPt1FOLlncyyJ6M3iz4eYKQ59A=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$l1J1JNm+XOWidN+2frLGcg$OvBawSa7OnTaruMB0hcyKd6C5CYrq99gbhSxVQkhY18', '2023-11-10 17:31:31', '2023-11-20 15:36:40'),
(15, 1, 0, 'thaihiepnguyen', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuYZl8X3O2pZOD7767GivlKYchFFxNI6y', 'nthiep232002@gmail.com', NULL, NULL, 1, NULL, '2023-11-11 03:21:08', '2023-11-11 03:21:08'),
(20, 1, 1, 'Lê Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002@gmail.com', '0344102242', 'http://localhost:3001/uploads/e3356b1f5d2d5849c5f0d8f5f433a1a8.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$HFGnYRzRTvNTmZQFfTKc2g$aaq1DZPvQBV5fmaMPh8AyrGNH/g1p/i5lwA7EEdNRg0', '2023-11-13 13:49:27', '2024-01-04 19:09:03'),
(21, 1, 1, 'Lê Quân', '20127599', '', 'nq.ledangkhoa@gmail.com', '0344102242', 'https://lh3.googleusercontent.com/a/ACg8ocLlVjkFMHlcS4L_HWEeSwRS8DN0yYrcVY3-nYGc8ch2Jg=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$5jvhtm+t5Q1EI02Y+nCUyQ$7l1yaSaM2tIz023Be9+1+f5CKgJGATuhAf3lvz4p9vs', '2023-11-14 18:10:41', '2024-01-04 19:02:00'),
(22, 1, 1, 'Lê Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa20@clc.fitus.edu.vn', '0344102242', 'uploads\\c9b23a55acc52a7f2685d879fa049c43.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$FYfxdGM0DN1el/GRuz6yQA$EiEGCBqkpEOM/rF1PMQ1WHkiNCt65OalRsrfp1aTf7w', '2023-11-14 18:59:43', '2024-01-04 18:45:49'),
(23, 1, 1, 'Lê Đăng Khoa', '20127564', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa.11402@gmail.com', '0344444444', 'https://avatars.githubusercontent.com/u/103125520?v=4', 1, '$argon2id$v=19$m=65536,t=3,p=4$euCe9PvHly5+HHPJU3vZ8A$ReTAGq6vXzvhkZzDIHngA5OmdeRjhaUVMhZ3Zwxsq5I', '2023-11-14 19:03:23', '2024-01-05 05:03:57'),
(24, 1, 1, 'Khoa Lê', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022@gmail.com', NULL, NULL, 1, NULL, '2023-11-15 02:49:19', '2023-11-15 02:51:00'),
(25, 0, 1, 'Lê Đặng Đăng Khoa', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa@gmail.com', '0344444444', 'http://localhost:3001/uploads/59f9a77f10a7847b83b410d079a2bc7476.jpg', 2, '$argon2id$v=19$m=65536,t=3,p=4$PcznPOSyef7Zuvgn3dDIvw$C2FKvZ0JA+vJ/ATSLQ+mYqa9VHusrtWMJvsS6nQlyoU', '2023-11-15 04:15:40', '2023-12-19 13:48:16'),
(26, 1, 0, 'test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa1142002222@gmail.com', NULL, NULL, 1, NULL, '2023-11-15 04:22:09', '2023-11-15 04:22:09'),
(27, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420022222@gmail.com', NULL, NULL, 1, NULL, '2023-11-15 04:22:43', '2023-11-15 04:22:43'),
(28, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ledangkhoa11420202@gmail.com', NULL, NULL, 1, NULL, '2023-11-15 04:23:14', '2023-11-15 04:23:14'),
(61, 1, 1, 'Nguyễn Thái Hiệp', '20127480', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuNIayp0x.ulg9eiNytcs98xkfl9Wcy.m', 'thaihiep232002@gmail.com', '0977328391', 'https://nestjs-webnc-32ea4ac958a0.herokuapp.com/uploads/e7f408ea1a59bed2cb29e66a514f67a10.JPEG', 1, '$argon2id$v=19$m=65536,t=3,p=4$mjtq9zDglhLf0RkAdXc/Dg$SoWpKm3A3x0Em2s5N8sFvg1q1Lh3mfJ7S2zJbL+pdQ8', '2023-11-23 03:23:02', '2024-01-05 06:28:28'),
(66, 1, 0, 'a', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa11s402@gmail.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$PfXoN5u6YvV/qKJYjcSHaA$Hu0ghywtq4ciEk3HNTi1WHg4s9alwRi6ZsQCkaX4mxc', '2023-11-26 09:39:33', '2023-11-26 09:39:34'),
(67, 1, 0, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'ldkhoa1s1s402@gmail.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$VC1FKci130ru5QNjwDKUIA$Kk+0tYDUA/zlt+CpnGcpgfFQ3fXaOuy6s1wMfvT9Pv4', '2023-11-26 09:44:53', '2023-11-26 09:44:53'),
(68, 1, 0, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', '123123@gmail.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$FmufSrbiDnGcGCjlJk2pPg$v8JHiwkrbUn+A9yybLanuUyRPfulg2BAWj0VobzLjTs', '2023-11-26 09:49:56', '2023-11-26 09:49:57'),
(72, 1, 0, 'Nichi Test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'lvr18659@zslsz.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$liNPbe2fjHtGNth3mHAQjA$OVLGncgOQrkC//Ka4KP3xQ0Zx0HxipMcJg/+2qxGKLM', '2023-11-28 16:19:23', '2023-11-28 16:19:23'),
(73, 1, 0, 'test', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'klc41868@nezid.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$WX1KDXRDEA7GvVxNEw7zCA$BsnZbruC11fukIIxaS5mPqLOf6MMJp6xnCCKoNDuGJI', '2023-11-28 16:22:43', '2023-11-28 16:22:44'),
(74, 1, 0, 'hap95104@zbock.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'hap95104@zbock.com', NULL, NULL, 1, NULL, '2023-11-28 16:32:04', '2023-11-28 16:32:04'),
(75, 1, 0, 'jwj22726@omeie.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'jwj22726@omeie.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$nju8yssS42d9dX/8nB4HtQ$7mV8fI7WPE8AO5fjMZvYPUowcTgKsGw7G7JKh8N7t/w', '2023-11-28 16:32:52', '2023-11-28 16:32:53'),
(76, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'eim20447@omeie.com', '0344444444', 'http://localhost:3001/uploads\\6c30d1dd4dbfbd046b91a4a8d1cada9f.jpg', 1, '$argon2id$v=19$m=65536,t=3,p=4$Z8XBxyqUqRozbwZK70rTYQ$8/9bZfOpKpeDyYyyKZoUq0oMCNUBGtSboqNwsAqz/Lc', '2023-11-28 16:36:57', '2023-12-19 13:48:16'),
(81, 1, 1, 'Hiệp Nguyễn', '20127496', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuNIayp0x.ulg9eiNytcs98xkfl9Wcy.m', 'nthiep20@clc.fitus.edu.vn', '0977328391', 'http://localhost:3001/uploads/8d28a8c1e217f7b2df1021afc65cc5b24.JPEG', 2, '$argon2id$v=19$m=65536,t=3,p=4$ekMG1XgBDFzYWZSqVJM5rw$zdYQpis7dBlpZC74gZZpoVmAE4KezT7R2abOnuvWRkY', '2023-11-29 16:19:54', '2024-01-02 13:23:20'),
(82, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'test@gmail.com', NULL, NULL, 3, NULL, '2023-12-03 11:19:05', '2023-12-03 11:19:05'),
(83, 1, 1, 'test12', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'test@gmail.com', NULL, NULL, 3, NULL, '2023-12-03 11:19:41', '2023-12-03 11:19:41'),
(86, 1, 1, 'Khoa Teacher', '20127493', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'khoa@gmail.com', '0976147047', 'https://nestjs-webnc-32ea4ac958a0.herokuapp.com/uploads/9958e5ad893a83bed6f8d9ed1f4e4b74.jpg', 2, '$argon2id$v=19$m=65536,t=3,p=4$lJpTYvKxcei1V81uYHlASA$zEjTDENthf3i8+kGJXL8HKxqyarrhAsPRoOzj5crWtU', '2023-12-03 11:29:21', '2024-01-05 02:53:21'),
(87, 1, 1, 'ohn68844@omeie.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Zup6llbM4sC0Imfuyd3OrznalShVwVMf6', 'ohn68844@omeie.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$8KFqyP3vXQp+wu0/1Ydrqw$AFATL0U+b8HdrDIvEzT9+b45fu3WNCSePUMD8HBUY5A', '2023-12-04 15:43:56', '2023-12-04 15:51:54'),
(88, 1, 0, 'tsq08998@nezid.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'tsq08998@nezid.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$hUIOFWzoq+bEEMbDttliAw$mfpfX4/t8wlbsNkbIbGfZxQCiRAgUFjDCKAIKbKiERw', '2023-12-05 16:08:43', '2023-12-05 16:08:44'),
(89, 1, 0, 'dekgfyooysekmbfaia@cazlq.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'dekgfyooysekmbfaia@cazlq.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$2CeRyLodJO7KZyPn13ommg$ybJT0Bpx4VVxGVDOcUqFZte7Cof8mZ7djJqo3BYccvI', '2023-12-05 16:10:04', '2023-12-05 16:10:06'),
(97, 1, 1, 'Phong Trần Nguyên', NULL, '', 'tnphong20@clc.fitus.edu.vn', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJKbVMabJpnA2nSHvnTgKZmctaVAFLsG5nu-vl23u5r=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$bMApC8fceJ5xUO9k0AhH6A$v8aoDpHLU9YMX3+IS5jcs3iS4f8PHWADkCmXHXqYKro', '2023-12-06 08:35:11', '2023-12-06 08:35:12'),
(99, 1, 1, 'PhongTran', '2012759000', '', 'trannguyenphongg@gmail.com', '0827907444', 'https://avatars.githubusercontent.com/u/74850769?v=4', 2, '$argon2id$v=19$m=65536,t=3,p=4$LF3pp0fWJdvH3mCNRlKvjQ$9t4kLUtnyIx0PdJIOPs/2wVjfPPgZOKoAX7X6VNPblA', '2023-12-06 08:39:38', '2024-01-05 05:46:46'),
(100, 1, 1, 'PhongTran', '20127590', '', 'trannguyenphongg@gmail.com', NULL, 'https://avatars.githubusercontent.com/u/74850769?v=4', 1, '$argon2id$v=19$m=65536,t=3,p=4$ZqVAoCxD/y3nKwFHY7ThgQ$Dz7ueSA3PyUJjI1LUlUBfTO9voPlbRp0YbjwARF13p8', '2023-12-06 08:39:38', '2023-12-10 13:59:06'),
(101, 1, 0, 'jpt63825@zslsz.com', NULL, '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'jpt63825@zslsz.com', NULL, NULL, 1, '$argon2id$v=19$m=65536,t=3,p=4$nBX+SsK4uGFqayFL7638TA$Myqc/VUY4Qt5wUMrrleXyIoDA1UYJR463c+rzu1EFMo', '2023-12-06 14:00:21', '2023-12-06 14:00:22'),
(102, 1, 1, 'Đăng Khoa Lê', '20127533', '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3ZuhzDyPYIugW3adt7FVGCIo0f8gM/ZWgu', 'khoale@pixelcent.com', '0344102242', 'https://lh3.googleusercontent.com/a/ACg8ocJExSACg6xhgU0ArV4j_kNMhxy9SnBY6-exeSXQenGBMw=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$uXTh5kw+CryYgW1dGeyaXQ$m31NPy3TGaeYGKZtDIcAy4QrinP33T2ClW89/xObcsA', '2023-12-06 14:02:25', '2024-01-04 19:16:07'),
(105, 1, 1, 'Hiệp Nguyễn Thái', '20127412', '', 'hiepnt@gogojungle.vn', '', 'https://lh3.googleusercontent.com/a/ACg8ocJ2W3vITk0hOjvLSKz0CRPL4vH_j31t0vLILfWB8jnl=s96-c', 1, '$argon2id$v=19$m=65536,t=3,p=4$1Hv7VvdbbvHprvXGrimVEA$7smUgaQMHRt0NvYcVhyYTiGiYSpO/697rsnVuNPWLeA', '2023-12-24 15:33:18', '2023-12-28 16:41:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absent_participants`
--
ALTER TABLE `absent_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_id` (`course_id`,`student_id`);

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
-- Indexes for table `grade_compositions`
--
ALTER TABLE `grade_compositions`
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
-- Indexes for table `request_message`
--
ALTER TABLE `request_message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request_review`
--
ALTER TABLE `request_review`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_scores` (`grade_id`,`student_id`,`teacher_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `role_id` (`role_id`);
ALTER TABLE `users` ADD FULLTEXT KEY `fullname` (`fullname`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absent_participants`
--
ALTER TABLE `absent_participants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `grade_compositions`
--
ALTER TABLE `grade_compositions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `request_message`
--
ALTER TABLE `request_message`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `request_review`
--
ALTER TABLE `request_review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absent_participants`
--
ALTER TABLE `absent_participants`
  ADD CONSTRAINT `absent_participants_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

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
  ADD CONSTRAINT `courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`grade_id`) REFERENCES `grade_compositions` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;
