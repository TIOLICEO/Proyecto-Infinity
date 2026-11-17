import tkinter as tk
from tkinter import font
import threading
import time
import json
import os
from collections import deque
import urllib.request
import urllib.error
from pynput import mouse, keyboard

CONFIG_FILE = "config.json"

# --- MOTOR DE PREDICCIÓN HÍBRIDO (GEMINI IA + LOCAL OFFLINE) ---
class PredictionEngine:
    """
    Gestiona las predicciones de texto. Soporta dos modos:
    1. 'gemini': Conecta con la API oficial de Google Gemini 2.5 Flash con Backoff Exponencial.
    2. 'offline': Motor local rápido basado en diccionarios y prefijos (ideal para pruebas sin API Key).
    """
    def __init__(self):
        self.api_key = ""
        self.mode = "gemini"  # 'gemini' o 'offline'
        
        # Diccionario base para el modo offline / respaldo
        self.offline_dictionary = {
            "hola": ["cómo estás", "mundo", "a todos", "buenos días"],
            "como": ["estás", "va todo", "funciona esto", "puedo ayudarte"],
            "cómo": ["estás", "va todo", "funciona esto", "puedo ayudarte"],
            "py": ["python", "pynput", "pygame", "pyinstaller"],
            "pro": ["proyecto", "programación", "problema", "proceso"],
            "es": ["esto es una prueba", "estoy escribiendo", "excelente"],
            "gra": ["gracias", "gracias por tu ayuda", "gran trabajo"],
            "asu": ["asunto importante", "asumir el reto"],
            "tk": ["tkinter", "toplevel", "textbox"],
            "intel": ["inteligencia artificial", "inteligente", "interesante"]
        }

    def predict_offline(self, text):
        """Genera sugerencias instantáneas sin conexión a internet."""
        clean_text = text.strip().lower()
        if not clean_text:
            return []
        
        words = clean_text.split(' ')
        last_word = words[-1]

        # Buscar coincidencias exactas o por prefijo
        for prefix, suggestions in self.offline_dictionary.items():
            if last_word == prefix or last_word.startswith(prefix):
                return suggestions[:3]

        # Sugerencias genéricas de completado si no hay coincidencia en el diccionario
        if len(last_word) >= 2:
            return [f"{last_word}mente", f"{last_word}ción", f"{last_word}do"]
        return []

    def predict_next_phrases(self, text, context_history="", error_callback=None):
        """
        Obtiene sugerencias según el modo configurado.
        """
        if not text.strip():
            return []

        if self.mode == "offline":
            return self.predict_offline(text)

        if not self.api_key:
            if error_callback:
                error_callback("Modo IA activo pero falta API Key. Usando respaldo local.")
            return self.predict_offline(text)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={self.api_key}"
        
        prompt = (
            f"Actúa como un motor de autocompletado en tiempo real. "
            f"Contexto previo: '{context_history}'. "
            f"Texto actual en curso: '{text}'.\n"
            f"Devuelve entre 1 y 3 posibles continuaciones cortas (máximo 4 palabras cada una) "
            f"para completar la última palabra o continuar la frase de forma natural.\n"
            f"REGLA ESTRICTA: Responde ÚNICAMENTE con un array JSON de strings "
            f"(ejemplo: [\"opción 1\", \"opción 2\", \"opción 3\"]). Sin markdown ni explicaciones."
        )

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.3
            }
        }

        delays = [1, 2, 4, 8, 16]
        
        for attempt, delay in enumerate(delays + [0]):
            try:
                data_encoded = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(
                    url,
                    data=data_encoded,
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )

                with urllib.request.urlopen(req, timeout=5) as response:
                    res_raw = response.read().decode('utf-8')
                    res_data = json.loads(res_raw)
                    
                    raw_text = res_data['candidates'][0]['content']['parts'][0]['text']
                    suggestions = json.loads(raw_text.strip())
                    
                    if isinstance(suggestions, list):
                        return [str(s).strip() for s in suggestions[:3] if str(s).strip()]
                    return []

            except Exception as e:
                if attempt < len(delays):
                    time.sleep(delay)
                else:
                    print(f"Error en API Gemini: {e}. Activando fallback offline.")
                    if error_callback:
                        error_callback("Error de red/API. Usando sugerencias locales.")
                    return self.predict_offline(text)
        return []


