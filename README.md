# Desafío AVL de Automatización de QA

Este repositorio contiene una solución de pruebas automatizadas para un desafío de Ingeniero de Automatización de QA.

El proyecto incluye:

* Pruebas de automatización móvil con Appium, WebdriverIO y UiAutomator2.
* Pruebas de automatización de API con Playwright.
* Validación de esquema JSON con AJV.
* Validación de SLA para tiempos de respuesta de API inferiores a 1,5 segundos.
* Implementación del modelo de objetos de página (POM) para pruebas móviles.
* Pruebas opcionales de eventos Kafka/Redpanda (productor + consumidor).
* Compatibilidad con informes de Allure (móvil).

## Tecnologías utilizadas

* Node.js
* Java
* Android SDK
* Appium
* WebdriverIO
* UiAutomator2
* Playwright Test
* AJV
* KafkaJS
* Allure Reporter
* dotenv

## Estructura del proyecto

```text
qa-automation-avl-challenge/
├── apps/
│   └── my-demo-app.apk
├── mobile-tests/
│   ├── config/
│   │   └── wdio.android.conf.js
│   ├── page-objects/
│   │   ├── CartPage.js
│   │   ├── CatalogPage.js
│   │   ├── LoginPage.js
│   │   ├── MenuPage.js
│   │   └── ProductDetailPage.js
│   └── specs/
│       ├── app-launch.spec.js
│       ├── cart-flow.spec.js
│       └── login.spec.js
├── api-tests/
│   ├── config/
│   │   └── api.config.js
│   ├── schemas/
│   │   └── booking.schema.js
│   └── specs/
│       ├── auth.spec.js
│       └── booking.spec.js
├── event-tests/
│   ├── schemas/
│   │   └── booking-created-event.schema.js
│   └── specs/
│       └── kafka-booking-created.spec.js
├── docker-compose.kafka.yml
├── .env.example
├── package.json
└── README.md
```

## Aplicación móvil bajo prueba

