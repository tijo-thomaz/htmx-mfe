// MFE Message Types
export interface MfeState {
  user: {
    name: string;
    role: string;
  };
  activeSection: string;
  theme: string;
}

export interface MfeMessage {
  type: "STATE_REQUEST" | "STATE_UPDATE" | "EVENT";
  source: string;
  payload?: any;
}

// Event Bus Types
export interface EventData {
  [key: string]: any;
}

export type EventCallback = (data: EventData) => void;
