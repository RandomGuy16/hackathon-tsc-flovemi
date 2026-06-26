# Contrato de API — MineraWatch

> Versión: Sprint 0  
> Estado: borrador para validación del equipo  
> Regla: este contrato no cambia sin avisar a los 3 integrantes.

## Convenciones

- Todos los endpoints devuelven JSON.
- Las fechas usan ISO 8601 en UTC (ej. `2026-06-26T10:00:00Z`).
- Los números de RUC son cadenas de 11 dígitos (`20100047218`).
- Campos opciones se marcan explícitamente como `(opcional)`.

---

## 1. `GET /api/companies?search={name}`

Busca empresas mineras por nombre comercial, razón social o RUC.

### Request

| Parámetro | Tipo   | Descripción                          |
| --------- | ------ | ------------------------------------ |
| `search`  | string | Texto de búsqueda (mínimo 3 chars).  |

### Response 200

```json
{
  "data": [
    {
      "ruc": "20100047218",
      "razonSocial": "MINERA LOS QUENUALES S.A.",
      "region": "La Libertad",
      "province": "Viru",
      "district": "Viru"
    }
  ]
}
```

### Errores

| Código | Cuándo ocurre                                 |
| ------ | --------------------------------------------- |
| 400    | `search` ausente o menor a 3 caracteres.      |
| 500    | Error interno al consultar fuentes de datos.  |

---

## 2. `GET /api/companies/[ruc]/dashboard`

Devuelve la ficha de riesgo completa de una empresa minera.

### Request

| Parámetro | Tipo   | Descripción                  |
| --------- | ------ | ---------------------------- |
| `ruc`     | string | RUC de 11 dígitos (path).    |

### Response 200

```json
{
  "ruc": "20100047218",
  "razonSocial": "MINERA LOS QUENUALES S.A.",
  "summary": {
    "riskLevel": "ALTO",
    "riskScore": 70,
    "lastSyncedAt": "2026-06-26T10:00:00Z"
  },
  "safety": {
    "fatalAccidents": 3,
    "occupationalDiseases": 12,
    "source": "MINEM"
  },
  "environmental": {
    "sanctionsCount": 2,
    "sanctions": [
      {
        "authority": "OEFA",
        "date": "2024-03-15",
        "description": "Incumplimiento de norma ambiental",
        "amount": 15000
      }
    ],
    "airQuality": [
      {
        "stationName": "Estación Virú",
        "year": 2024,
        "parameter": "PM2.5",
        "value": 35.5,
        "unit": "µg/m³"
      }
    ]
  },
  "legal": {
    "osceSanctions": [],
    "osceFines": [],
    "tenders": []
  },
  "social": {
    "activeConflicts": 1,
    "conflicts": [
      {
        "region": "La Libertad",
        "province": "Viru",
        "district": "Viru",
        "description": "Conflicto por uso de agua",
        "status": "activo",
        "reportedAt": "2025-01-20"
      }
    ]
  },
  "investment": {
    "publicProjects": [
      {
        "name": "Mejoramiento vial Virú",
        "budget": 5000000,
        "physicalProgress": 0.35,
        "executor": "Municipalidad Provincial de Virú"
      }
    ],
    "totalBudget": 5000000
  }
}
```

### Errores

| Código | Cuándo ocurre                                 |
| ------ | --------------------------------------------- |
| 400    | RUC con formato inválido.                     |
| 404    | Empresa no encontrada.                        |
| 500    | Error interno al consultar fuentes de datos.  |

---

## 3. `GET /api/regions/[region]`

Devuelve un resumen territorial para mostrar en el mapa y rankings.

### Request

| Parámetro | Tipo   | Descripción                              |
| --------- | ------ | ---------------------------------------- |
| `region`  | string | Nombre de la región, ej. `La Libertad`.  |

### Response 200

```json
{
  "region": "La Libertad",
  "companies": [
    {
      "ruc": "20100047218",
      "razonSocial": "MINERA LOS QUENUALES S.A.",
      "latitude": -8.641,
      "longitude": -78.748,
      "riskLevel": "ALTO"
    }
  ],
  "conflicts": [
    {
      "description": "Conflicto por uso de agua",
      "latitude": -8.641,
      "longitude": -78.748,
      "status": "activo"
    }
  ],
  "projects": [
    {
      "name": "Mejoramiento vial Virú",
      "budget": 5000000,
      "latitude": -8.641,
      "longitude": -78.748
    }
  ]
}
```

### Errores

| Código | Cuándo ocurre                                 |
| ------ | --------------------------------------------- |
| 404    | Región sin datos registrados.                 |
| 500    | Error interno al consultar fuentes de datos.  |

---

## Notas para el frontend (mocks)

- Persona B puede mockear las respuestas usando los ejemplos de arriba mientras Persona A implementa los endpoints.
- El campo `riskLevel` usa los valores `BAJO`, `MEDIO`, `ALTO`.
- Si alguna fuente externa falla, el endpoint sigue respondiendo con los datos disponibles en cache/seed; no se devuelve error por fuente caída.
