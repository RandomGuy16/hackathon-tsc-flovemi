# Reglas de contexto — Torneo de Vibecoding PUCP

> Este archivo es la fuente única de verdad para cualquier IA/agente que trabaje en este repo,
> sin importar si la usa Persona A, B o C, o qué herramienta usan (Cursor, Claude Code, Copilot, Cline, etc.).
> Si una instrucción de un prompt puntual contradice este archivo, **este archivo manda**, salvo que el
> humano lo cambie explícitamente aquí mismo.

## 0. Contexto del proyecto
- Stack: Next.js (App Router) + Vercel (Serverless) + Supabase (Postgres + Auth).
- Arquitectura: Clean Architecture pragmática, 3 capas. NO la versión canónica de libro — no agregar
  capas, interfaces o abstracciones extra "por si acaso". Si dudas entre simple y "correcto según el libro",
  elige simple.
- Tenemos 11 horas. El boilerplate ya está armado. La lógica del reto se agrega encima
  de esta estructura, no se rediseña la estructura.

## 1. Las 3 capas — regla de dependencias (NO NEGOCIABLE)

```
domain/         → entidades + casos de uso. Lógica de negocio pura.
infrastructure/ → cliente de Supabase, repositorios concretos.
interface/      → app/api/ — route handlers que llaman casos de uso.
```

**Regla de oro de dependencias:**
- `domain/` **NUNCA** importa nada de `next`, `next/server`, `@supabase/*`, ni ningún SDK externo.
  Solo TypeScript puro y tipos propios.
- `infrastructure/` puede importar de `domain/` (implementa sus interfaces/repositorios) y de Supabase.
- `interface/` (route handlers) puede importar de `domain/` e `infrastructure/`, nunca al revés.
- El frontend (`app/` fuera de `api/`, componentes, hooks) **nunca** llama directo a Supabase ni a la
  lógica de dominio. Solo consume la API HTTP vía el contrato definido en Sprint 0 (fetch/axios a
  `/api/...`).

**Antes de generar código en `domain/`:** si la tarea pide importar algo de Next.js o Supabase ahí,
detente y dilo explícitamente — probablemente la lógica pertenece a otra capa.

**Antes de cerrar cualquier sprint:** si te lo pido, escanea `domain/` y confirma que no se filtró
ninguna importación de Next.js o Supabase. Si encuentras una, repórtala, no la "arregles en silencio".

## 2. Contrato de API
- El contrato de API (endpoints, payloads de entrada/salida) se define en Sprint 0 y queda registrado
  en `/docs/api-contract.md` (o donde el equipo lo deje).
- **No se cambia un endpoint ya definido sin que los 3 integrantes lo sepan.** Si una tarea requiere
  romper el contrato (cambiar forma de un response, renombrar un campo, etc.), dilo antes de generar
  el código y espera confirmación explícita del humano.
- Si vas a generar un componente de frontend, usa el contrato tal como está documentado — no inventes
  forma de respuesta ni nombres de campos "que tendrían sentido".

## 3. Cambios de esquema de base de datos
- Si se modifica una tabla/columna en Supabase, **lee el esquema actual antes de tocar código que
  dependa de esa tabla** (tipos generados, queries, componentes de UI que consuman esos datos).
  No asumas ni inventes nombres de tablas o columnas.
- Si hay CLI de Supabase configurado, puedes regenerar tipos automáticamente tras un cambio de esquema
  y resolver los conflictos de TypeScript que aparezcan — esto sí es autónomo, no requiere preguntar.

## 4. Cómo debes responder ante tareas complejas
- Antes de generar código no trivial (un caso de uso nuevo, una integración entre capas, lógica de
  negocio con casos borde), **piensa y explica el enfoque primero**, en texto breve, antes de escribir
  el código. No saltes directo a la solución en problemas que no sean boilerplate puro.
- Boilerplate, tipado repetitivo, configuración y tests **sí** puedes generarlos directo, sin pedir
  aprobación de diseño primero.
- Toda entrega de código no trivial debe venir acompañada de una explicación que el integrante pueda
  repetir con sus propias palabras (ver Q&A Inverso, sección 6). Si no la doy, pídela: "¿quieres que
  te explique cómo funciona esto antes de seguir?".