Las pruebas móviles utilizan el APK público de la aplicación de demostración de SauceLabs para Android
(`my-demo-app.apk`, incluido en `apps/`). El APK original puede descargarse desde el repositorio oficial
de [SauceLabs My Demo App Android](https://github.com/saucelabs/my-demo-app-android/releases).

Escenarios móviles cubiertos:

1. Validación del inicio de la aplicación.
2. Inicio de sesión exitoso con credenciales válidas.
3. Validación de inicio de sesión negativo con credenciales de usuario bloqueado.
4. Navegación del catálogo a los detalles del producto.
5. Agregar producto al carrito.
6. Validar el producto seleccionado en el carrito.

## API bajo prueba

Las pruebas de la API utilizan Restful Booker.

Escenarios de API cubiertos:

1. Generar token de autenticación.
2. Crear reserva.
3. Actualizar reserva.
4. Validar códigos de estado de respuesta.
5. Validar esquema JSON.
6. Validar SLA inferior a 1,5 segundos.

## Requisitos previos

Instale las siguientes herramientas antes de ejecutar el proyecto:

* Node.js (v18 o superior recomendado)
* Java JDK
* Android Studio / Android SDK
* Appium
* Emulador de Android

Validar las instalaciones:

```bash
node -v
npm -v
java -version
adb --version
appium -v
```

## Instalar dependencias

```bash
npm install
```

## Variables de entorno

Copia el archivo de ejemplo y ajusta los valores según tu entorno local:

```bash
copy .env.example .env
```

Variables disponibles (todas son opcionales; si no se definen, se usan los valores por defecto indicados):

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `API_BASE_URL` | `https://restful-booker.herokuapp.com` | URL base de la API bajo prueba |
| `APPIUM_HOST` | `127.0.0.1` | Host donde corre el servidor Appium |
| `APPIUM_PORT` | `4723` | Puerto del servidor Appium |
| `ANDROID_DEVICE_NAME` | `Android Emulator` | Nombre del dispositivo/emulador Android |
| `KAFKA_ENABLED` | `false` | Habilita las pruebas opcionales de Kafka |
| `KAFKA_BROKER` | `localhost:9092` | Dirección del broker Kafka/Redpanda |
| `KAFKA_TOPIC` | `booking-created` | Prefijo del tópico usado en las pruebas |

## Iniciar el servidor Appium

Ejecute Appium en una terminal aparte:

```bash
appium
```

URL del servidor esperada:

```text
http://127.0.0.1:4723/
```

## Iniciar el emulador de Android

Validar la conexión del dispositivo:

```bash
adb devices
```

Resultado esperado:

```text
emulator-5554   device
```

## Ejecutar pruebas móviles

```bash
npm run test:mobile
```

## Ejecutar pruebas de API

```bash
npm run test:api
```

## Ejecutar todas las pruebas

```bash
npm run test:all
```

## Generar informe de Allure

```bash
npm run report:generate
npm run report:open
```

> Nota: el reporte de Allure actualmente solo recopila resultados de la suite móvil (WebdriverIO).
> Las suites de API y Kafka (Playwright) se ejecutan y reportan por consola/HTML nativo de Playwright.

## Notas sobre la automatización móvil

Durante la automatización móvil, se inspeccionó la jerarquía de la interfaz de usuario de Android mediante:

```bash
adb shell uiautomator dump
```

Esto ayudó a identificar selectores estables como:

* `com.saucelabs.mydemoapp.android:id/productIV`
* `com.saucelabs.mydemoapp.android:id/titleTV`
* `com.saucelabs.mydemoapp.android:id/nameET`
* `com.saucelabs.mydemoapp.android:id/passwordET`
* `com.saucelabs.mydemoapp.android:id/loginBtn`

El conjunto de pruebas prioriza identificadores de recursos (`resource-id`) y accessibility id sobre XPath
absoluto. Todos los selectores fueron validados contra volcados reales de `adb shell uiautomator dump`
(catálogo, carrito y menú).

## Estrategia de SLA de la API

El endpoint `/auth` incluye una solicitud de precalentamiento antes de medir el SLA. Esto evita incluir el
tiempo de arranque en frío de DNS, TLS o API públicas en la aserción del tiempo de respuesta del endpoint.

La solicitud medida debe ser inferior a:

```text
1500 ms
```

Resultado de ejemplo:

```text
Tiempo de respuesta de autenticación: 445 ms
```

## Pruebas opcionales de eventos de Kafka

Este proyecto incluye una prueba opcional de contrato de eventos compatible con Kafka que utiliza Redpanda,
KafkaJS, Playwright y AJV.

La prueba de eventos valida un evento `booking.created` mediante:

* La creación de un tópico compatible con Kafka.
* La publicación de un evento `booking.created`.
* El consumo del evento desde Kafka.
* La validación del evento consumido con respecto a un contrato de esquema JSON.
* La confirmación de campos clave de negocio como `eventType`, `bookingId` y los datos del cliente.

Las pruebas de Kafka son opcionales y no se ejecutan a menos que se habiliten explícitamente.

### Iniciar Kafka / Redpanda

```bash
docker compose -f docker-compose.kafka.yml up -d
```

### Ejecutar pruebas de eventos de Kafka

En Windows (cmd):

```bash
set KAFKA_ENABLED=true
npm run test:events
```

En macOS/Linux:

```bash
KAFKA_ENABLED=true npm run test:events
```

Resultado esperado:

```text
1 passed
```

Si `KAFKA_ENABLED` no está configurado como `true`, la prueba de Kafka se omite intencionalmente, ya que se
trata de una ruta de ejecución adicional (bonus).

## Resultados de las pruebas

Resumen de la última ejecución local:

```text
API:
3 superadas

Móvil:
3 archivos de especificación superados
4 escenarios móviles superados
```

## Autor

* Author: David Rodríguez Castillo
* Role: Senior QA Engineer Automation Functional