# --- INTERFAZ FLOTANTE DE SUGERENCIAS ---
class SuggestionUI:
    """
    Ventana flotante oscura y sin bordes que se posiciona cerca
    del cursor para simular un menú nativo de autocompletado.
    Incluye barra inferior informativa con atajos de teclado.
    """
    def __init__(self, parent):
        self.parent = parent
        self.window = tk.Toplevel(parent)
        self.window.overrideredirect(True)
        self.window.attributes('-topmost', True)
        self.window.configure(bg="#2D2D30", padx=1, pady=1)
        
        listbox_font = font.Font(family="Segoe UI", size=11)
        self.listbox = tk.Listbox(
            self.window, 
            font=listbox_font, 
            bg="#1E1E1E", 
            fg="#D4D4D4",
            highlightthickness=0,
            selectbackground="#007ACC",
            selectforeground="#FFFFFF",
            activestyle="none",
            borderwidth=4,
            relief="flat",
            height=3,
            width=28
        )
        self.listbox.pack(expand=True, fill="both")

        # Pie de página con ayuda visual de atajos
        footer_font = font.Font(family="Segoe UI", size=8)
        self.footer = tk.Label(
            self.window,
            text="[↑/↓] Navegar  •  [Tab/Enter] Aceptar  •  [Esc] Cerrar",
            font=footer_font,
            bg="#252526",
            fg="#858585",
            padx=6,
            pady=2,
            anchor="w"
        )
        self.footer.pack(fill="x")
        self.window.withdraw()

    def is_visible(self):
        """Comprueba si el menú se está mostrando en pantalla."""
        return self.window.winfo_viewable()

    def select_next(self):
        """Baja en la lista de sugerencias."""
        if not self.is_visible(): return
        current = self.listbox.curselection()
        if not current:
            self.listbox.selection_set(0)
            return
        next_idx = (current[0] + 1) % self.listbox.size()
        self.listbox.selection_clear(0, tk.END)
        self.listbox.selection_set(next_idx)
        self.listbox.activate(next_idx)

    def select_previous(self):
        """Sube en la lista de sugerencias."""
        if not self.is_visible(): return
        current = self.listbox.curselection()
        if not current:
            self.listbox.selection_set(tk.END)
            return
        prev_idx = (current[0] - 1 + self.listbox.size()) % self.listbox.size()
        self.listbox.selection_clear(0, tk.END)
        self.listbox.selection_set(prev_idx)
        self.listbox.activate(prev_idx)

    def get_selected(self):
        """Retorna el texto de la sugerencia seleccionada actualmente."""
        if self.is_visible() and self.listbox.curselection():
            return self.listbox.get(self.listbox.curselection()[0])
        return None


