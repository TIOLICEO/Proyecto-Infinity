# ✨ Asistente de Escritura Inteligente con IA (Python + Tkinter + Gemini)

Un asistente de autocompletado global en tiempo real para escritorio desarrollado en **Python**. Escucha de forma segura lo que escribes en cualquier aplicación del sistema operativo y despliega una interfaz flotante minimalista junto a tu cursor con sugerencias contextuales impulsadas por **Google Gemini IA** o mediante un **Motor Predictivo Local (Offline)**.

---

## 🚀 Características Principales

* **Autocompletado Global**: Funciona sobre cualquier ventana activa (Bloc de notas, navegadores, editores de texto, Word, etc.) y cuenta con un área *Sandbox* integrada para pruebas rápidas.
* **Motor Híbrido (IA Online + Respaldo Offline)**:
  * **Modo IA Gemini**: Conecta con el modelo `gemini-2.5-flash` para ofrecer continuaciones de frases naturales basadas en el contexto de tus últimas oraciones.
  * **Modo Offline**: Diccionario predictivo local ultrarrápido que funciona sin internet ni claves API.
* **Inyección Inteligente de Texto**: Al presionar `Tab` o `Enter`, el asistente calcula y borra automáticamente los caracteres parciales y los reemplaza por la sugerencia seleccionada sin generar bucles recursivos.
* **Arquitectura Multihilo Segura**: Utiliza *Debounce* configurable, bloqueo de hilos (`threading.Lock`) y *Backoff Exponencial* ante fallos de red para no congelar jamás la interfaz gráfica.
* **Interfaz Oscura Moderna**: Panel de control estilo IDE oscuro y ventana emergente sin bordes con guía de atajos integrada.

---

## 🛠️ Requisitos e Instalación

1. **Clonar este repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/asistente-escritura-ia.git
   cd asistente-escritura-ia
   ```

2. **Instalar las dependencias:**
   El proyecto utiliza bibliotecas nativas de Python (`tkinter`, `urllib`, `json`, `threading`) y únicamente requiere `pynput` para el control global de periféricos:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecutar la aplicación:**
   ```bash
   python asistente_ia_completo.py
   ```

---

## ⌨️ Cómo Usarlo

1. Abre la aplicación ejecutando `asistente_ia_completo.py`.
2. Elige el **Modo de operación**:
   * **IA Gemini 2.5**: Pega tu API Key de Google AI Studio y haz clic en **Guardar Config**.
   * **Diccionario Local (Offline)**: Ideal para probar de inmediato escribiendo palabras como `hola`, `como`, `py`, `pro`, `gra`, `tk`.
3. Haz clic en **"Activar Asistente Global"**.
4. Empieza a escribir en el cuadro de texto de prueba o en cualquier otra aplicación:
   * Usa las flechas **`↑`** / **`↓`** para moverte entre las sugerencias.
   * Presiona **`Tab`** o **`Enter`** para autocompletar la palabra o frase.
   * Presiona **`Esc`** para ocultar el menú flotante.

---

## 📦 Compilar como Ejecutable (.exe)

Si deseas distribuir la aplicación en Windows sin requerir que el usuario tenga Python instalado, puedes empaquetarla con `PyInstaller`:

```bash
pip install pyinstaller
pyinstaller --name AsistenteEscrituraIA --windowed --onefile asistente_ia_completo.py
```
El archivo ejecutable final aparecerá dentro de la carpeta `dist/`.