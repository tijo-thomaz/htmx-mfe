import { MfeState, MfeMessage } from "./types";

export class CoreShell {
  private state: MfeState;
  private mfeFrames: Map<string, HTMLIFrameElement> = new Map();

  constructor() {
    this.state = {
      user: { name: "", role: "" },
      activeSection: "hero",
      theme: "light",
    };

    this.initEventListeners();
    this.fetchInitialState();

    // Make the core shell accessible globally
    (window as any).coreShell = this;
  }

  // Register an MFE iframe
  public registerMfe(id: string, frame: HTMLIFrameElement): void {
    this.mfeFrames.set(id, frame);
    console.log(`MFE registered: ${id}`);

    // Send current state to the newly registered MFE once it loads
    frame.addEventListener("load", () => {
      this.sendStateToMfe(id);
    });
  }

  private initEventListeners(): void {
    // Listen for messages from MFEs
    window.addEventListener("message", this.handleMfeMessage.bind(this));

    // Listen for HTMX events
    document.body.addEventListener(
      "htmx:afterSwap",
      this.handleHtmxAfterSwap.bind(this)
    );

    // Register scroll events for section detection
    window.addEventListener(
      "scroll",
      this.debounce(this.detectActiveSection.bind(this), 100)
    );

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", this.toggleTheme.bind(this));
    }
  }

  private toggleTheme(): void {
    const newTheme = this.state.theme === "light" ? "dark" : "light";
    this.updateState({ theme: newTheme });

    // Apply theme to document
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  private async fetchInitialState(): Promise<void> {
    try {
      const response = await fetch("/api/state");
      const stateData = await response.json();

      this.state = { ...this.state, ...stateData };
      this.broadcastStateUpdate();

      // Apply initial theme
      document.documentElement.classList.toggle(
        "dark",
        this.state.theme === "dark"
      );
    } catch (error) {
      console.error("Failed to fetch initial state:", error);
    }
  }

  private handleHtmxAfterSwap(event: Event): void {
    console.log("HTMX after swap:", event);
  }

  private handleMfeMessage(event: MessageEvent): void {
    const message = event.data as MfeMessage;

    if (!message || typeof message !== "object" || !message.type) {
      return;
    }

    console.log(`Received message from MFE: ${message.source}`, message);

    switch (message.type) {
      case "STATE_REQUEST":
        this.sendStateToMfe(message.source);
        break;

      case "STATE_UPDATE":
        this.updateState(message.payload);
        break;

      case "EVENT":
        this.handleMfeEvent(message.payload, message.source);
        break;
    }
  }

  private handleMfeEvent(event: any, source: string): void {
    // Log the event
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, source }),
    });

    // Broadcast to other MFEs
    this.broadcastToMfes(
      {
        type: "EVENT",
        payload: event,
        source,
      },
      source
    );
  }

  private updateState(update: Partial<MfeState>): void {
    this.state = { ...this.state, ...update };

    // Apply theme if it was updated
    if (update.theme) {
      document.documentElement.classList.toggle(
        "dark",
        update.theme === "dark"
      );
    }

    // Broadcast the update to all MFEs
    this.broadcastStateUpdate();

    // Send the update to the server
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
  }

  private sendStateToMfe(target: string): void {
    const frame = this.mfeFrames.get(target);
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(
        {
          type: "STATE_UPDATE",
          payload: this.state,
          source: "shell",
        },
        "*"
      );
    }
  }

  private broadcastStateUpdate(): void {
    this.broadcastToMfes({
      type: "STATE_UPDATE",
      payload: this.state,
      source: "shell",
    });
  }

  private broadcastToMfes(message: MfeMessage, excludeSource?: string): void {
    this.mfeFrames.forEach((frame, id) => {
      if (id !== excludeSource && frame.contentWindow) {
        frame.contentWindow.postMessage(message, "*");
      }
    });
  }

  private detectActiveSection(): void {
    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });

    if (currentSection && currentSection !== this.state.activeSection) {
      this.updateState({ activeSection: currentSection });
    }
  }

  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: number | null = null;

    return (...args: any[]): void => {
      const later = () => {
        timeout = null;
        func(...args);
      };

      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(later, wait);
    };
  }
}

// Initialize the core shell when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CoreShell();
});
