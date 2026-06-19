# Documentación sobre el uso de IA

Este documento describe cómo se utilizó la asistencia de IA durante el desarrollo de este desafío de
automatización de control de calidad.

## Propósito del uso de IA

La IA se utilizó como herramienta de soporte técnico durante la implementación de este desafío. Su función
principal fue brindar orientación, sugerencias para la revisión del código, ideas para la depuración y la
estructura de la documentación.

Las decisiones técnicas, la configuración local, la configuración del framework, la ejecución de pruebas, la
validación de selectores, la resolución de problemas y la implementación final fueron realizadas por el
candidato.

La IA no se utilizó como sustituto del criterio de ingeniería de control de calidad. Se utilizó como
acelerador y como recurso de soporte durante etapas específicas del proyecto.

## Herramientas utilizadas

* **ChatGPT** — apoyo en la planificación del flujo de trabajo, generación de boilerplate inicial
  (estructura de page objects, configuración de WebdriverIO/Playwright, esqueletos de specs),
  interpretación de errores de Appium/WebdriverIO, y apoyo en la redacción y revisión de la
  documentación (README, este archivo).
* **GitHub Copilot** — autocompletado y generación de boilerplate dentro del editor durante la
  escritura de page objects y specs.
* **Claude** — revisión de selectores, validación de buenas prácticas de automatización y apoyo en
  la depuración y documentación final del proyecto.

## Responsabilidad del candidato

El proyecto fue diseñado, implementado y validado por el candidato desde la perspectiva de un ingeniero de
automatización de control de calidad.

El candidato fue responsable de:

* Seleccionar y validar el enfoque de automatización.
* Configurar el entorno local.
* Instalar y configurar Appium, WebdriverIO, UiAutomator2 y Playwright.
* Crear la estructura del proyecto.
* Ejecución local de todas las pruebas.
* Depuración de errores de ejecución reales.
* Inspección de volcados de jerarquía de la interfaz de usuario de Android.
* Determinación de qué selectores eran lo suficientemente estables para la automatización.
* Refactorización de selectores para reducir la inestabilidad.
* Validación de contratos de API mediante JSON Schema.
* Medición de los tiempos de respuesta de la API en función del requisito del SLA.
* Revisión y ajuste de la documentación final.

La asistencia de IA se utilizó únicamente después de que el candidato tuviera una dirección técnica clara y
estuviera ejecutando activamente la implementación.

## Áreas donde se utilizó la IA

La IA se utilizó para apoyar las siguientes actividades:

* Sugerir una estructura de proyecto limpia para pruebas móviles, de API y de eventos opcionales.
* Proporcionar ejemplos de configuración de WebdriverIO para Appium.
* Proporcionar ejemplos de pruebas de API de Playwright.
* Sugerir la organización del modelo de objetos de página (POM).
* Ayudar con la interpretación de los registros de errores de Appium y WebdriverIO.
* Ayudar a comparar diferentes estrategias de selección.
* Apoyar la redacción de la documentación para el archivo README y la explicación del uso de la IA.

Todas las sugerencias generadas se revisaron, adaptaron y validaron manualmente antes de incluirlas en el
proyecto final.

## Ejemplos de prompts

A continuación se comparten dos prompts reales que aportaron valor significativo durante el desarrollo.

### Prompt 1 — Resolución de selector inestable en el catálogo

> "Estoy automatizando el catálogo de la app SauceLabs My Demo App con Appium + WebdriverIO. El título del
> producto 'Sauce Labs Backpack' aparece en pantalla pero al hacer click sobre el TextView no dispara la
> navegación al detalle. Te paso el volcado de `adb shell uiautomator dump` de esa pantalla — ¿cuál es el
> elemento realmente clicable y cómo debería construir el selector con UiSelector para que no dependa del
> texto visible del producto?"

**Valor aportado:** la IA ayudó a leer el XML del dump e identificar que el elemento interactivo real era el
`ImageView` del producto (`productIV`), no el texto. El candidato verificó esto manualmente probando ambos
selectores contra el emulador antes de fijar la solución final en `CatalogPage.js`.

### Prompt 2 — Estrategia de medición de SLA sin falsos negativos

> "Tengo una prueba con Playwright que mide el tiempo de respuesta del endpoint `/auth` de Restful Booker y
> falla si supera 1500 ms. En una corrida falló por 1900 ms, pero en ejecuciones posteriores pasó sin
> problema. Sospecho que es latencia de arranque en frío de la API pública o de DNS/TLS, no del endpoint en
> sí. ¿Qué estrategias existen para medir el SLA real del endpoint sin que el cold start de la red infle el
> resultado, sin falsear la medición?"

**Valor aportado:** la IA sugirió varias alternativas (ignorar la primera corrida, repetir y promediar,
warm-up request previo). El candidato evaluó las opciones y decidió implementar un warm-up request a `/ping`
antes de medir, documentando la justificación en este archivo y en el README. La decisión final y su
implementación fueron del candidato.

## Decisiones de automatización móvil

La automatización móvil se implementó utilizando Appium, WebdriverIO y UiAutomator2.

El candidato validó la jerarquía de la interfaz de usuario de Android directamente mediante:

