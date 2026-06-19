\# Documentación de Flujo – QA Automation Challenge



\## 1. Propósito



Este documento describe los flujos de prueba automatizados implementados para el desafío técnico de automatización QA.



La solución cubre las siguientes capas:



\* Automatización móvil.

\* Automatización de API.

\* Validación de contratos.

\* Pruebas de eventos usando un broker compatible con Kafka.

\* Reportería de pruebas con Allure.



El objetivo es explicar el flujo de ejecución de punta a punta, el orden recomendado de ejecución, los escenarios automatizados y los resultados esperados.



\---



\## 2. Flujo General de Ejecución



El flujo general de ejecución es el siguiente:



```mermaid

flowchart TD

&#x20;   A\[Inicio de ejecución] --> B\[Validar dependencias del proyecto]

&#x20;   B --> C\[Ejecutar pruebas de API]

&#x20;   C --> D\[Iniciar emulador Android]

&#x20;   D --> E\[Iniciar servidor Appium]

&#x20;   E --> F\[Ejecutar pruebas móviles]

&#x20;   F --> G\[Iniciar broker Redpanda/Kafka]

&#x20;   G --> H\[Ejecutar prueba de contrato de eventos]

&#x20;   H --> I\[Generar reporte Allure]

&#x20;   I --> J\[Revisar resultados finales]

```



La ejecución está dividida por responsabilidades para mantener cada capa de prueba independiente, clara y mantenible.



\---



\## 3. Flujo de Estructura del Proyecto



```mermaid

flowchart TD

&#x20;   A\[qa-automation-avl-challenge] --> B\[api-tests]

&#x20;   A --> C\[mobile-tests]

&#x20;   A --> D\[event-tests]

&#x20;   A --> E\[apps]

&#x20;   A --> F\[README.md]

&#x20;   A --> G\[AI\_USAGE.md]

&#x20;   A --> H\[docker-compose.kafka.yml]

&#x20;   A --> I\[FLOW\_DOCUMENTATION.md]



&#x20;   B --> B1\[Specs de API]

&#x20;   B --> B2\[Configuración API]

&#x20;   B --> B3\[Esquemas JSON]



&#x20;   C --> C1\[Specs móviles]

&#x20;   C --> C2\[Page Objects]

&#x20;   C --> C3\[Configuración WebdriverIO]



&#x20;   D --> D1\[Specs de eventos]

&#x20;   D --> D2\[Esquemas de eventos]

```



\---



\## 4. Flujo de Automatización Móvil



\### Objetivo



Validar los flujos críticos de usuario en la aplicación móvil Android usando Appium, WebdriverIO y UiAutomator2.



\### Precondiciones



\* El emulador Android debe estar encendido.

\* El servidor Appium debe estar corriendo en el puerto `4723`.

\* El APK debe estar disponible en la carpeta `apps`.

\* ADB debe detectar el emulador como dispositivo activo.



Comando para validar el emulador:



```bash

adb devices

```



Resultado esperado:



```text

emulator-5554   device

```



\---



\## 5. Flujo Mobile 1 – Apertura de la Aplicación



\### Objetivo



Validar que la aplicación móvil abra correctamente y muestre el catálogo de productos.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Iniciar sesión Appium] --> B\[Instalar o abrir APK]

&#x20;   B --> C\[Abrir aplicación móvil]

&#x20;   C --> D\[Esperar pantalla de catálogo]

&#x20;   D --> E\[Validar que el catálogo sea visible]

```



\### Resultado Esperado



La aplicación debe abrir correctamente y el catálogo de productos debe ser visible.



\---



\## 6. Flujo Mobile 2 – Catálogo y Carrito



\### Objetivo



Validar que un usuario pueda abrir el detalle de un producto, agregarlo al carrito y verificar que el producto seleccionado aparezca correctamente en el carrito.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Abrir aplicación] --> B\[Visualizar catálogo]

&#x20;   B --> C\[Seleccionar primer producto]

&#x20;   C --> D\[Abrir detalle del producto]

&#x20;   D --> E\[Presionar Add to cart]

&#x20;   E --> F\[Abrir carrito]

&#x20;   F --> G\[Validar producto en carrito]

```



