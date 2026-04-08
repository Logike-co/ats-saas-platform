# Plantilla de documentación de arquitectura (guía Simon Brown)

Este documento sirve como **guía y checklist** al documentar la arquitectura de un proyecto o producto nuevo. Está alineado con los **13 puntos** de la [guía de Simon Brown](guia_simon_brown.md) y recoge temas y preguntas típicas para no dejar huecos.

**Recomendaciones generales** (de la misma guía):

- La documentación no debe ser estática: actualízala en iteraciones pequeñas.
- Debe ser **punto de entrada** al código y al producto, no un PDF olvidado.
- Documenta el **producto** y el **proyecto** cuando aplique.
- Cuenta la **historia** de la arquitectura (qué cambió y por qué).

**Convención sugerida:** un archivo por punto (como en este repositorio: `01.context.md` … `13.architecture_decision_records.md`) o una carpeta `docs/architecture/` con el mismo orden.

**Nota:** Los puntos marcados con `*` en la guía original no siempre requieren el mismo nivel de detalle; ajústalo al tamaño y criticidad del sistema.

---

## Cómo usar esta plantilla

1. Copia la sección de cada punto al documento correspondiente.
2. Responde las **preguntas guía** (puedes tachar lo que no aplique).
3. Rellena los **bloques “Documentar aquí”** con texto breve y diagramas cuando toque.
4. Enlaza ADRs, issues, wireframes o contratos de API donde existan.

---

# 1. Contexto

**Objetivo (Simon Brown):** Qué es el sistema, para quién y en qué entorno vive. Breve (1–2 páginas). Incluir **diagrama de contexto** (p. ej. C4 nivel 1).

### Preguntas y temas a cubrir

- ¿Cuál es la **meta del producto/sistema** en una frase?
- ¿Qué **problema de negocio** o dolor concreto resuelve?
- ¿Quiénes son los **actores principales** (usuarios, sistemas externos, administradores)?
- ¿Cuál es el **alcance inicial (MVP)** frente a lo que queda **fuera de alcance** explícitamente?
- ¿**Mercado o segmento** objetivo (empresa, sector, región)?
- ¿Cuál es el **diferenciador** frente a alternativas?
- ¿**Restricciones** de negocio relevantes (presupuesto, plazo, tamaño del equipo)?
- ¿Cuáles son los **atributos de calidad prioritarios** ya a nivel de visión (seguridad, coste, rendimiento…)?
- ¿**Normativa o compliance** aplicable o probable (GDPR, sectorial, interno)?
- ¿**Idioma(s)** de producto y documentación?
- ¿**Escala esperada** a corto/medio plazo (usuarios, tenants, volumen de datos)?
- ¿**Modelo de entrega** (SaaS, on-premise, híbrido, multi-tenant)?
- ¿Cómo se define el **éxito** de esta fase o release?
- ¿Qué **sistemas externos** interactúan con el producto (pagos, identidad, ERP, etc.)?

### Documentar aquí

- Resumen ejecutivo del contexto.
- Diagrama de contexto (C4 o equivalente).
- Lista de actores y sistemas vecinos.

---

# 2. Resumen funcional

**Objetivo:** Funciones principales del sistema; referencia a historias de usuario y wireframes. **Resumen**, no especificación exhaustiva.

### Preguntas y temas a cubrir

- ¿Cuál es el **flujo funcional de extremo a extremo** (pipeline o journey principal)?
- ¿Cuáles son los **estados** clave de las entidades de negocio (máquinas de estado mínimas)?
- ¿Qué puede hacer cada **rol** (matriz de responsabilidades o RACI simplificado)?
- ¿Qué **entidades funcionales** existen y cuáles son sus **datos mínimos** obligatorios?
- ¿Hay **integraciones o canales** (web, APIs de terceros, colas, ficheros)?
- ¿Hay **procesos asíncronos** o batch que formen parte del valor funcional?
- ¿Qué **reglas de trazabilidad o auditoría** son obligatorias desde negocio?
- ¿Qué **notificaciones** debe disparar el sistema y a quién?
- ¿Qué **métricas o KPIs funcionales** importan al negocio desde el inicio?
- Enlaces a **historias de usuario**, mockups o backlog.

