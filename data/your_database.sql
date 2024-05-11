-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql-db
-- Généré le : ven. 10 mai 2024 à 17:11
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `your_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `affectation`
--

CREATE TABLE `affectation` (
  `id` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `jobId` int DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  `coordinatorId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `email`, `password`, `balance`, `createdAt`) VALUES
(5, 'GiornoTheWitch@gmail.com', '$2b$10$mdGtDDM.bsId8X3UGjE0Qe.6vu5AjFDr6SlUtBPC0SaCPDb2Ryf1m', 0, '2024-04-11 18:50:06.009371'),
(6, 'Cosmoetvand@gmail.com', '$2b$10$jXzO.8wCU.uHef9wkiaQiOp3c4z784Ehz0UAYA.B62aAbT4XaC2jC', 0, '2024-04-11 18:52:40.035002'),
(7, 'PookPoook@gmail.com', '$2b$10$sar427hC8XmdMargAsQ5Euwmh.uw6FCcXeAnAJo.XI0pmzG64bNEa', 0, '2024-04-11 18:54:08.704116'),
(9, 'Cosmodnasvand@gmail.com', '$2b$10$6JikPRywLLy.uZBiA/FC3eOJEGOpz/z6HXwXqffw0ehKGGQPsds1y', 0, '2024-04-11 19:22:05.304942'),
(10, 'dreideryRoman@gmail.com', '$2b$10$CG7zMuBxBr2OqMaEVHuE4uEEX8znaq1oC9.4YEMk2gEj3LIqH0W3m', 0, '2024-04-11 19:44:54.346804'),
(11, 'Golmon2D@gmail.com', '$2b$10$l5Jg5TZRnJSLp7DoD/biZOh.BCZZWxWu4qQ9rtJRlU/zqAuZg7Zne', 0, '2024-04-12 01:10:39.020055');

-- --------------------------------------------------------

--
-- Structure de la table `coordinator`
--

CREATE TABLE `coordinator` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `roleId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `coordinator`
--

INSERT INTO `coordinator` (`id`, `email`, `password`, `createdAt`, `roleId`) VALUES
(1, 'GangnoukBradleyp@gmail.com', '$2b$10$WTvoeHh2KID49QFz7Yw15uKhIuFGsgzJI7cMJXZexL/tCn77d6o3y', '2024-04-11 19:49:20.744494', 2),
(2, 'MathisUri@gmail.com', '$2b$10$xItWJMo4L2PQGlRtiX50Fu9uFsAZspZTotaKBbGRFZHZD888wPpxe', '2024-04-11 19:49:42.197515', 1),
(3, 'MomUUmoM@gmail.com', '$2b$10$T5xkYDGOKedbki6HJCQrq.eRJHYtBaHWT4r0hQgZpSUa1E9p5kefK', '2024-04-12 01:09:06.504315', 1),
(27, 'Yondaime@gmail.com', '$2b$10$ar9sXJhusEy2W2RkmQ2fH.m3x53jv1W0aI6jXw9i..ZRnshQWpNyq', '2024-04-12 15:40:36.092107', 2);

-- --------------------------------------------------------

--
-- Structure de la table `employee`
--

CREATE TABLE `employee` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job`
--

CREATE TABLE `job` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

