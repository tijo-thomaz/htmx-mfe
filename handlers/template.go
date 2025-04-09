package handlers

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
	"path/filepath"
	"strings"
)

// TemplateHandler manages template rendering
type TemplateHandler struct {
	templates     map[string]*template.Template
	templateDir   string
	partialDir    string
	layoutsDir    string
	templateFuncs template.FuncMap
}

// NewTemplateHandler creates a new template handler
func NewTemplateHandler(templateDir string) *TemplateHandler {
	return &TemplateHandler{
		templates:   make(map[string]*template.Template),
		templateDir: templateDir,
		partialDir:  filepath.Join(templateDir, "partials"),
		layoutsDir:  filepath.Join(templateDir, "layouts"),
		templateFuncs: template.FuncMap{
			"safeHTML": func(s string) template.HTML {
				return template.HTML(s)
			},
		},
	}
}

// LoadTemplates loads all templates from the template directory
func (th *TemplateHandler) LoadTemplates() error {
	// Get all template files
	baseLayout := filepath.Join(th.layoutsDir, "base.html")
	partialFiles, err := filepath.Glob(filepath.Join(th.partialDir, "*.html"))
	if err != nil {
		return fmt.Errorf("error finding partial templates: %w", err)
	}

	pageFiles, err := filepath.Glob(filepath.Join(th.templateDir, "*.html"))
	if err != nil {
		return fmt.Errorf("error finding page templates: %w", err)
	}

	// Filter out files that start with underscore
	var filteredPageFiles []string
	for _, page := range pageFiles {
		if !strings.HasPrefix(filepath.Base(page), "_") {
			filteredPageFiles = append(filteredPageFiles, page)
		}
	}

	// For each page, create a complete template set
	for _, page := range filteredPageFiles {
		// Create a new template set with the page name
		pageName := filepath.Base(page)
		tmpl := template.New(pageName).Funcs(th.templateFuncs)

		// Parse all files needed for this page
		filesToParse := append([]string{baseLayout}, partialFiles...)
		filesToParse = append(filesToParse, page)

		// Parse all files
		tmpl, err = tmpl.ParseFiles(filesToParse...)
		if err != nil {
			return fmt.Errorf("error parsing template files for %s: %w", pageName, err)
		}

		// Store the template
		th.templates[pageName] = tmpl
	}

	return nil
}

// RenderTemplate renders a template with the given data
func (th *TemplateHandler) RenderTemplate(w http.ResponseWriter, name string, data interface{}) error {
	tmpl, ok := th.templates[name]
	if !ok {
		return fmt.Errorf("template %s not found", name)
	}

	// Execute the base template
	return tmpl.ExecuteTemplate(w, "base.html", data)
}

// RenderPartial renders a partial template with the given data
func (th *TemplateHandler) RenderPartial(w io.Writer, name string, data interface{}) error {
	// For partials, we need to parse the template each time
	// This is because partials are often rendered in response to HTMX requests
	// and may not be part of the initial page load

	partialPath := filepath.Join(th.partialDir, name+".html")
	tmpl, err := template.New(name).Funcs(th.templateFuncs).ParseFiles(partialPath)
	if err != nil {
		return err
	}

	return tmpl.Execute(w, data)
}