# --- SISTEMA DE ASISTENCIA Y ESCUCHA GLOBAL ---
class WritingAssistant:
    """
    Controla el análisis en segundo plano de lo que escribe el usuario,
    mantiene un historial de contexto y ejecuta la inyección automática de palabras.
    """
    def __init__(self, app_callback):
        self.app_callback = app_callback
        self.current_buffer = ""
        self.context_history = deque(maxlen=5)  # Guarda las últimas 5 frases para mayor contexto
        self.last_mouse_pos = (0, 0)
        self.prediction_timer = None
        self.debounce_delay = 0.4
        self.lock = threading.Lock()
        
        self.is_typing_suggestion = False 
        
        self.engine = PredictionEngine()
        self.keyboard_controller = keyboard.Controller()
        
        self.key_listener = None
        self.mouse_listener = None
        self.ui = None

    def start(self, suggestion_ui, api_key, mode="gemini", debounce=0.4):
        """Enciende la escucha activa de ratón y teclado con los parámetros elegidos."""
        self.ui = suggestion_ui
        self.engine.api_key = api_key
        self.engine.mode = mode
        self.debounce_delay = debounce
        
        if not self.key_listener:
            self.mouse_listener = mouse.Listener(on_move=self.on_mouse_move)
            self.key_listener = keyboard.Listener(on_press=self.handle_key_press)
            
            self.mouse_listener.start()
            self.key_listener.start()
            modo_str = "IA Gemini" if mode == "gemini" else "Local Offline"
            self.app_callback(f"Activo ({modo_str}) - Escuchando teclado...")

    def stop(self):
        """Apaga los listeners de forma limpia."""
        if self.key_listener:
            self.mouse_listener.stop()
            self.key_listener.stop()
            self.mouse_listener = None
            self.key_listener = None
            if self.prediction_timer:
                self.prediction_timer.cancel()
            if self.ui:
                self.parent_after_run(self.ui.hide)
            self.app_callback("Asistente Detenido.")

    def parent_after_run(self, func, *args):
        """Ejecuta una función de Tkinter de forma segura desde otro hilo."""
        self.ui.parent.after(0, func, *args)

    def on_mouse_move(self, x, y):
        """Rastrea de forma pasiva las coordenadas del cursor físico."""
        self.last_mouse_pos = (x, y)

    def handle_key_press(self, key):
        """
        Escucha cada tecla presionada del sistema.
        Filtra y decide si actualizar el buffer o navegar por el menú.
        """
        if self.is_typing_suggestion:
            return

        with self.lock:
            if self.prediction_timer:
                self.prediction_timer.cancel()

            if self.ui and self.ui.is_visible():
                if key == keyboard.Key.down:
                    self.parent_after_run(self.ui.select_next)
                    return
                elif key == keyboard.Key.up:
                    self.parent_after_run(self.ui.select_previous)
                    return
                elif key == keyboard.Key.esc:
                    self.parent_after_run(self.ui.hide)
                    return
                elif key == keyboard.Key.tab or key == keyboard.Key.enter:
                    extra_backspace = 1 
                    threading.Thread(target=self.apply_suggestion, args=(extra_backspace,), daemon=True).start()
                    return

            key_processed = False
            try:
                if hasattr(key, 'char') and key.char:
                    self.current_buffer += key.char
                    key_processed = True
                    # Si el usuario termina una oración, guardamos en el historial de contexto
                    if key.char in ['.', '!', '?', '\n']:
                        self.context_history.append(self.current_buffer.strip())
                        self.current_buffer = ""
                elif key == keyboard.Key.space:
                    self.current_buffer += ' '
                    key_processed = True
                elif key == keyboard.Key.backspace:
                    self.current_buffer = self.current_buffer[:-1]
                    self.parent_after_run(self.ui.hide)
                    key_processed = True
            except AttributeError:
                pass

            if key_processed and self.current_buffer.strip():
                self.prediction_timer = threading.Timer(self.debounce_delay, self.trigger_prediction)
                self.prediction_timer.start()
            elif not self.current_buffer.strip():
                self.parent_after_run(self.ui.hide)

    def trigger_prediction(self):
        """Llama al motor de IA en segundo plano para no congelar el sistema del usuario."""
        with self.lock:
            buffer_to_send = self.current_buffer
            context_str = " ".join(self.context_history)
            
        def fetch_task():
            predictions = self.engine.predict_next_phrases(
                buffer_to_send,
                context_history=context_str,
                error_callback=lambda msg: self.parent_after_run(self.app_callback, msg)
            )
            if predictions:
                self.parent_after_run(self.ui.show, predictions, self.last_mouse_pos[0], self.last_mouse_pos[1])
            else:
                self.parent_after_run(self.ui.hide)

        threading.Thread(target=fetch_task, daemon=True).start()

    def apply_suggestion(self, extra_chars_written):
        """
        Borra el texto parcialmente escrito y escribe la sugerencia seleccionada.
        """
        with self.lock:
            suggestion = self.ui.get_selected()
            if not suggestion:
                return

            self.parent_after_run(self.ui.hide)
            self.is_typing_suggestion = True

            # Si el buffer NO termina en espacio, reemplazamos la palabra parcial que se estaba escribiendo.
            # Si termina en espacio, simplemente agregamos la sugerencia completa después del espacio.
            replacing_partial_word = not self.current_buffer.endswith(' ')
            parts = self.current_buffer.strip().split(' ')
            last_word_typed = parts[-1] if (parts and replacing_partial_word) else ""

            total_backspaces = len(last_word_typed) + extra_chars_written

            for _ in range(total_backspaces):
                self.keyboard_controller.press(keyboard.Key.backspace)
                self.keyboard_controller.release(keyboard.Key.backspace)
                time.sleep(0.01)

            time.sleep(0.04)

            self.keyboard_controller.type(suggestion + ' ')

            if replacing_partial_word and parts:
                parts[-1] = suggestion
                self.current_buffer = ' '.join(parts) + ' '
            else:
                self.current_buffer = self.current_buffer + suggestion + ' '

            self.is_typing_suggestion = False