\### Decisión Técnica



Durante la validación de selectores, se identificó que el título del producto era visible en la interfaz, pero no era el elemento más confiable para hacer clic.



Por esa razón, se inspeccionó la jerarquía real de Android usando:



```bash

adb shell uiautomator dump

```



Con base en esa validación, se seleccionó el resource ID de la imagen del producto como el elemento clicable más estable.



\### Resultado Esperado



El producto agregado desde el catálogo debe visualizarse correctamente dentro del carrito.



\---



\## 7. Flujo Mobile 3 – Login



\### Objetivo



Validar el comportamiento del login exitoso y del login negativo.



\### Escenarios Cubiertos



\* Login exitoso con credenciales válidas.

\* Login negativo con usuario bloqueado.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Abrir aplicación] --> B\[Abrir menú]

&#x20;   B --> C\[Seleccionar opción Login]

&#x20;   C --> D\[Ingresar credenciales]

&#x20;   D --> E\[Presionar botón Login]

&#x20;   E --> F{Tipo de credenciales}

&#x20;   F -->|Usuario válido| G\[Se muestra pantalla de productos]

&#x20;   F -->|Usuario bloqueado| H\[No se muestra pantalla de productos]

```



\### Decisión Técnica



Para el escenario negativo de login, la validación se enfocó en el comportamiento esperado de negocio: un usuario bloqueado no debe acceder a la pantalla de productos.



Este enfoque es más estable que depender de un mensaje de error dinámico en la interfaz.



\### Resultados Esperados



\* El usuario válido debe acceder correctamente a la pantalla de productos.

\* El usuario bloqueado no debe acceder a la pantalla de productos.



\---



\## 8. Flujo de Automatización API



\### Objetivo



Validar operaciones principales de API usando Playwright y AJV.



\### Endpoints Cubiertos



\* Autenticación.

\* Creación de reserva.

\* Actualización de reserva.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Iniciar suite API] --> B\[Ejecutar warm-up de API pública]

&#x20;   B --> C\[Generar token de autenticación]

&#x20;   C --> D\[Validar respuesta de autenticación]

&#x20;   D --> E\[Crear reserva]

&#x20;   E --> F\[Validar esquema de reserva]

&#x20;   F --> G\[Actualizar reserva]

&#x20;   G --> H\[Validar respuesta actualizada]

```



\---



\## 9. Flujo API 1 – Autenticación



\### Objetivo



Generar un token de autenticación válido y validar el tiempo de respuesta contra el SLA requerido.



\### Validaciones



\* Código de estado HTTP.

\* Presencia del token.

\* Tiempo de respuesta inferior a 1.5 segundos.



\### Decisión Técnica



Se ejecuta una solicitud de calentamiento antes de medir el endpoint `/auth`.



Esto evita incluir factores externos como resolución DNS, negociación TLS o comportamiento de arranque en frío de una API pública dentro de la medición real del SLA.



\### Resultado Esperado



El endpoint de autenticación debe retornar un token válido y responder dentro del SLA definido.



\---



\## 10. Flujo API 2 – Creación de Reserva



\### Objetivo



Crear una reserva y validar que la respuesta cumpla con el contrato esperado mediante JSON Schema.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Enviar solicitud de creación de reserva] --> B\[Recibir respuesta]

&#x20;   B --> C\[Validar código HTTP]

&#x20;   C --> D\[Validar cuerpo de respuesta]

&#x20;   D --> E\[Validar JSON Schema con AJV]

```



\### Resultado Esperado



La reserva debe crearse correctamente y la respuesta debe cumplir con el contrato esperado.



\---



\## 11. Flujo API 3 – Actualización de Reserva



\### Objetivo



Actualizar una reserva existente usando un token válido.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Generar token de autenticación] --> B\[Crear reserva]

&#x20;   B --> C\[Enviar solicitud de actualización]

&#x20;   C --> D\[Validar código HTTP]

&#x20;   D --> E\[Validar datos actualizados]

```