### Documentar aquí

- Flujo macro y estados.
- Roles y capacidades por rol.
- Diccionario funcional breve.

---

# 3. Atributos de calidad

**Objetivo:** Listar atributos relevantes y **cómo se miden o garantizan** (objetivos cuantitativos cuando sea posible).

### Preguntas y temas a cubrir

- ¿**Disponibilidad** objetivo (p. ej. 99,5 %, 99,9 %)?
- ¿**Rendimiento** esperado (latencias, throughput, escenarios críticos)?
- ¿**Escalabilidad** (vertical vs horizontal, picos previstos)?
- ¿**Seguridad** (autenticación, autorización, MFA, cifrado en tránsito/reposo, secretos)?
- ¿**Trazabilidad y retención** de logs y auditoría?
- ¿**Recuperación ante desastres** (RPO, RTO)?
- ¿**Mantenibilidad** (cobertura de tests en lógica crítica, deuda técnica aceptada)?
- ¿**Observabilidad** (logs estructurados, métricas, trazas, health checks)?
- ¿**Coste** como restricción explícita (optimizar infra vs resiliencia)?
- ¿**Privacidad y ciclo de vida de datos** (retención, anonimización, borrado)?

### Documentar aquí

- Tabla: atributo | objetivo | medición/garantía | trade-off aceptado.

---

# 4. Restricciones

**Objetivo:** Todo lo que **condiciona** el diseño (no son deseos, son límites reales).

### Preguntas y temas a cubrir

- **Stack** obligatorio o preferido (lenguaje, frameworks, BD).
- **Infraestructura** (cloud concreto, on-premise, VPS, air-gapped).
- **Presupuesto** y modelo de coste operativo.
- **Equipo** (tamaño, habilidades, disponibilidad).
- **Plazos** y hitos fijos.
- **Servicios externos** permitidos o prohibidos (comprar vs construir).
- **Estándares corporativos** o de cliente (naming, seguridad, repositorios).
- **Entornos** mínimos (dev/prod, staging obligatorio, etc.).
- **Propiedad intelectual** o licencias.
- **Decisiones de arquitectura ya tomadas** por terceros (legacy, proveedor).

### Documentar aquí

- Lista priorizada de restricciones y su impacto en el diseño.

---

# 5. Principios de diseño

**Objetivo:** Reglas y convenciones que **guían** el diseño y el código día a día.

### Preguntas y temas a cubrir

- ¿Qué **paradigmas** se adoptan (SOLID, DDD ligero, hexagonal, modular, event-driven)?
- ¿**KISS / YAGNI** y límites explícitos a la sobreingeniería?
- ¿**Enfoque de capas o paquetes** (por feature vs capa técnica vs hexagonal estricta)?
- ¿Política de **pruebas** (TDD, cobertura mínima, pirámide de tests)?
- ¿**APIs** (REST, GraphQL, gRPC), versionado, convención de errores?
- ¿**Multi-tenant** o multi-instancia: estrategia y reglas de aislamiento?
- ¿**Calidad en CI** (lint, format, tests bloqueantes)?
- ¿**Convenciones de código** (idioma en código vs documentación, naming)?
- ¿Principios de **seguridad por diseño** (mínimo privilegio, secretos, validación en frontera)?

### Documentar aquí

- Lista de principios con una línea de “qué implica en la práctica”.

---

# 6. Arquitectura de software

**Objetivo:** Patrón arquitectónico, **contenedores** y **componentes** (C4). Diagramas dinámicos si aclaran flujos críticos.

### Preguntas y temas a cubrir

