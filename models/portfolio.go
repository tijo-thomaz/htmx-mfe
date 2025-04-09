package models

import (
	"time"
)

// TimelineItem represents a single event in the timeline
type TimelineItem struct {
	Year        string
	Title       string
	Subtitle    string
	Description string
	Quote       string
	Icon        string
}

// NewPortfolioData creates a new portfolio data object
func NewPortfolioData() *PortfolioData {
	return &PortfolioData{
		Title: "Tijo's Portfolio",
		Year:  time.Now().Year(),
		Timeline: []TimelineItem{
			{
				Year:        "2016-2018",
				Title:       "Speridian Technologies",
				Subtitle:    "First Lines of Code Angularjs",
				Description: "Started my journey into web development with HTML, CSS, JavaScript, jquery and Angularjs 1x. Built my first website and discovered the joy of creating things on the web.",
				Quote:       "Every hero's journey begins with a single step... or in my case, a single line of code!",
				Icon:        `<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd"></path></svg>`,
			},
			{
				Year:        "2018-2020",
				Title:       "Qburst Technologies",
				Subtitle:    "React Adventures",
				Description: "Dove deep into modern JavaScript frameworks. Mastered React, building complex applications and learning about component architecture and state management.",
				Quote:       "With great components comes great responsibility!",
				Icon:        `<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
			},
			{
				Year:        "2020-2021",
				Title:       "NetObjex",
				Subtitle:    "Breaking the Monolith",
				Description: "Led the transition to a react architecture. Implemented module federation and explored new ways to compose applications from independent pieces.",
				Quote:       "Sometimes you need to break things apart to build something greater!",
				Icon:        `<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>`,
			},
			{
				Year:        "2021-2023",
				Title:       "Infosys",
				Subtitle:    "Speed is a Feature",
				Description: "Focused on web performance optimization. Reduced load times by 60% through code splitting, lazy loading, and advanced caching strategies.",
				Quote:       "In the world of web development, milliseconds matter!",
				Icon:        `<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0012 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>`,
			},
			{
				Year:        "2023-present",
				Title:       "Bet365",
				Subtitle:    "Back to Simplicity",
				Description: "Discovered the power of HTMX combined with Go backends. Embraced a simpler approach to web development that still delivers rich, interactive experiences.",
				Quote:       "Sometimes the most powerful solutions are the simplest ones!",
				Icon:        `<svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>`,
			},
		},
		Skills: []string{
			"Go", "TypeScript", "React", "Angular", "Svelte",
			"HTMX", "Three.js", "Micro-Frontends", "Cloud Architecture",
		},
		MFEs: []MicroFrontend{
			{
				ID:          "merge-critic",
				Title:       "MergeCritic",
				Description: "GPT + GitHub PR reviewer",
				URL:         "https://merge-critic.example.com",
				Technology:  "React",
			},
			{
				ID:          "pulse-track",
				Title:       "PulseTrack",
				Description: "Infra + Dev analytics",
				URL:         "https://pulse-track.example.com",
				Technology:  "Angular",
			},
			{
				ID:          "prompt-forge",
				Title:       "PromptForge",
				Description: "VS Code + GPT prompt tool",
				URL:         "https://prompt-forge.example.com",
				Technology:  "Svelte",
			},
			{
				ID:          "g3x-engine",
				Title:       "G3X Engine",
				Description: "HTMX + Three.js UI render system",
				URL:         "https://g3x-engine.example.com",
				Technology:  "HTMX + Three.js",
			},
		},
	}
}

// PortfolioData contains all data needed for the portfolio
type PortfolioData struct {
	Title    string
	Year     int
	Timeline []TimelineItem
	Skills   []string
	MFEs     []MicroFrontend
}

// MicroFrontend represents a micro-frontend to be loaded
type MicroFrontend struct {
	ID          string
	Title       string
	Description string
	URL         string
	Technology  string // React, Angular, Svelte, etc.
}