CREATE TABLE `movie` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `coordinatorId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `movie`
--

INSERT INTO `movie` (`id`, `name`, `duration`, `createdAt`, `coordinatorId`) VALUES
(1, 'Moshx', 60, '2024-04-11 22:58:25.205125', 1),
(2, 'Thanos the CEO', 60, '2024-04-11 23:24:47.381209', 1),
(3, 'Le corps aux trois problemes', 60, '2024-04-11 23:25:04.722226', 1),
(4, 'Moi,Beau et Zem-muhr ', 60, '2024-04-11 23:26:01.562471', 1),
(19, 'Doctor Goofy', 60, '2024-04-12 00:30:51.461053', 3),
(20, 'Doctor Gool', 60, '2024-04-12 00:31:23.642742', 1),
(21, 'Andy', 60, '2024-04-12 00:33:59.093108', 1),
(22, 'Crenshaw', 60, '2024-04-12 00:34:57.991490', 1),
(23, 'Cran the dull', 60, '2024-04-12 01:03:14.524296', 1),
(24, 'Grvwwi', 60, '2024-04-13 15:21:40.809625', 1),
(25, 'Salwii', 60, '2024-04-13 15:29:57.270550', 1);

-- --------------------------------------------------------

--
-- Structure de la table `occupation`
--

CREATE TABLE `occupation` (
  `id` int NOT NULL,
  `roomId` int DEFAULT NULL,
  `seatId` int DEFAULT NULL,
  `starting` datetime NOT NULL,
  `ending` datetime NOT NULL,
  `ticketId` int DEFAULT NULL,
  `seanceId` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `occupation`
--

INSERT INTO `occupation` (`id`, `roomId`, `seatId`, `starting`, `ending`, `ticketId`, `seanceId`, `createdAt`) VALUES
(2, 14, 37, '2024-04-13 17:55:27', '2024-04-13 19:25:27', 4, 18, '2024-05-10 12:31:21.249922'),
(3, 14, 38, '2024-04-13 17:55:27', '2024-04-13 19:25:27', 5, 18, '2024-05-10 12:31:21.249922'),
(4, 14, 39, '2024-04-13 17:55:27', '2024-04-13 19:25:27', 6, 18, '2024-05-10 12:31:21.249922'),
(5, 14, 40, '2024-04-13 17:55:27', '2024-04-13 19:25:27', 7, 18, '2024-05-10 12:31:21.249922'),
(6, 14, 42, '2024-04-13 17:55:27', '2024-04-13 19:25:27', 8, 18, '2024-05-10 12:31:21.249922');

-- --------------------------------------------------------

--
-- Structure de la table `picture`
--

CREATE TABLE `picture` (
  `id` int NOT NULL,
  `loc` varchar(255) NOT NULL,
  `roomId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`, `createdAt`) VALUES
(1, 'admin', '2024-04-11 00:00:00.000000'),
(2, 'superAdmin', '2024-04-11 00:00:00.000000');

-- --------------------------------------------------------

--
-- Structure de la table `room`
--

CREATE TABLE `room` (
  `id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `state` tinyint NOT NULL,
  `name` varchar(255) NOT NULL,
  `capacity` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `accessibility` tinyint NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `room`
--

INSERT INTO `room` (`id`, `type`, `state`, `name`, `capacity`, `description`, `accessibility`, `createdAt`) VALUES
(1, 'BigOne', 1, 'Neon', 30, 'Grande salle', 1, '2024-04-12 01:38:27.167589'),
(6, 'SmallOne', 1, 'Namur', 15, 'P\'tite salle', 1, '2024-04-12 12:08:56.762786'),
(8, 'SmallOne', 1, 'WhoDatBoy', 15, 'P\'tite salle', 1, '2024-04-12 12:09:20.876597'),
(9, 'SmallOne', 1, 'Asclepios', 15, 'P\'tite salle', 1, '2024-04-12 12:12:04.507087'),
(10, 'SmallOne', 1, 'Krest', 25, 'P\'tite salle', 1, '2024-04-12 12:12:20.260673'),
(12, 'SmallOne', 1, 'Pucci', 25, 'P\'tite salle', 1, '2024-04-12 12:12:54.377250'),
(13, 'SmallOne', 1, 'SteelBallRun', 25, 'P\'tite salle', 1, '2024-04-12 12:13:20.552967'),
(14, 'SmallOne', 1, 'StardustCru', 20, 'P\'tite salle', 1, '2024-04-12 12:13:41.484548'),
(15, 'SmallOne', 1, 'Griffith', 20, 'P\'tite salle', 1, '2024-04-12 12:13:56.902869'),
(16, 'SmallOne', 1, 'Beherit', 20, 'P\'tite salle', 1, '2024-04-12 12:14:07.479907'),
(17, 'SmallOne', 1, 'Casca', 20, 'P\'tite salle', 1, '2024-04-12 12:15:57.775787'),
(18, 'SmallOne', 1, 'Gattttsuu', 20, 'P\'tite salle', 1, '2024-04-12 12:16:08.166366'),
(19, 'SmallOne', 1, 'Shinonome', 20, 'P\'tite salle', 1, '2024-04-12 12:16:22.196327'),
(20, 'SmallOne', 1, 'Corso D Blanket', 20, 'P\'tite salle', 1, '2024-04-12 12:16:56.951839'),
(21, 'SmallOne', 1, 'IASTM', 20, 'P\'tite salle', 1, '2024-04-12 12:17:13.604742'),
(22, 'SmallOne', 1, 'IASTM', 20, 'P\'tite salle', 1, '2024-04-13 15:19:10.832685');

