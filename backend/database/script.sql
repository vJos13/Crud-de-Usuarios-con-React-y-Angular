-- Script de creación de la base de datos para el CRUD de usuarios
IF DB_ID('miapp_sql') IS NULL
  CREATE DATABASE miapp_sql;
GO

USE miapp_sql;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE dbo.Users (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  name       NVARCHAR(100) NOT NULL,
  email      NVARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Si la tabla ya existía sin la columna created_at, se agrega
IF COL_LENGTH('dbo.Users', 'created_at') IS NULL
  ALTER TABLE dbo.Users
    ADD created_at DATETIME2 NOT NULL CONSTRAINT DF_Users_created_at DEFAULT SYSDATETIME();
GO

-- Datos de ejemplo
IF NOT EXISTS (SELECT 1 FROM dbo.Users)
INSERT INTO dbo.Users (name, email) VALUES
  (N'Ana Torres',  'ana.torres@example.com'),
  (N'Luis Pérez',  'luis.perez@example.com'),
  (N'María Gómez', 'maria.gomez@example.com');
GO
