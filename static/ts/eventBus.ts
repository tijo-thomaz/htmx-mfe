import { EventCallback, EventData } from "./types";

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  constructor() {
    // Initialize with default events
    this.events.set("section:change", []);
    this.events.set("theme:change", []);
    this.events.set("capsule:load", []);
    this.events.set("capsule:interact", []);
    this.events.set("mfe:loaded", []);
    this.events.set("mfe:message", []);
    this.events.set("state:update", []);
  }

  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const callbacks = this.events.get(event)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  public publish(event: string, data: EventData = {}): void {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event)!;
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });

    // Log events to server if they're interaction events
    if (event.includes("interact") || event.includes("click")) {
      this.logEvent(event, data);
    }
  }

  private logEvent(event: string, data: EventData): void {
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.error("Failed to log event:", err));
  }
}

// Create a global instance
const eventBus = new EventBus();
(window as any).eventBus = eventBus;

export default eventBus;
