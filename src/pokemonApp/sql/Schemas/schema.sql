/* ============================================================
   Create the database (rerunnable)
   ============================================================ */
IF DB_ID(N'PokemonDB') IS NULL
BEGIN
    CREATE DATABASE PokemonDB;
END;
GO

USE PokemonDB;
GO

/* ============================================================
   Create schema (rerunnable)
   ============================================================ */
IF SCHEMA_ID(N'pokemon') IS NULL
BEGIN
    EXEC('CREATE SCHEMA pokemon');
END;
GO