-- --------------------------------------------------------

--
-- Structure de la table `room_coordinator_coordinator`
--

CREATE TABLE `room_coordinator_coordinator` (
  `roomId` int NOT NULL,
  `coordinatorId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `room_coordinator_coordinator`
--

INSERT INTO `room_coordinator_coordinator` (`roomId`, `coordinatorId`) VALUES
(12, 2);

-- --------------------------------------------------------

--
-- Structure de la table `seance`
--

CREATE TABLE `seance` (
  `id` int NOT NULL,
  `starting` datetime NOT NULL,
  `ending` datetime NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `coordinatorId` int DEFAULT NULL,
  `roomId` int DEFAULT NULL,
  `movieId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `seance`
--

INSERT INTO `seance` (`id`, `starting`, `ending`, `createdAt`, `coordinatorId`, `roomId`, `movieId`) VALUES
(18, '2024-04-13 17:55:27', '2024-04-13 19:25:27', '2024-04-13 15:49:44.517030', 2, 14, 25),
(19, '2024-04-13 19:55:27', '2024-04-13 21:25:27', '2024-04-13 16:20:06.796849', 2, 14, 25),
(20, '2024-04-13 19:55:27', '2024-04-13 21:25:27', '2024-04-13 16:22:30.478501', 2, 14, 24),
(21, '2024-04-13 19:55:27', '2024-04-13 21:25:27', '2024-04-13 16:22:40.594369', 2, 14, 23),
(22, '2024-04-13 19:55:27', '2024-04-13 21:25:27', '2024-04-13 16:22:45.370052', 2, 14, 22),
(23, '2024-04-14 19:55:27', '2024-04-14 21:25:27', '2024-04-13 16:23:09.582254', 2, 14, 22),
(24, '2024-04-14 10:55:27', '2024-04-14 12:25:27', '2024-04-13 16:23:35.151947', 2, 12, 22);

-- --------------------------------------------------------

--
-- Structure de la table `seance_ticket_ticket`
--

CREATE TABLE `seance_ticket_ticket` (
  `seanceId` int NOT NULL,
  `ticketId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `seat`
--

CREATE TABLE `seat` (
  `id` int NOT NULL,
  `type` enum('REGULAR','PREMIUM','VIP') NOT NULL,
  `roomId` int DEFAULT NULL,
  `position` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `seat`
--

INSERT INTO `seat` (`id`, `type`, `roomId`, `position`) VALUES
(90, 'VIP', 14, 'A2'),
(91, 'VIP', 14, 'A3'),
(92, 'VIP', 14, 'A4'),
(93, 'VIP', 14, 'A5'),
(94, 'VIP', 14, 'B1'),
(95, 'VIP', 14, 'B2'),
(96, 'VIP', 14, 'B3'),
(97, 'VIP', 14, 'B4'),
(98, 'VIP', 14, 'B5'),
(99, 'VIP', 14, 'C1'),
(100, 'VIP', 14, 'C2'),
(101, 'VIP', 14, 'C3'),
(102, 'VIP', 14, 'C4'),
(103, 'VIP', 14, 'C5'),
(104, 'VIP', 14, 'D1'),
(105, 'VIP', 14, 'D2'),
(106, 'VIP', 14, 'D3'),
(107, 'VIP', 14, 'D4'),
(108, 'VIP', 14, 'D5'),
(109, 'VIP', 14, 'E1');

-- --------------------------------------------------------

--
-- Structure de la table `seat_ticket_ticket`
--

CREATE TABLE `seat_ticket_ticket` (
  `seatId` int NOT NULL,
  `ticketId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ticket`
--

CREATE TABLE `ticket` (
  `id` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isValid` tinyint NOT NULL DEFAULT '1',
  `type` enum('NORMAL','SUPER') NOT NULL,
  `clientId` int DEFAULT NULL,
  `seatId` int DEFAULT NULL,
  `roomId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ticket`
--

INSERT INTO `ticket` (`id`, `createdAt`, `isValid`, `type`, `clientId`, `seatId`, `roomId`) VALUES
(4, '2024-05-10 12:12:22.992831', 1, 'SUPER', 11, 37, 14),
(5, '2024-05-10 12:16:23.132979', 1, 'SUPER', 11, 38, 14),
(6, '2024-05-10 12:16:32.164692', 1, 'SUPER', 11, 39, 14),
(7, '2024-05-10 12:16:38.105189', 1, 'SUPER', 11, 40, 14),
(8, '2024-05-10 12:16:50.574918', 1, 'SUPER', 11, 42, 14);

-- --------------------------------------------------------

--
-- Structure de la table `ticket_seance_seance`
--

CREATE TABLE `ticket_seance_seance` (
  `ticketId` int NOT NULL,
  `seanceId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `token`
--

CREATE TABLE `token` (
  `id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `coordinatorId` int DEFAULT NULL,
  `clientId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `token`
--

INSERT INTO `token` (`id`, `token`, `coordinatorId`, `clientId`) VALUES
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MSwiZW1haWwiOiJHYW5nbm91a0JyYWRsZXlwQGdtYWlsLmNvbSIsImlhdCI6MTcxMjg3NTgwOSwiZXhwIjoxNzEyOTYyMjA5fQ.pTKFyCC-6GZWyA4zdilw8-Rv0JLGRulsL7GV9CA3D6Q', 1, NULL),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MiwiZW1haWwiOiJNYXRoaXNVcmlAZ21haWwuY29tIiwiaWF0IjoxNzEyODg0MDI1LCJleHAiOjE3MTI5NzA0MjV9.Q-IhKFa-vKJetuY1901XNZqjdIs7gNeF_iFS_vcGvcU', 2, NULL),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MTEsImVtYWlsIjoiR29sbW9uMkRAZ21haWwuY29tIiwiaWF0IjoxNzEyODg0MjkxLCJleHAiOjE3MTI5NzA2OTF9.94-DIobaB8CopRv0hKOUdtRyETTLiQW41O39v_WP4jc', NULL, 11),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MiwiZW1haWwiOiJNYXRoaXNVcmlAZ21haWwuY29tIiwiaWF0IjoxNzEyOTIxOTQ3LCJleHAiOjE3MTMwMDgzNDd9.5576-v2ZCaKMWycRGoIzNJWklfLrEzhGrr85fE9VPbo', 2, NULL),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MiwiZW1haWwiOiJNYXRoaXNVcmlAZ21haWwuY29tIiwiaWF0IjoxNzEzMDE2MzU4LCJleHAiOjE3MTMxMDI3NTh9.q0g7-brH_OGCzjeU-xLMrLQvit4ulkYj1qlrpBTbUPI', 2, NULL),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MTEsImVtYWlsIjoiR29sbW9uMkRAZ21haWwuY29tIiwiaWF0IjoxNzE1MjgzNDcwLCJleHAiOjE3MTUzNjk4NzB9.h1e4wiKIKljYN_48L41Ure477-KvC0CAmoAdWC9arN4', NULL, 11),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MTEsImVtYWlsIjoiR29sbW9uMkRAZ21haWwuY29tIiwiaWF0IjoxNzE1Mjg1OTI0LCJleHAiOjE3MTUzNzIzMjR9.3enmd5izojnrZTScjZPf2v0h1sNGwsKygz3mXLbDf6c', NULL, 11),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MiwiZW1haWwiOiJNYXRoaXNVcmlAZ21haWwuY29tIiwiaWF0IjoxNzE1MzU1NzgzLCJleHAiOjE3MTU0NDIxODN9.ZR0mdjKkJoIoANtn4oTwDJ-dJXAD5cxyFIa7nFVBYzE', 2, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9202c8881b7d85c3c1d4e4e8c21` (`jobId`),
  ADD KEY `FK_6274c872fd35372377a2f096514` (`employeeId`),
  ADD KEY `FK_56cb445b74f12f766a58c94ca9c` (`coordinatorId`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6436cc6b79593760b9ef921ef1` (`email`);

--
-- Index pour la table `coordinator`
--
ALTER TABLE `coordinator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_c2be39cf0d218ce0793e0a9845` (`email`),
  ADD KEY `FK_f3d954c22638dbdd766b99052b3` (`roleId`);

--
-- Index pour la table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b2f8254966c91659c81d0632841` (`coordinatorId`);

--
-- Index pour la table `occupation`
--
ALTER TABLE `occupation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_968d63f3f5785f1b18cf12f9b27` (`ticketId`),
  ADD KEY `FK_cf7bdad17646945559c8be3c9b8` (`seanceId`);

--
-- Index pour la table `picture`
--
ALTER TABLE `picture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_be800b0e57489ef4a894f51f159` (`roomId`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `room_coordinator_coordinator`
--
ALTER TABLE `room_coordinator_coordinator`
  ADD PRIMARY KEY (`roomId`,`coordinatorId`),
  ADD KEY `IDX_5b008eb0f0060dfecb12f4aa06` (`roomId`),
  ADD KEY `IDX_e74918c7d77b351849c88e634a` (`coordinatorId`);

--
-- Index pour la table `seance`
--
ALTER TABLE `seance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9499271b92a7bfadeb62e8ebc6a` (`coordinatorId`),
  ADD KEY `FK_c9e65f2a9a6ad0bb20cc15a3229` (`roomId`),
  ADD KEY `FK_40d201750836bb4a282bfd7435f` (`movieId`);

--
-- Index pour la table `seance_ticket_ticket`
--
ALTER TABLE `seance_ticket_ticket`
  ADD PRIMARY KEY (`seanceId`,`ticketId`),
  ADD KEY `IDX_80a6aa5e486744f72b5ce0759e` (`seanceId`),
  ADD KEY `IDX_b91f4e630dd4a11c62576ed812` (`ticketId`);

--
-- Index pour la table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3fa8f0e8b51be149c90ee8595e6` (`roomId`);

--
-- Index pour la table `seat_ticket_ticket`
--
ALTER TABLE `seat_ticket_ticket`
  ADD PRIMARY KEY (`seatId`,`ticketId`),
  ADD KEY `IDX_fb98a727ec3c755c1b7a23a7d7` (`seatId`),
  ADD KEY `IDX_a2fa66e3b1f227086851b44c0c` (`ticketId`);

--
-- Index pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9415159cddf283b7e44be899be8` (`clientId`);

--
-- Index pour la table `ticket_seance_seance`
--
ALTER TABLE `ticket_seance_seance`
  ADD PRIMARY KEY (`ticketId`,`seanceId`),
  ADD KEY `IDX_bf5c880956bf79557b7b62597d` (`ticketId`),
  ADD KEY `IDX_8554c2d72d86e76aa72149c157` (`seanceId`);

--
-- Index pour la table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_10f3e1cf124f8e2d436c8c08718` (`coordinatorId`),
  ADD KEY `FK_8139f8b076cfd8723e992c9d9ff` (`clientId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `affectation`
--
ALTER TABLE `affectation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `coordinator`
--
ALTER TABLE `coordinator`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `job`
--
ALTER TABLE `job`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `occupation`
--
ALTER TABLE `occupation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `picture`
--
ALTER TABLE `picture`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `room`
--
ALTER TABLE `room`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `seance`
--
ALTER TABLE `seance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `seat`
--
ALTER TABLE `seat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT pour la table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `token`
--
ALTER TABLE `token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD CONSTRAINT `FK_56cb445b74f12f766a58c94ca9c` FOREIGN KEY (`coordinatorId`) REFERENCES `coordinator` (`id`),
  ADD CONSTRAINT `FK_6274c872fd35372377a2f096514` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `FK_9202c8881b7d85c3c1d4e4e8c21` FOREIGN KEY (`jobId`) REFERENCES `job` (`id`);

--
-- Contraintes pour la table `coordinator`
--
ALTER TABLE `coordinator`
  ADD CONSTRAINT `FK_f3d954c22638dbdd766b99052b3` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`);

--
-- Contraintes pour la table `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `FK_b2f8254966c91659c81d0632841` FOREIGN KEY (`coordinatorId`) REFERENCES `coordinator` (`id`);

--
-- Contraintes pour la table `occupation`
--
ALTER TABLE `occupation`
  ADD CONSTRAINT `FK_968d63f3f5785f1b18cf12f9b27` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`),
  ADD CONSTRAINT `FK_cf7bdad17646945559c8be3c9b8` FOREIGN KEY (`seanceId`) REFERENCES `seance` (`id`);

--
-- Contraintes pour la table `picture`
--
ALTER TABLE `picture`
  ADD CONSTRAINT `FK_be800b0e57489ef4a894f51f159` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`);

--
-- Contraintes pour la table `room_coordinator_coordinator`
--
ALTER TABLE `room_coordinator_coordinator`
  ADD CONSTRAINT `FK_5b008eb0f0060dfecb12f4aa06f` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_e74918c7d77b351849c88e634aa` FOREIGN KEY (`coordinatorId`) REFERENCES `coordinator` (`id`);

--
-- Contraintes pour la table `seance`
--
ALTER TABLE `seance`
  ADD CONSTRAINT `FK_40d201750836bb4a282bfd7435f` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`),
  ADD CONSTRAINT `FK_9499271b92a7bfadeb62e8ebc6a` FOREIGN KEY (`coordinatorId`) REFERENCES `coordinator` (`id`),
  ADD CONSTRAINT `FK_c9e65f2a9a6ad0bb20cc15a3229` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`);

--
-- Contraintes pour la table `seance_ticket_ticket`
--
ALTER TABLE `seance_ticket_ticket`
  ADD CONSTRAINT `FK_80a6aa5e486744f72b5ce0759e2` FOREIGN KEY (`seanceId`) REFERENCES `seance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_b91f4e630dd4a11c62576ed8121` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`);

--
-- Contraintes pour la table `seat`
--
ALTER TABLE `seat`
  ADD CONSTRAINT `FK_3fa8f0e8b51be149c90ee8595e6` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`);

--
-- Contraintes pour la table `seat_ticket_ticket`
--
ALTER TABLE `seat_ticket_ticket`
  ADD CONSTRAINT `FK_a2fa66e3b1f227086851b44c0c0` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`),
  ADD CONSTRAINT `FK_fb98a727ec3c755c1b7a23a7d77` FOREIGN KEY (`seatId`) REFERENCES `seat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_9415159cddf283b7e44be899be8` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`);

--
-- Contraintes pour la table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_10f3e1cf124f8e2d436c8c08718` FOREIGN KEY (`coordinatorId`) REFERENCES `coordinator` (`id`),
  ADD CONSTRAINT `FK_8139f8b076cfd8723e992c9d9ff` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
