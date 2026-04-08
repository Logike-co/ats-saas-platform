# Enrich User Story

Please analyze and fix the Jira ticket: $ARGUMENTS.

Follow these steps:

1. Use Jira MCP to get the ticket details, whether it is the ticket id/number, keywords referring to the ticket or indicating status, like "the one in progress"

2. You will act as a product expert with technical knowledge

3. Understand the problem described in the ticket

4. Decide whether or not the User Story is completely detailed according to product's best practices:
   - **Mandatory Specification:** Debe incluir una descripción completa de la funcionalidad y, para entidades principales, el desglose de casos de uso estándar: `Create`, `Update`, `Delete`, `Search` (listado/filtros) y **`FindById`** (detalle).
   - **Technical Details:** Lista completa de campos a actualizar, estructura y URLs de endpoints necesarios, archivos a modificar según arquitectura hexagonal y mejores prácticas, pasos para considerar la tarea completa, actualización de documentación, creación de pruebas unitarias y requisitos no funcionales (seguridad, rendimiento, etc.).

5. If the user story lacks the technical and specific detail necessary to allow the developer to be fully autonomous when completing it, provide an improved story that is clearer, more specific, and more concise in line with product best practices described in step 4. Use the technical context you will find in
@documentation. Return it in markdown format.

6. **Actualización en Jira:** Agrega el nuevo contenido (especificación técnica completa) directamente en la descripción del ticket **después del contenido original**.
   - Utiliza un separador claro como `---` o `***`.
   - REGLA CRÍTICA: Utiliza **ÚNICAMENTE formato Markdown estándar** (`#`, `##`, `*`, `-`, `**`, `>`).
   - **PROHIBIDO** el uso de etiquetas de estilo de Jira como `{panel}`, `h1.`, `h2.`, `*negrita*` (usar `**negrita**`), o cualquier macro de Confluence/Jira.
   - Asegúrate de que el detalle sea puramente Markdown para garantizar consistencia.

7. **Generar Mockup de UI:**
   - Utiliza la herramienta `generate_image` para crear un mockup profesional de alta fidelidad.
   - Sigue el tema "Vaadin Lumo Dark" y los estándares del proyecto (`vaadin-admin-screens.mdc`).
   - REGLA CRÍTICA: En la columna de acciones de la grilla, SOLO muestra iconos (lápiz, papelera), SIN etiquetas de texto como "Editar" o "Eliminar".
   - Adjunta el mockup generado al ticket de Jira usando `jira_upload_attachment`.

8. **Referencias:** Menciona el nombre del archivo del mockup adjunto dentro de la descripción técnica.

9. If the ticket status was "To refine", move the task to the "Pending refinement validation" column.