\### Resultado Esperado



La reserva debe actualizarse correctamente y la respuesta debe reflejar los datos modificados.



\---



\## 12. Flujo de Eventos – Broker Compatible con Kafka



\### Objetivo



Validar un flujo orientado a eventos usando Redpanda, KafkaJS, Playwright y AJV.



\### Precondiciones



\* Docker Desktop debe estar corriendo.

\* Redpanda debe iniciarse mediante Docker Compose.

\* La variable `KAFKA\_ENABLED=true` debe configurarse antes de ejecutar la prueba de eventos.



Comando para iniciar Redpanda:



```bash

docker compose -f docker-compose.kafka.yml up -d

```



Comando para ejecutar pruebas de eventos:



```bash

set KAFKA\_ENABLED=true

npm run test:events

```



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Iniciar broker Redpanda] --> B\[Crear tópico único de Kafka]

&#x20;   B --> C\[Iniciar consumidor Kafka]

&#x20;   C --> D\[Publicar evento booking.created]

&#x20;   D --> E\[Consumir evento]

&#x20;   E --> F\[Validar payload del evento]

&#x20;   F --> G\[Validar contrato JSON Schema con AJV]

```



\### Decisión Técnica



Se crea un tópico único por cada ejecución para evitar interferencia con pruebas anteriores o mensajes antiguos.



Esto mejora el aislamiento de la prueba y reduce el riesgo de consumir mensajes obsoletos.



\### Resultado Esperado



El evento debe publicarse, consumirse y validarse correctamente contra el contrato JSON Schema esperado.



\---



\## 13. Flujo de Reportería – Allure



\### Objetivo



Generar un reporte visual de la ejecución automatizada.



\### Flujo



```mermaid

flowchart TD

&#x20;   A\[Ejecutar suites de prueba] --> B\[Generar allure-results]

&#x20;   B --> C\[Generar reporte Allure]

&#x20;   C --> D\[Abrir reporte Allure]

&#x20;   D --> E\[Revisar pruebas aprobadas y fallidas]

```



Comandos:



```bash

npm run report:generate

npm run report:open

```



\### Resultado Esperado



Allure debe mostrar las suites ejecutadas y su estado final.



\---



\## 14. Resumen de Comandos de Ejecución



\### Pruebas API



```bash

npm run test:api

```



\### Pruebas Mobile



```bash

npm run test:mobile

```



\### Pruebas de Eventos



```bash

docker compose -f docker-compose.kafka.yml up -d

set KAFKA\_ENABLED=true

npm run test:events

```



\### Reporte Allure



```bash

npm run report:generate

npm run report:open

```



\---



\## 15. Flujo de Validación Final



Antes de entregar el proyecto, se recomienda ejecutar el siguiente flujo de validación:



```mermaid

flowchart TD

&#x20;   A\[Ejecutar pruebas API] --> B\[Ejecutar pruebas móviles]

&#x20;   B --> C\[Ejecutar pruebas de eventos]

&#x20;   C --> D\[Generar reporte Allure]

&#x20;   D --> E\[Validar documentación]

&#x20;   E --> F\[Validar estado Git]

&#x20;   F --> G\[Subir cambios finales]

```



Validación final de Git:



```bash

git status

```



Resultado esperado:



```text

nothing to commit, working tree clean

```



\---



\## 16. Conclusión



La solución implementada valida los principales flujos de calidad requeridos para el desafío:



\* Flujos de aplicación móvil.

\* Flujos de servicios API.

\* Validación de contratos con JSON Schema.

\* Flujo orientado a eventos usando un broker compatible con Kafka.

\* Reportería de ejecución con Allure.



El proyecto está estructurado, documentado y preparado para ejecutarse mediante scripts npm de forma clara y reproducible.



