class WasmTerminal {
  private container: HTMLElement;
  private output!: HTMLElement;
  private input!: HTMLInputElement;
  private history: string[] = [];
  private historyIndex: number = -1;
  private wasmInstance: WebAssembly.Instance | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    this.createTerminalUI();
    this.loadWasmModule();
  }

  private createTerminalUI(): void {
    // Create terminal header
    const header = document.createElement("div");
    header.className = "terminal-header";
    header.innerHTML = `
            <div class="terminal-title">Tijo's Terminal</div>
            <div class="terminal-dots">
                <div class="terminal-dot terminal-dot-red"></div>
                <div class="terminal-dot terminal-dot-yellow"></div>
                <div class="terminal-dot terminal-dot-green"></div>
            </div>
        `;
    this.container.appendChild(header);

    // Create terminal output area
    this.output = document.createElement("div");
    this.output.className = "terminal-output";
    this.container.appendChild(this.output);

    // Add welcome message
    this.addOutput("Welcome to Tijo's WebAssembly Terminal!");
    this.addOutput('Type "help" to see available commands.');

    // Create terminal input area
    const inputContainer = document.createElement("div");
    inputContainer.className = "terminal-input-container";

    const prompt = document.createElement("span");
    prompt.className = "terminal-prompt";
    prompt.textContent = "> ";
    inputContainer.appendChild(prompt);

    this.input = document.createElement("input");
    this.input.className = "terminal-input";
    this.input.type = "text";
    this.input.autocomplete = "off";
    this.input.spellcheck = false;

    this.input.addEventListener("keydown", this.handleInput.bind(this));

    inputContainer.appendChild(this.input);
    this.container.appendChild(inputContainer);

    // Focus input when terminal is clicked
    this.container.addEventListener("click", () => {
      this.input.focus();
    });

    // Initial focus
    this.input.focus();
  }

  private handleInput(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      const command = this.input.value.trim();

      if (command) {
        // Add command to history
        this.history.push(command);
        this.historyIndex = this.history.length;

        // Display command
        this.addOutput(`> ${command}`);

        // Process command
        this.executeCommand(command);

        // Clear input
        this.input.value = "";
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = "";
      }
    }
  }

  private executeCommand(command: string): void {
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        this.showHelp();
        break;
      case "clear":
        this.clearOutput();
        break;
      case "echo":
        this.addOutput(args.join(" "));
        break;
      case "date":
        this.addOutput(new Date().toString());
        break;
      case "wasm":
        this.executeWasmCommand(args);
        break;
      default:
        this.addOutput(
          `Command not found: ${cmd}. Type "help" for available commands.`
        );
    }
  }

  private showHelp(): void {
    this.addOutput("Available commands:");
    this.addOutput("  help - Show this help message");
    this.addOutput("  clear - Clear the terminal");
    this.addOutput("  echo [text] - Display text");
    this.addOutput("  date - Show current date and time");
    this.addOutput("  wasm [function] [args] - Execute WebAssembly function");
  }

  private clearOutput(): void {
    this.output.innerHTML = "";
  }

  private addOutput(text: string): void {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.textContent = text;
    this.output.appendChild(line);

    // Scroll to bottom
    this.output.scrollTop = this.output.scrollHeight;
  }

  private async loadWasmModule(): Promise<void> {
    try {
      const response = await fetch("/static/wasm/main.wasm");
      const buffer = await response.arrayBuffer();
      const module = await WebAssembly.compile(buffer);

      const importObject = {
        env: {
          consoleLog: (ptr: number, len: number) => {
            // This would need actual memory handling in a real implementation
            this.addOutput(`WASM output: ${ptr}, ${len}`);
          },
        },
      };

      this.wasmInstance = await WebAssembly.instantiate(module, importObject);
      this.addOutput("WebAssembly module loaded successfully!");
    } catch (error) {
      console.error("Failed to load WebAssembly module:", error);
      this.addOutput("Failed to load WebAssembly module. Using fallback mode.");
    }
  }
  private executeWasmCommand(args: string[]): void {
    if (!this.wasmInstance) {
      this.addOutput("WebAssembly module not loaded.");
      return;
    }

    const funcName = args[0];
    if (!funcName) {
      this.addOutput("Usage: wasm [function] [args]");
      return;
    }

    const func = (this.wasmInstance.exports as any)[funcName];
    if (typeof func !== "function") {
      this.addOutput(`Function "${funcName}" not found in WebAssembly module.`);
      return;
    }

    try {
      // Parse arguments as numbers
      const numArgs = args.slice(1).map((arg) => parseInt(arg, 10));
      const result = func(...numArgs);
      this.addOutput(`Result: ${result}`);
    } catch (error) {
      console.error("Error executing WebAssembly function:", error);
      this.addOutput(`Error executing function: ${error}`);
    }
  }
}

// Initialize the terminal when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("terminal-container");
  if (container) {
    new WasmTerminal("terminal-container");
  }
});

export default WasmTerminal;
