-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 02, 2024 at 12:44 AM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `financiamos`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `usuario` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `permisos` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`usuario`, `pass`, `role`, `permisos`) VALUES
('administrador', 'admin', 'admin', '[\"inicio\", \"registro\", \"pendientes\", \"indicador\", \"clientes\", \"solicitudes\", \"corteCaja\", \"cobranza\", \"gastos\"]'),
('administrador', 'admin', 'cajero-administrador', '[\"inicio\", \"registro\", \"indicador\", \"clientes\", \"solicitudes\", \"movimientos\", \"corteCaja\", \"cobranza\", \"permisos\", \"pendientes\"]'),
('alanalvizo2', '123', 'cajero-administrador', '[\"inicio\", \"pendientes\", \"indicador\", \"registro\", \"clientes\", \"movimientos\", \"corteCaja\", \"cobranza\", \"gastos\"]'),
('administrador', NULL, NULL, '[\"movimientos\"]'),
('administrador', NULL, NULL, '[\"movimientos\"]'),
('alan', 'Alangordo', 'cajero-administrador', '[\"inicio\", \"registro\", \"pendientes\", \"indicador\", \"clientes\", \"solicitudes\", \"movimientos\", \"corteCaja\", \"cobranza\", \"gastos\"]'),
('admin2', 'password', 'ventas-campo', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `caja`
--

CREATE TABLE `caja` (
  `id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `monto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `caja`
--

INSERT INTO `caja` (`id`, `total`, `fecha`, `nombre`, `monto`) VALUES
(13, '9933.00', '29 de julio de 2024', 'Alan esteban Alvizo ortega', '10000'),
(14, '2980.00', '29 de julio de 2024', 'Cecilia Garcia Delgado', '3000'),
(15, '596000.00', '29 de julio de 2024', 'Prueba', '600000'),
(16, '18000.00', '31 de julio de 2024', 'Alan Esteban Alvizo Ortega', '20000');

-- --------------------------------------------------------

--
-- Table structure for table `cobranza`
--

CREATE TABLE `cobranza` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `monto` varchar(255) NOT NULL,
  `dias_atraso` varchar(255) NOT NULL,
  `nota` varchar(255) DEFAULT NULL,
  `fechaPago` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documentos`
--

CREATE TABLE `documentos` (
  `desembolso` varchar(255) DEFAULT NULL,
  `formato_referencias` varchar(255) DEFAULT NULL,
  `pagare` varchar(255) DEFAULT NULL,
  `referenciaFamilia` varchar(255) DEFAULT NULL,
  `referencia_laboral` varchar(255) DEFAULT NULL,
  `servicios` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `documentos`
--

INSERT INTO `documentos` (`desembolso`, `formato_referencias`, `pagare`, `referenciaFamilia`, `referencia_laboral`, `servicios`, `nombre`) VALUES
('reno.png', 'reno.png', 'images.jpeg', '840dcb30b524c255e53f51900b31f514.webp', '840dcb30b524c255e53f51900b31f514.webp', 'reno.png', 'Alan Esteban Alvizo Ortega'),
('reno.png', 'reno.png', 'reno.png', 'images.jpeg', 'images.jpeg', 'reno.png', 'Cecilia Garcia Delgado'),
('reno.png', 'reno.png', 'images.jpeg', '840dcb30b524c255e53f51900b31f514.webp', '840dcb30b524c255e53f51900b31f514.webp', 'reno.png', 'Prueba');

-- --------------------------------------------------------

--
-- Table structure for table `gastos`
--

CREATE TABLE `gastos` (
  `nombre` varchar(255) DEFAULT NULL,
  `monto` varchar(255) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gastos`
--

INSERT INTO `gastos` (`nombre`, `monto`, `fecha`) VALUES
('Gasolina Calle', '10', '31 de julio de 2024'),
('Nomina', '1000', '31 de julio de 2024');

-- --------------------------------------------------------

--
-- Table structure for table `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `abono` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `saldo` int(11) DEFAULT NULL,
  `abonoCapital` varchar(255) DEFAULT NULL,
  `interes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `movimientos`
--

INSERT INTO `movimientos` (`id`, `nombre`, `abono`, `fecha_pago`, `created_at`, `saldo`, `abonoCapital`, `interes`) VALUES
(112, 'Alan esteban Alvizo ortega', '0.00', '2024-07-29', '2024-07-29 21:53:11', 10926, '-993', '993'),
(113, 'Cecilia Garcia Delgado', '0.00', '2024-07-29', '2024-07-29 22:18:48', 3278, '-298', '298'),
(114, 'Alan esteban Alvizo ortega', '0.00', '2024-07-29', '2024-07-30 01:17:23', 12019, '-1093', '1093'),
(115, 'Alan esteban Alvizo ortega', '0.00', '2024-07-31', '2024-07-31 22:33:49', 13221, '-1202', '1202'),
(116, 'Prueba', '0.00', '2024-07-31', '2024-07-31 22:35:29', 655600, '-59600', '59600'),
(117, 'Alan Esteban Alvizo Ortega', '0.00', '2024-07-31', '2024-07-31 22:56:15', 19800, '-1800', '1800');

-- --------------------------------------------------------

--
-- Table structure for table `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamo` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `monto` varchar(255) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `abono` varchar(255) DEFAULT NULL,
  `fechaAbono` date DEFAULT NULL,
  `fechaPago` date DEFAULT NULL,
  `frecuenciaPago` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fechaAbonoPago` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prestamos`
--

INSERT INTO `prestamos` (`id_prestamo`, `nombre`, `monto`, `fechaInicio`, `abono`, `fechaAbono`, `fechaPago`, `frecuenciaPago`, `fechaAbonoPago`) VALUES
(94, 'Alan esteban Alvizo ortega', '19800', '2024-07-31', NULL, NULL, '2024-08-15', 'Quincenal', NULL),
(95, 'Cecilia Garcia Delgado', '3278', '2024-07-29', NULL, NULL, '2024-08-15', 'Quincenal', NULL),
(96, 'Prueba', '655600', '2024-07-31', NULL, NULL, '2024-08-15', 'Quincenal', NULL),
(97, 'Alan Esteban Alvizo Ortega', '19800', '2024-07-31', NULL, NULL, '2024-08-15', 'Quincenal', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `nombre` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `cumple` varchar(255) DEFAULT NULL,
  `colonia` varchar(255) DEFAULT NULL,
  `puesto` varchar(500) DEFAULT NULL,
  `empresa` varchar(500) DEFAULT NULL,
  `antiguedad` varchar(500) DEFAULT NULL,
  `sueldo_in` varchar(500) DEFAULT NULL,
  `sueldo_final` varchar(500) DEFAULT NULL,
  `identificacion` varchar(255) DEFAULT NULL,
  `monto` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `fechaInicio` varchar(255) DEFAULT NULL,
  `frecuenciaPago` varchar(255) DEFAULT NULL,
  `plazo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `carta_laboral` varchar(255) DEFAULT NULL,
  `redes_sociales` varchar(255) DEFAULT NULL,
  `referencia` json DEFAULT NULL,
  `referencia_dom` json DEFAULT NULL,
  `referencia_cel` json DEFAULT NULL,
  `cedula` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`nombre`, `direccion`, `telefono`, `cumple`, `colonia`, `puesto`, `empresa`, `antiguedad`, `sueldo_in`, `sueldo_final`, `identificacion`, `monto`, `id`, `fechaInicio`, `frecuenciaPago`, `plazo`, `estado`, `carta_laboral`, `redes_sociales`, `referencia`, `referencia_dom`, `referencia_cel`, `cedula`) VALUES
('Alan Esteban Alvizo Ortega', 'Vallarta, Rosario', '3332566577', NULL, 'arandas', 'politubo', 'politubo', 'politubi', '5000', '5000', NULL, '20000', 41, '31 de julio de 2024', 'Quincenal', '6 meses', 'Aprobado', 'images.jpeg', NULL, '[\"cecilia garcia\"]', '[\"vallarta 530\"]', '[\"11111111\"]', '840dcb30b524c255e53f51900b31f514.webp'),
('Cecilia Garcia Delgado', 'Vallarta, Rosario', '3332566577', NULL, 'arandas', 'politubo', 'politubo', 'politubi', '5000', '5000', NULL, '20000', 42, '1 de agosto de 2024', 'Quincenal', '6 meses', 'Aprobado', 'images.jpeg', NULL, '[\"sas\"]', '[\"sas\"]', '[\"22222\"]', '840dcb30b524c255e53f51900b31f514.webp'),
('Prueba', 'Vallarta, Rosario', '3332566577', NULL, 'arandas', 'politubo', 'politubo', 'politubi', '5000', '5000', NULL, '6000', 43, '31 de julio de 2024', 'Quincenal', '6 meses', 'Rechazado', 'images.jpeg', NULL, '[\"cecilia garcia\", \"alan alvizo\"]', '[\"vallarta 530\", \"alanalavizo\"]', '[\"11111111\", \"asaodfaksa\"]', '840dcb30b524c255e53f51900b31f514.webp');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cobranza`
--
ALTER TABLE `cobranza`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamo`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `caja`
--
ALTER TABLE `caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id_prestamo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