- ¿**Estilo** (monolito modular, microservicios, serverless híbrido, etc.) y **por qué**?
- Si hay **monolito + API REST** (u otro estilo de frontera), ¿por qué existe esa frontera?
- ¿Cuáles son los **contenedores** (apps, BD, broker, IdP, workers)?
- ¿Cómo se **comunican** (síncrono, asíncrono, eventos)?
- ¿**Módulos o bounded contexts** del dominio?
- ¿Dónde vive el **procesamiento asíncrono** (colas, outbox, schedulers)?
- ¿**Seguridad** entre contenedores (red, TLS interno, mTLS si aplica)?
- ¿**Trade-offs** explícitos (simplicidad vs elasticidad, coste vs HA)?

### Documentar aquí

- Diagrama de contenedores.
- Diagrama de componentes (por contenedor principal).
- Secuencia o actividad para 1–3 flujos críticos.

---

# 7. Código y diseño técnico *

**Objetivo:** Detalle de **bajo nivel solo donde importa** (piezas críticas o complejas). No documentar todo el código.

### Preguntas y temas a cubrir

- ¿Estructura del **repositorio** (monorepo, polyrepo, módulos)?
- ¿**Stack** concreto y versiones relevantes?
- ¿Puntos de extensión o **patrones** recurrentes (factories, strategies, CQRS parcial)?
- ¿**Flujos internos** difíciles de inferir leyendo solo el código?
- ¿**Contratos** entre módulos (DTOs, eventos, puertos)?
- ¿**Puntos calientes** de rendimiento o concurrencia?
- Enlaces a **OpenAPI**, esquemas de eventos, ADRs relacionados.

### Documentar aquí

- 1–3 “deep dives” con diagramas de clases o secuencia a nivel implementación.

---

# 8. Datos

**Objetivo:** Información persistida, modelo lógico, motor, almacenamiento de archivos, **backup y retención**.

### Preguntas y temas a cubrir

- ¿**Modelo entidad-relación** o diagrama de dominio de datos?
- ¿**Diccionario** de entidades (campos clave, tipos, obligatoriedad)?
- ¿**Relaciones y cardinalidades** críticas?
- ¿**Índices** y consultas más frecuentes?
- ¿Estrategia **multi-tenant** en datos (fila, esquema, BD dedicada)?
- ¿**Archivos y blobs**: dónde viven, metadatos en BD?
- ¿**Migraciones** y versionado de esquema?
- ¿Política de **backups** (frecuencia, retención, pruebas de restauración)?
- ¿**Escalabilidad** futura (particionado, réplicas de lectura, archivado)?

### Documentar aquí

- MER o diagrama equivalente.
- Política de backup/resumen de RPO/RTO si aplica a datos.

---

# 9. Arquitectura de infraestructura *

**Objetivo:** Topología **red/hardware/virtual** donde corre el software en producción.

### Preguntas y temas a cubrir

- ¿**Región(es)**, VPC, subredes, DMZ?
- ¿**Balanceo**, CDN, WAF, firewalls?
- ¿**Nodos** (servidores, k8s, PaaS) y responsabilidad de cada uno?
- ¿**Sistema operativo** o imagen base?
- ¿**Reverse proxy** y **TLS** (Let’s Encrypt, certificados corporativos)?
- ¿**Dominios** y enrutamiento (subdominios por servicio)?
- ¿**Almacenamiento** (volúmenes, object storage)?
- ¿**Observabilidad** a nivel infra (métricas de host, uptime)?
- ¿**Riesgos** aceptados (single point of failure, coste)?

### Documentar aquí

- Diagrama de red/topología.
- Tabla servicio → host/recurso.

---

# 10. Contenerización y despliegue *

**Objetivo:** Cómo los **artefactos de software** se mapean a la infraestructura. Diagrama de despliegue.

### Preguntas y temas a cubrir