## 5. Deuda técnica — etiquetar, no esconder
- Si por tiempo se toma un atajo que rompe una regla de esta arquitectura (ej. el frontend hace fetch
  directo saltándose un caso de uso, o `domain/` termina con una dependencia que no debería tener),
  **no lo arregles en silencio ni lo ocultes**: etiqueta el código con un comentario:
  ```
  // TECH-DEBT: [explicación breve de qué se saltó y por qué]
  ```
- Esto aplica también si tú, como IA, detectas que el código existente ya tiene una violación de capas
  sin etiquetar: avísalo.

## 6. Checkpoints y commits
- Antes de un refactor grande, una integración entre módulos, o lógica de backend compleja: confirma
  que existe un commit limpio del estado actual antes de tocar nada. Si no estás seguro de que existe,
  pregúntalo antes de proceder.
- **Nunca generes ni ejecutes un commit de código que "funciona pero no se entiende del todo"** sin que
  el humano primero te haya pedido la explicación línea por línea y confirme que puede repetirla con
  sus propias palabras (regla de **Q&A Inverso**). Si te piden generar un commit, asume que ya pasó por
  esa explicación — pero si el mensaje del humano suena a que no entendió el código, dilo.
- Commits frecuentes y descriptivos. Nunca un commit gigante al final del día. Si te piden un mensaje
  de commit, que describa qué cambió y por qué, no "fix" o "updates".

## 7. Deploy
- **Ningún comando de deploy a producción (`vercel --prod` o equivalente) se ejecuta de forma autónoma.**
  Siempre lo dispara un humano, después de confirmar que compila localmente. Si tienes la capacidad
  técnica de ejecutarlo, no lo hagas sin que el humano lo pida explícitamente en ese momento.
- Para loops de testing (escribir test → ejecutar → leer error → corregir → repetir hasta pasar) sí
  puedes operar de forma autónoma hasta que el test pase.

## 8. Documentación (ADRs y README)
- Cualquier decisión de arquitectura no trivial (elegir una librería, un patrón, una excepción a estas
  reglas) debe quedar reflejada en un ADR dentro de `/docs/adr/`, usando el formato del ADR de ejemplo
  ya presente en esa carpeta. No inventes un formato nuevo.
- Si propones una librería, patrón o estructura que no está ya cubierta por un ADR existente, **revisa
  primero `/docs/adr/`** para confirmar que tu propuesta no contradice una decisión ya tomada. Usa los
  ADRs como árbitro, no como documentación que se ignora.
- El README se mantiene actualizado en tiempo real, no se deja "para el final".

## 9. Manejo de errores y deuda de conocimiento
- Ante un error críptico de Next.js, Vercel o Supabase: tu primera instrucción a ti mismo es buscar en
  documentación oficial reciente, no resolver de memoria. Tu conocimiento de versiones recientes de
  estas herramientas puede estar desactualizado.
- Si lo intentas y no lo resuelves en un tiempo razonable, dilo explícitamente en vez de seguir
  insistiendo con variaciones del mismo enfoque ("llevamos varios intentos sin resolver esto, capaz
  conviene un enfoque distinto o hacerlo a mano").

## 10. Alcance del contexto
- No leas toda la base de código para resolver un problema puntual en un componente específico. Pide o
  usa solo los archivos relevantes a la tarea. Si no tienes claro qué archivos son relevantes, pregunta
  en vez de leer todo el repo.

## 11. Roles (para saber qué tipo de tarea es típica de quién)
- **Persona A** — dominio + backend: entidades, casos de uso, route handlers en `interface/`.
- **Persona B** — frontend: pantallas en Next.js consumiendo el contrato de API, puede pedir mocks de
  respuesta mientras el backend no está listo.
- **Persona C** — infraestructura, testing, deploy, documentación: configuración de Supabase/Vercel,
  tests (Jest: happy path + caso de error como mínimo), README, ADRs, deploys incrementales.
- Esto es orientativo, no una restricción de quién puede pedirte qué. Pero si te piden algo muy fuera
  del rol típico de quien escribe, puedes simplemente proceder igual.

---
**Resumen de una línea si necesitas recordarlo rápido:** domain puro sin frameworks, contrato de API
fijo salvo acuerdo de los 3, pensar antes de código complejo, deuda técnica etiquetada nunca oculta,
deploy a producción siempre manual, ADRs como árbitro de decisiones.
