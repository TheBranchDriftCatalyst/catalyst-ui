import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Badge } from "@/catalyst-ui/ui/badge";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import { Pencil, Languages, Code2, Sparkles } from "lucide-react";

export const TAB_ORDER = 1.5; // Between Overview (0) and Cards (2)
export const TAB_SECTION = "catalyst";
export const TAB_LABEL = "Developer";

/**
 * DeveloperTab - Documentation for developer tools and utilities
 *
 * Explains the various dev-mode features available in Catalyst UI:
 * - EditableText for in-place i18n editing
 * - i18n/Localization system overview
 */
export function DeveloperTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Intro Section */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              Developer Tools
            </CardTitle>
            <CardDescription>
              Powerful development utilities for building and documenting components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="lead" className="text-foreground/90">
              Catalyst UI includes several developer-focused tools that are{" "}
              <strong>only active in development mode</strong> to help you build, document, and
              localize your components efficiently.
            </Typography>
            <Typography variant="p" className="text-muted-foreground leading-relaxed">
              These tools have <strong>zero production overhead</strong> - they're completely
              stripped out in production builds. Use them freely during development without worrying
              about bundle size or performance impact.
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" />
                  <Typography variant="h4">EditableText</Typography>
                </div>
                <Typography variant="muted" className="text-sm">
                  Edit translations in-place with a visual editor for rapid i18n development
                </Typography>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <Typography variant="h4">i18n System</Typography>
                </div>
                <Typography variant="muted" className="text-sm">
                  Co-located translation files with namespace isolation and hot reloading
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* EditableText System */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              EditableText Component
            </CardTitle>
            <CardDescription>Edit translations in-place during development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Typography variant="h3">What is it?</Typography>
              <Typography variant="p" className="text-muted-foreground">
                EditableText is a dev-mode wrapper that makes any text editable in the browser.
                Hover over text wrapped in <code>&lt;EditableText&gt;</code> to see a small pencil
                icon. Click it to open an inline editor.
              </Typography>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <Typography variant="muted" className="text-sm flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Dev Mode Only:</strong> In production builds, EditableText renders as a
                    transparent wrapper with zero overhead. The pencil icon and editor are
                    completely removed.
                  </span>
                </Typography>
              </div>
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Visual Indicators</Typography>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Pencil Icon:</strong> Appears on hover when text can be edited
                </li>
                <li>
                  <strong>Red Dotted Underline:</strong> Indicates text has been modified from its
                  original translation
                </li>
                <li>
                  <strong>Edit Dialog:</strong> Opens when you click the pencil, allowing you to
                  edit the translation for the current language
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Typography variant="h3">How to Use</Typography>
              <div className="space-y-2">
                <Typography variant="p" className="text-muted-foreground">
                  Wrap your translated text with EditableText and provide the translation key:
                </Typography>
                <CodeBlock
                  code={`import { EditableText } from '@/catalyst-ui/dev/components/EditableText';
import { useTranslation } from 'react-i18next';

function WelcomeMessage() {
  const { t } = useTranslation('WelcomeMessage');

  return (
    <h1>
      <EditableText id="title" namespace="WelcomeMessage">
        {t('title', 'Welcome to Catalyst UI')}
      </EditableText>
    </h1>
  );
}

// In development: Shows "Welcome to Catalyst UI" with edit icon
// In production: Shows "Welcome to Catalyst UI" (no wrapper overhead)`}
                  language="tsx"
                  fileName="EditableTextExample.tsx"
                  theme="catalyst"
                  showLineNumbers={true}
                  showCopyButton={true}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Features</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 space-y-1">
                  <Typography variant="p" className="font-semibold text-sm">
                    Multi-language Support
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Edit translations for the current active language. Switch languages in settings
                    to edit different translations.
                  </Typography>
                </div>

                <div className="border rounded-lg p-3 space-y-1">
                  <Typography variant="p" className="font-semibold text-sm">
                    Undo/Redo
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Press Ctrl+Z (or Cmd+Z on Mac) to undo changes. EditableText integrates with the
                    LocalizationContext for full undo/redo support.
                  </Typography>
                </div>

                <div className="border rounded-lg p-3 space-y-1">
                  <Typography variant="p" className="font-semibold text-sm">
                    Dirty State Tracking
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Modified translations show a red dotted underline so you can see what's been
                    changed at a glance.
                  </Typography>
                </div>

                <div className="border rounded-lg p-3 space-y-1">
                  <Typography variant="p" className="font-semibold text-sm">
                    Export Changes
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Use the Dev Mode Utilities panel to export all your translation edits back to
                    JSON files.
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* i18n System */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Internationalization (i18n) System
            </CardTitle>
            <CardDescription>
              Co-located translations with react-i18next and namespace isolation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Typography variant="h3">Overview</Typography>
              <Typography variant="p" className="text-muted-foreground">
                Catalyst UI uses <code>react-i18next</code> with a co-located translation pattern.
                Each component has its own <code>.locale/</code> folder containing translation files
                for different languages.
              </Typography>
            </div>

            <div className="space-y-3">
              <Typography variant="h3">File Structure</Typography>
              <CodeBlock
                code={`component/
  .locale/
    ComponentName.en.i18n.json     # English translations
    ComponentName.es.i18n.json     # Spanish translations
    ComponentName.fr.i18n.json     # French translations
  ComponentName.tsx                # Component file

# Example: WelcomeTab translations
app/tabs/
  .locale/
    WelcomeTab.en.i18n.json
    WelcomeTab.es.i18n.json
  WelcomeTab.tsx`}
                language="bash"
                fileName="i18n-structure.txt"
                theme="catalyst"
                showLineNumbers={true}
                showCopyButton={true}
              />
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Translation Files</Typography>
              <Typography variant="p" className="text-muted-foreground mb-2">
                Translation files are simple JSON with key-value pairs:
              </Typography>
              <CodeBlock
                code={`// WelcomeTab.en.i18n.json
{
  "welcome": "Welcome!",
  "description": "Hello, {{name}}!",
  "button.submit": "Submit Form",
  "errors.required": "This field is required"
}

// WelcomeTab.es.i18n.json
{
  "welcome": "¡Bienvenido!",
  "description": "¡Hola, {{name}}!",
  "button.submit": "Enviar Formulario",
  "errors.required": "Este campo es obligatorio"
}`}
                language="json"
                fileName="translations.json"
                theme="catalyst"
                showLineNumbers={true}
                showCopyButton={true}
              />
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Using Translations</Typography>
              <CodeBlock
                code={`import { useTranslation } from 'react-i18next';
import { EditableText } from '@/catalyst-ui/dev/components/EditableText';

function WelcomeTab() {
  const { t, i18n } = useTranslation('WelcomeTab'); // namespace = component name

  return (
    <div>
      {/* Basic translation */}
      <h1>
        <EditableText id="welcome" namespace="WelcomeTab">
          {t('welcome')}
        </EditableText>
      </h1>

      {/* With interpolation */}
      <p>
        <EditableText id="description" namespace="WelcomeTab">
          {t('description', { name: 'User' })}
        </EditableText>
      </p>

      {/* Nested keys */}
      <button>
        <EditableText id="button.submit" namespace="WelcomeTab">
          {t('button.submit')}
        </EditableText>
      </button>

      {/* Change language */}
      <button onClick={() => i18n.changeLanguage('es')}>
        Español
      </button>
    </div>
  );
}`}
                language="tsx"
                fileName="UsingTranslations.tsx"
                theme="catalyst"
                showLineNumbers={true}
                showCopyButton={true}
              />
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Language Detection Priority</Typography>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>URL Parameter:</strong> <code>?locale=es</code>
                </li>
                <li>
                  <strong>localStorage:</strong> <code>catalyst-ui-locale</code>
                </li>
                <li>
                  <strong>Browser Language:</strong> <code>navigator.language</code>
                </li>
                <li>
                  <strong>Default:</strong> <code>en</code>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <Typography variant="h3">Switching Languages</Typography>
              <Typography variant="p" className="text-muted-foreground mb-2">
                Use the language dropdown in the Settings panel (header → gear icon → i18n tab). You
                can also switch programmatically:
              </Typography>
              <CodeBlock
                code={`import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('catalyst-ui-locale', lng);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
}`}
                language="tsx"
                fileName="LanguageSwitcher.tsx"
                theme="catalyst"
                showLineNumbers={true}
                showCopyButton={true}
              />
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Best Practices */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Tips for effective use of dev tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Typography variant="h4">EditableText</Typography>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  Wrap <strong>all</strong> user-facing text in EditableText for easy localization
                </li>
                <li>Use descriptive translation keys (e.g., "button.submit" not "btn1")</li>
                <li>
                  Keep fallback text in <code>t()</code> call for development without translation
                  files
                </li>
                <li>Export changes frequently and commit translation JSON files to git</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Typography variant="h4">i18n System</Typography>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>One namespace per component for better organization</li>
                <li>
                  Use nested keys for related translations (e.g., "form.email", "form.password")
                </li>
                <li>Always provide English translations first (fallback language)</li>
                <li>
                  Test with different languages to catch layout issues (some languages are longer!)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Accessing Dev Tools */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Accessing Developer Tools</CardTitle>
            <CardDescription>Where to find these features in the UI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge>Header → Dev Mode Utilities</Badge>
              </div>
              <Typography variant="p" className="text-muted-foreground text-sm">
                Click the <strong>code icon</strong> in the navigation header to open the Dev Mode
                Utilities menu. This gives you access to:
              </Typography>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm ml-4">
                <li>Translation tools (view and manage in-place i18n edits)</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge>Header → Settings → i18n Tab</Badge>
              </div>
              <Typography variant="p" className="text-muted-foreground text-sm">
                Click the <strong>gear icon</strong> in the header, then navigate to the{" "}
                <strong>i18n</strong> tab. Here you can:
              </Typography>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm ml-4">
                <li>Switch between available languages</li>
                <li>Export modified translations to JSON</li>
                <li>View translation statistics</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge>In-Place Editing</Badge>
              </div>
              <Typography variant="p" className="text-muted-foreground text-sm">
                Simply <strong>hover over any text</strong> wrapped in EditableText to see the
                pencil icon. Click it to edit translations directly in context.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