- ¿**Imágenes** base, multi-stage build, usuario no root?
- ¿**Orquestación** (Docker Compose, Kubernetes, PaaS)?
- ¿**Variables de entorno** y gestión de secretos?
- ¿**Registry** y etiquetado de imágenes (`semver`, `latest`)?
- ¿**Pipeline CI/CD** (build, test, publish, deploy)?
- ¿**Estrategia de migraciones** de BD en despliegue (orden, rollback)?
- ¿**Rollback** y criterios de abortar un release?
- ¿Entornos **dev/staging/prod** y promoción de artefactos?

### Documentar aquí

- Diagrama de despliegue.
- Comandos o enlaces a scripts documentados en el repo.

---

# 11. Operación y soporte

**Objetivo:** Cómo se **monitoriza**, opera en vivo y da **primera línea de soporte**.

### Preguntas y temas a cubrir

- ¿**Horario** de soporte y canales (email, chat, ticket)?
- ¿**SLA** o tiempos objetivo de respuesta/resolución por severidad?
- ¿Quién **atiende** incidentes (on-call, rotación, solo dev)?
- ¿**Logs**: dónde están, formato, retención, cómo buscar por `trace_id`?
- ¿**Alertas** (disponibilidad, errores 5xx, recursos, colas atascadas)?
- ¿**Runbooks** mínimos (caída API, BD, auth, colas)?
- ¿**Mantenimiento** planificado y comunicación a usuarios?
- ¿**Backups/restauración** operativa (quién ejecuta, cuánto tarda)?

### Documentar aquí

- Matriz severidad → respuesta → escalado.
- Enlaces a runbooks o carpeta `docs/runbooks/`.

---

# 12. Ambiente de desarrollo y contribución

**Objetivo:** **Onboarding pragmático**: instalar, compilar y contribuir en tiempo razonable.

### Preguntas y temas a cubrir

- ¿**Requisitos** (runtime, gestor de paquetes, Docker, versiones)?
- ¿Pasos de **setup local** (orden: deps → BD → migraciones → apps)?
- ¿**Ramas** y flujo (GitFlow, trunk-based, convención de commits)?
- ¿**Pull requests**: checklist, revisores, política de merge?
- ¿**CI** local vs remota (hooks, `husky`)?
- ¿**Gestión de trabajo** (issues, plantillas, Definition of Done)?
- ¿Lineamientos para **IA asistida** (mismas reglas que el equipo humano)?
- ¿**Secretos** nunca en repo; uso de `.env.example`?

### Documentar aquí

- README o enlace al documento de contribución del repositorio.

---

# 13. Registro de decisiones arquitectónicas (ADRs) *

**Objetivo:** Bitácora **inmutable** de decisiones importantes y su contexto histórico.

### Formato sugerido por ADR

- **Título / ID** (ej. ADR-001)
- **Estado** (propuesta, aceptada, deprecada, sustituida por ADR-XXX)
- **Contexto** (qué problema o fuerza motivó la decisión)
- **Decisión** (qué se eligió)
- **Consecuencias** (positivas, negativas, trabajo futuro)

### Preguntas y temas a cubrir

- ¿Qué decisiones **cambian el rumbo** del sistema (stack, patrones, proveedores)?
- ¿Qué alternativas se **descartaron** y por qué?
- ¿Qué decisión queda **pendiente** de revisión en una fecha o escala concreta?

### Documentar aquí

- Lista de ADRs con enlace a cada archivo o sección.

---

## Checklist final rápido

- [ ] Cada punto tiene al menos un párrafo o diagrama donde aplica.
- [ ] Los puntos marcados con `*` tienen el nivel de detalle adecuado al tamaño del proyecto.
- [ ] Hay enlaces cruzados (contexto ↔ funcional ↔ datos ↔ despliegue).
- [ ] Las decisiones importantes tienen ADR.
- [ ] La documentación tiene fecha de última revisión o convención de changelog en `docs/`.

---

*Plantilla derivada de la guía Simon Brown en este repositorio y de la práctica de documentación del proyecto LTI ATS.*