```bash
adb shell uiautomator dump
```

Este paso fue importante porque algunos elementos visibles no eran los más adecuados para automatizar.

Por ejemplo, durante el flujo del catálogo, el título del producto estaba disponible en la interfaz de
usuario, pero no era clicable. Tras inspeccionar la jerarquía de la interfaz de usuario, el candidato
identificó que el elemento clicable era la imagen del producto.

Basándonos en ese análisis, la estrategia de selección se ajustó para usar un ID de recurso de Android más
fiable:

```js
$('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)')
```

Esta fue una decisión de depuración manual e ingeniería con el apoyo de la IA (ver Prompt 1).

Adicionalmente, todos los selectores secundarios que originalmente dependían de texto visible (título del
producto en catálogo y carrito, título de pantalla "My Cart", opción de menú "Log In") fueron migrados a
`resource-id` o accessibility id reales, validados contra volcados de `adb shell uiautomator dump` de cada
pantalla (catálogo, carrito y menú).

## Decisiones de automatización de inicio de sesión

Para el flujo de inicio de sesión, el candidato inspeccionó la jerarquía de la pantalla de inicio de sesión
e identificó los ID de recursos de Android estables para:

* Campo de nombre de usuario.
* Campo de contraseña.
* Botón de inicio de sesión.
* Título de inicio de sesión.

Los escenarios de inicio de sesión finales contemplaron:

* Inicio de sesión exitoso con credenciales válidas.
* Validación de inicio de sesión negativa con un usuario bloqueado.

El escenario negativo se ajustó durante la ejecución porque validar un mensaje de error dinámico era menos
estable que validar el comportamiento esperado del negocio: un usuario bloqueado no debe acceder a la
pantalla de Productos.

Esta decisión mejoró la fiabilidad de la prueba y redujo la dependencia de mensajes temporales de la
interfaz de usuario.

## Decisiones de automatización de la API

La automatización de la API se implementó utilizando Playwright y AJV.

El candidato implementó y validó:

* Generación de tokens de autenticación.
* Creación de reservas.
* Actualización de reservas.
* Validaciones de códigos de estado HTTP.
* Validaciones de esquemas JSON.
* Validación de SLA inferior a 1,5 segundos.

La IA proporcionó ejemplos de estructuras y sintaxis, pero el candidato ejecutó las pruebas localmente,
revisó las respuestas y ajustó la implementación en función de los resultados reales.

## Gestión de SLA

Durante la ejecución completa, el endpoint `/auth` falló una vez debido a que el tiempo de respuesta de la
API pública se vio afectado por factores externos como la latencia de la red o el comportamiento de arranque
en frío.

El candidato decidió añadir una solicitud de calentamiento antes de medir el SLA real del endpoint (ver
Prompt 2).

Este enfoque evita contabilizar el tiempo de DNS, la negociación TLS o el tiempo de arranque en frío de la
API pública como parte del tiempo de respuesta del endpoint, al tiempo que valida que la solicitud `/auth`
medida se mantenga dentro del SLA requerido.

Ejemplo de resultado medido:

```text
Tiempo de respuesta de autenticación: 445 ms
```

## Proceso de depuración

Se resolvieron varios problemas mediante la depuración y validación manual:

* Configuración del servidor Appium.
* Conectividad del emulador de Android.
* Validación de la ruta ADB.
* Configuración del controlador UiAutomator2.
* Selectores móviles incorrectos.
* Elementos visibles no clicables.

## Pruebas de Kafka / Eventos

Como beneficio adicional opcional, se implementaron pruebas de eventos compatibles con Kafka utilizando
Redpanda, KafkaJS, Playwright y AJV.

El candidato fue responsable de:

* Crear la estructura de carpetas para las pruebas de eventos.
* Definir el esquema del evento `booking.created`.
* Implementar el flujo de pruebas del productor y el consumidor.
* Ejecutar Redpanda localmente mediante Docker Compose.
* Depurar problemas de sincronización del consumidor.
* Mejorar la estabilidad de las pruebas utilizando un tópico único por ejecución.
* Validar que el evento consumido coincidiera con el contrato del esquema JSON esperado.

Se utilizó IA como herramienta de apoyo para la orientación en la implementación y sugerencias de
depuración, pero la validación final la realizó el candidato localmente.

## Reflexión técnica

El uso de IA aceleró principalmente la fase de boilerplate (estructura inicial de page objects, configuración
de WebdriverIO/Playwright, esqueletos de specs) y la interpretación de mensajes de error verbosos de Appium.
No aceleró ni sustituyó las decisiones de ingeniería que requerían contexto real del entorno: la elección
final de selectores se validó siempre contra el emulador real, y la estrategia de SLA se ajustó solo después
de observar el fallo real en ejecución, no por sugerencia ciega de la IA.

La principal corrección de un error/alucinación de la IA fue durante la automatización del catálogo: una
sugerencia inicial planteaba interactuar directamente con el texto del producto como si fuera el elemento
clicable, lo cual no correspondía con la jerarquía real de UiAutomator2. Esto se detectó al inspeccionar el
dump de la UI y se corrigió usando el `resource-id` de la imagen del producto en su lugar.
