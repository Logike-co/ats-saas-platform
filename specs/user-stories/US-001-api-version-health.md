# US-001: API versionada y health check (backend)

## Metadata

| Campo | Valor |
| :--- | :--- |
| **Id** | US-001 |
| **Epica** | E0 — Plataforma y datos base |
| **Dependencias** | Ninguna (primera entrega de superficie HTTP del producto). |
| **Acoplado BE+FE** | no (solo backend; el frontend puede consumir el mismo path mas adelante para status interno, no requerido en esta US). |
| **Estado refinamiento** | listo para planificar |

## Historia

Como **operador de plataforma / pipeline de CI** quiero una **API REST con prefijo de version `v1`** y un **endpoint de salud** accesible sin negocio previo, para **validar despliegues**, **configurar sondas** (liveness) y **monitorizar** que el servicio responde.

## Alcance

- Exponer al menos **`GET /api/v1/health`** (o ruta equivalente documentada bajo `/api/v1`) con respuesta JSON estable.
- Dejar fijado en producto que **toda la API de negocio** cuelga de **`/api/v1`** (alineado con `docs/07.code_and_technical_design.md`).
- **Fuera de alcance de US-001:** comprobaciones de **readiness** con PostgreSQL, Redis o Keycloak (pueden ser US posteriores cuando existan conexiones); autenticacion en health para probes estandar **no** requerida.

## Criterios de aceptacion

1. **Dado** el backend en ejecucion, **cuando** se invoca `GET /api/v1/health` sin cabeceras de autenticacion, **entonces** la respuesta es **200** y cuerpo JSON incluye al menos:
   - un campo de **estado** coherente con “servicio vivo” (ej. `status: "ok"`),
   - identificacion del **servicio** (ej. `service: "backend"`),
   - **marca temporal** en ISO 8601 (ej. `timestamp`).
2. **Dado** el contrato acordado, **cuando** un monitor o job de CI consulta el endpoint, **entonces** puede determinar exito sin parsear HTML ni dependencias frágiles (solo JSON).
3. **Dado** la politica de versionado, **cuando** se documentan nuevos endpoints de negocio, **entonces** deben declararse bajo **`/api/v1/...`** (esta US no exige implementarlos, solo ancla el prefijo).
4. **Dado** un fallo interno no controlado en otros modulos, **cuando** el proceso HTTP sigue arriba, **entonces** el health **liveness** sigue respondiendo 200 (comportamiento esperado para esta US; readiness profunda se define despues).

## Contrato API

| Metodo | Ruta | Auth | Respuesta exito |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Ninguna (probes / CI) | `200`, `Content-Type: application/json` |

**Cuerpo de ejemplo (estable para consumidores):**

```json
{
  "status": "ok",
  "service": "backend",
  "apiVersion": "v1",
  "timestamp": "2026-04-08T12:00:00.000Z"
}
```

**Errores:** no se exige cuerpo `code` / `traceId` en este endpoint salvo que el equipo unifique mas adante; si el servidor no puede atender la ruta, **5xx** es aceptable para alertas.

**Version visible (opcional recomendado):** incluir `apiVersion: "v1"` en el JSON o documentar en OpenAPI/README del paquete backend para alinear con “API versionada”.

## Datos y tenant

- No persiste datos de negocio. **Sin `tenant_id`.**
- No toca entidades de `docs/08.data.md`.

## UI / UX

- No aplica pantalla de producto. Opcional: documentar para operadores la URL en `ATS/README.md` o runbook.

## Observabilidad y calidad

- Contribuye a **disponibilidad** y comprobacion post-deploy (`docs/03.quality_attributes.md`).
- Debe pasar **lint/test/build** del workspace backend en CI (`ATS/.github/workflows/ci.yml`).

## Notas de implementacion (estado repo)

- Existe `HealthController` en `ATS/apps/backend/src/health.controller.ts` con `@Controller("api/v1/health")` y `GET` que devuelve `status`, `service`, `timestamp`. Verificar que cumple todos los criterios anteriores y anadir `apiVersion` si se acuerda en plan/implementacion.

## Referencias

- `docs/07.code_and_technical_design.md` — versionado `/api/v1`.
- `docs/14.product_backlog.md` — onda 0, US-002 siguiente (tenant en request).
