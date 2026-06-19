\# Desafío AVL de Automatización de QA



Este repositorio contiene una solución de pruebas automatizadas para un desafío de Ingeniero de Automatización de QA.



El proyecto incluye:



\* Pruebas de automatización móvil con Appium, WebdriverIO y UiAutomator2.



\* Pruebas de automatización de API con Playwright.



\* Validación de esquema JSON con AJV.



\* Validación de SLA para tiempos de respuesta de API inferiores a 1,5 segundos.



\* Implementación del modelo de objetos de página para pruebas móviles.



\* Compatibilidad con informes de Allure.



\## Tecnologías utilizadas



\* Node.js

\* Java

\* Android SDK

\* Appium

\* WebdriverIO

\* UiAutomator2

\* Playwright Test

\* AJV

\* Allure Reporter

\* dotenv



\## Estructura del proyecto



```texto

qa-automation-avl-challenge/

├── apps/

│ └── my-demo-app.apk

├── mobile-tests/

│ ├── config/

│ │ └── wdio.android.conf.js

│ ├── page-objects/

│ │ ├── CartPage.js

│ │ ├── CatalogPage.js

│ │ ├── LoginPage.js

│ │ ├── MenuPage.js

│ │ └── ProductDetailPage.js

│ └── specs/

│ ├── app-launch.spec.js

│ ├── cart-flow.spec.js

│ └── login.spec.js

├── api-tests/

│ ├── config/

│ │ └── api.config.js

│ ├── schemas/

│ │ └── booking.schema.js

│ └── specs/

│ ├── auth.spec.js

│ └── booking.spec.js

├── allure-results/

├── reports/

├── package.json

└── README.md

```



\## Aplicación móvil bajo prueba



Las pruebas móviles utilizan el APK público de la aplicación de demostración de SauceLabs para Android.



Escenarios móviles cubiertos:



1\. Validación del inicio de la aplicación.



2\. Inicio de sesión exitoso con credenciales válidas.



3\. Validación de inicio de sesión negativo con credenciales de usuario bloqueado.



4\. Navegación del catálogo a los detalles del producto.



5\. Agregar producto al carrito.



6\. Validar el producto seleccionado en el carrito.



\## API bajo prueba



Las pruebas de la API utilizan Restful Booker.



Escenarios de API cubiertos:



1\. Generar token de autenticación.



2\. Crear reserva.



3\. Actualizar reserva.



4\. Validar códigos de estado de respuesta.



5\. Validar esquema JSON.



6\. Validar SLA inferior a 1,5 segundos.



\## Requisitos previos



Instale las siguientes herramientas antes de ejecutar el proyecto:



\* Node.js

\* Java JDK

\* Android Studio / Android SDK

\* Appium

\* Emulador de Android



Validar las instalaciones:



```bash

node -v

npm -v

java -version

adb --version

appium -v

```



\## Instalar dependencias



```bash

npm install

```



\## Iniciar el servidor Appium



Ejecute Appium en una terminal aparte:



```bash

appium

```



URL del servidor esperada:



```text

http://127.0.0.1:4723/

```



\## Iniciar el emulador de Android



Validar la conexión del dispositivo:



```bash

adb devices

```



Resultado esperado:



```text

emulator-5554 Dispositivo

```



\## Ejecutar pruebas móviles



```bash

npm run test:mobile

```



\## Ejecutar pruebas de API



```bash

npm run test:api

```



\## Ejecutar todas las pruebas



```bash

npm run test:all

```



\## Generar informe de Allure



```bash

npm run report:generate

npm run report:open

```



\## Resultados de las pruebas



Resumen de la última ejecución:



```texto

API:

3 superadas



Móvil:

3 archivos de especificación superados

4 escenarios móviles superados

```



\## Notas sobre la automatización móvil



Durante la automatización móvil, se inspeccionó la jerarquía de la interfaz de usuario de Android mediante:



```bash

adb shell uiautomator dump

```



Esto ayudó a identificar selectores estables como:



\* `com.saucelabs.mydemoapp.android:id/productIV`

\* `com.saucelabs.mydemoapp.android:id/cartBt`

\* `com.saucelabs.mydemoapp.android:id/nameET`

\* `com.saucelabs.mydemoapp.android:id/passwordET`

\* `com.saucelabs.mydemoapp.android:id/loginBtn`



El conjunto de pruebas evita el uso de XPath absoluto y utiliza identificadores de recursos, identificadores de accesibilidad y el selector de interfaz de usuario de Android siempre que sea posible.



\## Estrategia de SLA de la API



El endpoint `/auth` incluye una solicitud de precalentamiento antes de medir el SLA. Esto evita incluir el tiempo de arranque en frío de DNS, TLS o API públicas en la aserción del tiempo de respuesta del endpoint.



La solicitud medida debe ser inferior a:



```texto

1500 ms

```



Resultado de ejemplo:



```texto

Tiempo de respuesta de autenticación: 445 ms

```



\## Autor



Senior QA Enginner Automation Funtional - David Rodríguez Castillo

