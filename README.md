# ♾️ Proyecto Infinity

Diseño y prototipo de **INFINITY OS**: un concepto de sistema de comunicación y finanzas *privacy-first* con red **mesh peer-to-peer** (BLE / Wi-Fi Direct / LoRa), pensado para funcionar sin depender de proveedores centralizados.

> **Estado: pre-alfa / concepto.** Hoy el repositorio contiene la documentación de diseño y un prototipo de interfaz (simulador). El protocolo mesh, la criptografía post-cuántica, la billetera y el hardware descritos en el plan **todavía no están implementados**.

## Contenido

| Carpeta | Qué hay |
|---|---|
| [`docs/`](docs/) | [Plan maestro 2026-2036](docs/PLAN_MAESTRO.md) y documento de código fuente |
| [`prototype/`](prototype/) | `InfinityApp.tsx`: simulador de la interfaz de INFINITY OS (React + Tailwind + `lucide-react`) |
| [`tools/writing-assistant/`](tools/writing-assistant/) | Herramienta independiente: asistente de autocompletado global (Python + Tkinter + Gemini / modo offline) |

## Ideas centrales del diseño

- **Mesh-First:** los dispositivos buscan conexión local directa antes de usar la red de telecomunicaciones; los mensajes "saltan" entre dispositivos.
- **Cifrado post-cuántico (objetivo):** Kyber-1024 + Doble Ratchet asíncrono.
- **Módulos planificados:** GhostComm (chat), SecureMail, InfinityWallet, InfinityID, protocolos de resiliencia (Fénix, Bastión).
- **Capas previstas:** núcleo en Rust, UI en React/Flutter, nodos ESP32-S3 + LoRa.

Detalle completo en el [plan maestro](docs/PLAN_MAESTRO.md).

## Ejecutar el prototipo de UI

Requiere Node.js. Con un proyecto React + Tailwind (por ejemplo Vite):

```bash
npm install lucide-react
```

Copia `prototype/InfinityApp.tsx` a tu proyecto e impórtalo como componente principal (`App`). También funciona pegado en CodeSandbox o StackBlitz.

## Hoja de ruta (sin fechas comprometidas)

- [ ] Empaquetar el prototipo como app Vite ejecutable (`npm run dev`)
- [ ] Especificación técnica del protocolo mesh
- [ ] Prueba de concepto de mensajería BLE entre dos dispositivos
- [ ] Integrar una librería de cifrado post-cuántico auditada (no implementar criptografía propia)

## Contribuir

Se aceptan issues y pull requests. Antes de una PR grande, abre un issue para discutir el enfoque.

## Licencia

[MIT](LICENSE).