# --- INTERFAZ GRÁFICA PRINCIPAL (TKINTER) ---
class MainApplication:
    """
    Ventana de administración y configuración del usuario.
    Incluye persistencia en config.json, selector de modo (IA/Offline) y Sandbox.
    """
    def __init__(self, root):
        self.root = root
        self.root.title("Asistente de Escritura Inteligente Pro")
        self.root.geometry("500x520")
        self.root.configure(bg="#1E1E1E")
        self.root.resizable(False, False)

        self.assistant = WritingAssistant(self.update_status_bar)
        self.suggestion_ui = SuggestionUI(self.root)
        self.is_running = False

        font_title = font.Font(family="Segoe UI", size=13, weight="bold")
        font_body = font.Font(family="Segoe UI", size=10)
        font_small = font.Font(family="Segoe UI", size=9)
        
        # TÍTULO
        title_label = tk.Label(
            root, 
            text="ASISTENTE DE ESCRITURA INTELIGENTE", 
            font=font_title, 
            bg="#1E1E1E", 
            fg="#007ACC"
        )
        title_label.pack(pady=(12, 4))

        # MARCO DE CONFIGURACIÓN
        config_frame = tk.LabelFrame(
            root, 
            text=" Configuración del Motor ", 
            font=font_body, 
            bg="#1E1E1E", 
            fg="#CCCCCC", 
            padx=12, 
            pady=8,
            relief="solid",
            borderwidth=1
        )
        config_frame.pack(fill="x", padx=15, pady=5)

        # Selector de modo
        self.mode_var = tk.StringVar(value="gemini")
        mode_frame = tk.Frame(config_frame, bg="#1E1E1E")
        mode_frame.pack(fill="x", pady=(0, 6))
        
        tk.Label(mode_frame, text="Modo:", font=font_small, bg="#1E1E1E", fg="#A0A0A0").pack(side="left")
        tk.Radiobutton(
            mode_frame, text="IA Gemini 2.5 (Online)", variable=self.mode_var, value="gemini",
            bg="#1E1E1E", fg="#FFFFFF", selectcolor="#2D2D2D", activebackground="#1E1E1E", font=font_small
        ).pack(side="left", padx=10)
        tk.Radiobutton(
            mode_frame, text="Diccionario Local (Offline)", variable=self.mode_var, value="offline",
            bg="#1E1E1E", fg="#FFFFFF", selectcolor="#2D2D2D", activebackground="#1E1E1E", font=font_small
        ).pack(side="left")

        # Entrada de API Key
        tk.Label(
            config_frame, 
            text="Gemini API Key (Opcional en modo Offline):", 
            font=font_small, 
            bg="#1E1E1E", 
            fg="#A0A0A0"
        ).pack(anchor="w")

        entry_row = tk.Frame(config_frame, bg="#1E1E1E")
        entry_row.pack(fill="x", pady=4)

        self.api_entry = tk.Entry(
            entry_row, 
            font=font_body, 
            bg="#2D2D2D", 
            fg="#FFFFFF", 
            show="*", 
            insertbackground="white", 
            relief="flat"
        )
        self.api_entry.pack(fill="x", side="left", expand=True, ipady=4)
        
        self.reveal_btn = tk.Button(
            entry_row, 
            text="Ver", 
            font=font_small,
            bg="#3E3E42", 
            fg="white", 
            relief="flat", 
            command=self.toggle_api_visibility
        )
        self.reveal_btn.pack(side="left", padx=(5, 0), ipady=2)

        self.save_btn = tk.Button(
            entry_row, 
            text="Guardar Config", 
            font=font_small,
            bg="#2D7D46", 
            fg="white", 
            relief="flat", 
            command=self.save_config
        )
        self.save_btn.pack(side="right", padx=(5, 0), ipady=2)

        # Control de velocidad de respuesta (Debounce)
        debounce_frame = tk.Frame(config_frame, bg="#1E1E1E")
        debounce_frame.pack(fill="x", pady=(4, 0))
        tk.Label(debounce_frame, text="Retardo de predicción (seg):", font=font_small, bg="#1E1E1E", fg="#A0A0A0").pack(side="left")
        self.debounce_spin = tk.Spinbox(
            debounce_frame, from_=0.1, to=2.0, increment=0.1, width=5,
            font=font_small, bg="#2D2D2D", fg="white", buttonbackground="#3E3E42", relief="flat"
        )
        self.debounce_spin.delete(0, tk.END)
        self.debounce_spin.insert(0, "0.4")
        self.debounce_spin.pack(side="left", padx=8)

        # BOTÓN DE ENCENDIDO / APAGADO
        self.btn_toggle = tk.Button(
            root, 
            text="Activar Asistente Global", 
            font=font_title, 
            bg="#0E639C", 
            fg="white", 
            relief="flat", 
            command=self.toggle_assistant_state,
            cursor="hand2"
        )
        self.btn_toggle.pack(fill="x", padx=15, pady=8, ipady=5)

        # ÁREA DE PRUEBA (SANDBOX)
        test_frame = tk.LabelFrame(
            root, 
            text=" Sandbox de Prueba (Escribe aquí o en cualquier app de tu PC) ", 
            font=font_body, 
            bg="#1E1E1E", 
            fg="#CCCCCC", 
            padx=10, 
            pady=5,
            relief="solid",
            borderwidth=1
        )
        test_frame.pack(fill="both", expand=True, padx=15, pady=(2, 12))

        self.text_test_area = tk.Text(
            test_frame, 
            font=font_body, 
            bg="#252526", 
            fg="#D4D4D4", 
            insertbackground="white", 
            relief="flat",
            wrap="word",
            height=6
        )
        self.text_test_area.pack(fill="both", expand=True, pady=4)

        # BARRA DE ESTADO INFERIOR
        self.status_bar = tk.Label(
            root, 
            text="Estado: Listo. Configura tu API Key o elige el Modo Offline.", 
            bd=1, 
            relief="sunken", 
            anchor="w", 
            bg="#007ACC", 
            fg="white", 
            font=font_small,
            padx=8,
            pady=3
        )
        self.status_bar.pack(fill="x", side="bottom")

        # Cargar configuración previa o variable de entorno
        self.load_config()
        self.root.protocol("WM_DELETE_WINDOW", self.on_close_application)

    def load_config(self):
        """Carga la configuración desde config.json o variables de entorno."""
        env_key = os.getenv("GEMINI_API_KEY", "")
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    saved_key = data.get("api_key", env_key)
                    if saved_key:
                        self.api_entry.insert(0, saved_key)
                    self.mode_var.set(data.get("mode", "gemini"))
                    self.debounce_spin.delete(0, tk.END)
                    self.debounce_spin.insert(0, str(data.get("debounce", 0.4)))
                    return
            except Exception:
                pass
        if env_key:
            self.api_entry.insert(0, env_key)

    def save_config(self):
        """Guarda las preferencias actuales en un archivo local config.json."""
        try:
            debounce_val = float(self.debounce_spin.get())
        except ValueError:
            debounce_val = 0.4

        data = {
            "api_key": self.api_entry.get().strip(),
            "mode": self.mode_var.get(),
            "debounce": debounce_val
        }
        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            self.update_status_bar("Configuración guardada correctamente en config.json")
        except Exception as e:
            self.update_status_bar(f"No se pudo guardar config: {e}")

    def toggle_api_visibility(self):
        """Muestra u oculta los caracteres de la clave API."""
        if self.api_entry.cget('show') == '*':
            self.api_entry.config(show='')
            self.reveal_btn.config(text="Ocultar")
        else:
            self.api_entry.config(show='*')
            self.reveal_btn.config(text="Ver")

    def toggle_assistant_state(self):
        """Enciende o apaga el asistente verificando el modo seleccionado."""
        mode = self.mode_var.get()
        api_key = self.api_entry.get().strip()
        
        if mode == "gemini" and not api_key:
            self.update_status_bar("Aviso: Sin API Key en modo Gemini. Cambiando a modo Offline.")
            self.mode_var.set("offline")
            mode = "offline"

        try:
            debounce_val = float(self.debounce_spin.get())
        except ValueError:
            debounce_val = 0.4

        self.is_running = not self.is_running
        
        if self.is_running:
            self.assistant.start(self.suggestion_ui, api_key, mode=mode, debounce=debounce_val)
            self.btn_toggle.config(text="Detener Asistente Global", bg="#D13438")
            self.api_entry.config(state="disabled")
        else:
            self.assistant.stop()
            self.btn_toggle.config(text="Activar Asistente Global", bg="#0E639C")
            self.api_entry.config(state="normal")

    def update_status_bar(self, text):
        """Actualiza el mensaje de la barra inferior de estado."""
        self.status_bar.config(text=f"Estado: {text}")

    def on_close_application(self):
        """Detiene hilos y listeners antes de cerrar la ventana."""
        if self.is_running:
            self.assistant.stop()
        self.root.destroy()


# --- PUNTO DE ENTRADA ---
if __name__ == '__main__':
    window = tk.Tk()
    app = MainApplication(window)
    window.mainloop()