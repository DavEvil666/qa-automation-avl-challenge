# Documentación sobre el uso de IA



Este documento describe cómo se utilizó la asistencia de IA durante el desarrollo de este desafío de automatización de control de calidad.



## Propósito del uso de IA



La IA se utilizó como herramienta de soporte técnico durante la implementación de este desafío. Su función principal fue brindar orientación, sugerencias para la revisión del código, ideas para la depuración y la estructura de la documentación.



Las decisiones técnicas, la configuración local, la configuración del framework, la ejecución de pruebas, la validación de selectores, la resolución de problemas y la implementación final fueron realizadas por el candidato.



La IA no se utilizó como sustituto del criterio de ingeniería de control de calidad. Se utilizó como acelerador y como recurso de soporte durante etapas específicas del proyecto.



\## Responsabilidad del candidato



El proyecto fue diseñado, implementado y validado por el candidato desde la perspectiva de un ingeniero de automatización de control de calidad.



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



La asistencia de IA se utilizó únicamente después de que el candidato tuviera una dirección técnica clara y estuviera ejecutando activamente la implementación.



## Áreas donde se utilizó la IA



La IA se utilizó para apoyar las siguientes actividades:



* Sugerir una estructura de proyecto limpia para pruebas móviles, de API y de eventos opcionales.



* Proporcionar ejemplos de configuración de WebdriverIO para Appium.



* Proporcionar ejemplos de pruebas de API de Playwright.



* Sugerir la organización del modelo de objetos de página (POM).



* Ayudar con la interpretación de los registros de errores de Appium y WebdriverIO.



* Ayudar a comparar diferentes estrategias de selección.



* Apoyar la redacción de la documentación para el archivo README y la explicación del uso de la IA. Todas las sugerencias generadas se revisaron, adaptaron y validaron manualmente antes de incluirlas en el proyecto final.



## Decisiones de automatización móvil



La automatización móvil se implementó utilizando Appium, WebdriverIO y UiAutomator2.



El candidato validó la jerarquía de la interfaz de usuario de Android directamente mediante:



```bash

adb shell uiautomator dump

```

Este paso fue importante porque algunos elementos visibles no eran los más adecuados para automatizar.



Por ejemplo, durante el flujo del catálogo, el título del producto estaba disponible en la interfaz de usuario, pero no era clicable. Tras inspeccionar la jerarquía de la interfaz de usuario, el candidato identificó que el elemento clicable era la imagen del producto.



Basándonos en ese análisis, la estrategia de selección se ajustó para usar un ID de recurso de Android más fiable:



```js

$('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)')

```



Esta fue una decisión de depuración manual e ingeniería con el apoyo de la IA.



## Decisiones de automatización de inicio de sesión



Para el flujo de inicio de sesión, el candidato inspeccionó la jerarquía de la pantalla de inicio de sesión e identificó los ID de recursos de Android estables para:



* Campo de nombre de usuario.



* Campo de contraseña.



* Botón de inicio de sesión.



* Título de inicio de sesión.



Los escenarios de inicio de sesión finales contemplaron:



* Inicio de sesión exitoso con credenciales válidas.



* Validación de inicio de sesión negativa con un usuario bloqueado.



El escenario negativo se ajustó durante la ejecución porque validar un mensaje de error dinámico era menos estable que validar el comportamiento esperado del negocio: un usuario bloqueado no debe acceder a la pantalla de Productos.



Esta decisión mejoró la fiabilidad de la prueba y redujo la dependencia de mensajes temporales de la interfaz de usuario.



## Decisiones de automatización de la API



La automatización de la API se implementó utilizando Playwright y AJV.



El candidato implementó y validó:



* Generación de tokens de autenticación.



* Creación de reservas.



* Actualización de reservas.



* Validaciones de códigos de estado HTTP.



* Validaciones de esquemas JSON.



* Validación de SLA inferior a 1,5 segundos.



La IA proporcionó ejemplos de estructuras y sintaxis, pero el candidato ejecutó las pruebas localmente, revisó las respuestas y ajustó la implementación en función de los resultados reales.



## Gestión de SLA



Durante la ejecución completa, el endpoint `/auth` falló una vez debido a que el tiempo de respuesta de la API pública se vio afectado por factores externos como la latencia de la red o el comportamiento de arranque en frío.



El candidato decidió añadir una solicitud de calentamiento antes de medir el SLA real del endpoint.



Este enfoque evita contabilizar el tiempo de DNS, la negociación TLS o el tiempo de arranque en frío de la API pública como parte del tiempo de respuesta del endpoint, al tiempo que valida que la solicitud `/auth` medida se mantenga dentro del SLA requerido.



Ejemplo de resultado medido:



```texto

Tiempo de respuesta de autenticación: 445 ms

```



\## Proceso de depuración



Se resolvieron varios problemas mediante la depuración y validación manual:



* Configuración del servidor Appium.



* Conectividad del emulador de Android.



* Validación de la ruta ADB.



\* Configuración del controlador UiAutomator2.



* Selectores móviles incorrectos.



* Elementos visibles no clicables



## Pruebas de Kafka / Eventos

Como beneficio adicional opcional, se implementaron pruebas de eventos compatibles con Kafka utilizando Redpanda, KafkaJS, Playwright y AJV.

El candidato fue responsable de:

* Crear la estructura de carpetas para las pruebas de eventos.

* Definir el esquema del evento `booking.created`.

* Implementar el flujo de pruebas del productor y el consumidor.

* Ejecutar Redpanda localmente mediante Docker Compose.

* Depurar problemas de sincronización del consumidor.

* Mejorar la estabilidad de las pruebas utilizando un tema único por ejecución.

* Validar que el evento consumido coincidiera con el contrato del esquema JSON esperado.

Se utilizó IA como herramienta de apoyo para la orientación en la implementación y sugerencias de depuración, pero la validación final la realizó el candidato localmente.

