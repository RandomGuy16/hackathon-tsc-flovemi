# Caso de negocio — MineraWatch

## Contexto del reto

**Evento:** Torneo de Vibecoding PUCP — 26 de junio de 2026
**Temática:** Estado Peruano — transparencia y acceso a datos públicos

---

## Problema

El Perú tiene más de 800 empresas mineras activas y el **47% de sus proyectos generan conflictos sociales activos**. Sin embargo, la información que el Estado publica sobre estas empresas está dispersa en múltiples portales (MINEM, OEFA, OSCE, SUNAT, PCM) que no están conectados entre sí.

Esto significa que:

- Una comunidad afectada **no puede saber fácilmente** si la minera de su zona fue sancionada, tuvo accidentes mortales o tiene deudas con el Estado.
- Un periodista que investiga minería informal **necesita horas** para cruzar datos de distintas fuentes oficiales.
- Un fiscalizador **no tiene una vista rápida** del historial de una empresa antes de una inspección.

---

## Solución propuesta

**MineraWatch** es un panel web ciudadano que, dado el nombre o RUC de una empresa minera, entrega en segundos una **ficha de riesgo** con cinco dimensiones:

| Dimensión | Qué muestra | Fuente |
|---|---|---|
| Seguridad | Accidentes mortales y enfermedades ocupacionales | MINEM |
| Medio ambiente | Sanciones ambientales firmes | OEFA vía latinfo.dev |
| Legal / Fiscal | Multas OSCE, penalidades, deuda coactiva SUNAT | latinfo.dev |
| Conflicto social | Conflictos activos en la zona | PCM / PNDA |
| Inversión pública | Obras públicas y presupuesto ejecutado | INFOBRAS / MEF |

La ficha incluye un **score de riesgo 0–100** que resume el nivel de alerta en lenguaje ciudadano (BAJO / MEDIO / ALTO).

---

## Usuarios

| Usuario | Problema concreto que resuelve MineraWatch |
|---|---|
| Ciudadano / Comunidad | Saber si la minera de su zona tiene historial de daño antes de organizarse |
| Periodista / ONG | Investigar minería informal o impacto social sin revisar 5 portales distintos |
| Fiscalizador | Tener un resumen de antecedentes de una empresa en segundos |

---

## Diferenciación

| Herramienta existente | Limitación | Cómo MineraWatch la supera |
|---|---|---|
| Convoca Deep Data | Solo hasta 2022, no tiempo real | Consulta APIs en vivo |
| OCM conflictosmineros.org.pe | Solo conflictos, sin datos legales ni salud | Cruza 5 fuentes en una sola ficha |
| EITI Perú | Muy técnico, no interactivo | Lenguaje ciudadano + score de riesgo |
| latinfo.dev | Due diligence empresarial sin foco minero | Ficha específica para sector minero |

---

## Impacto esperado

- Empoderar a comunidades con información veraz y accesible sobre empresas mineras.
- Reducir el tiempo de investigación periodística de horas a segundos.
- Facilitar la fiscalización preventiva con datos cruzados del Estado.
