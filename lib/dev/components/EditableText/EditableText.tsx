import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { TextEditDialog } from "./TextEditDialog";
import { useLocalizationContext } from "../../context/LocalizationContext";

interface EditableTextProps {
  /**
   * The translation key for this text
   * Can be nested, e.g., "app.title" or "welcome.message"
   */
  id: string;

  /**
   * The translation namespace (default: "common")
   */
  namespace?: string;

  /**
   * Children are ignored - kept for backwards compatibility with codemod
   * The ComponentName/.locale/*.i18n.json files are the canonical source of truth
   */
  children?: React.ReactNode;

  /**
   * Optional className for styling (currently unused)
   */
  className?: string;
}

/**
 * EditableText wrapper component that makes text editable in dev mode
 *
 * In development:
 * - Shows edit icon (✏️) on hover
 * - Clicking icon opens edit dialog
 * - Changes are saved locally and can be dumped
 * - Edited text shows a subtle red dotted underline (dirty state)
 * - Supports Ctrl+Z to undo changes
 *
 * In production:
 * - Completely transparent (no overhead)
 * - Only renders children
 *
 * @example
 * ```tsx
 * import { EditableText } from '@/catalyst-ui/components/EditableText';
 * import { useTranslation } from 'react-i18next';
 *
 * function WelcomePage() {
 *   const { t } = useTranslation('common');
 *
 *   return (
 *     <h1>
 *       <EditableText id="app.title" namespace="common">
 *         {t('app.title', 'Catalyst UI')}
 *       </EditableText>
 *     </h1>
 *   );
 * }
 * ```
 */
export function EditableText({ id, namespace = "common", children: _children }: EditableTextProps) {
  const { isDirty, revision, getValue } = useLocalizationContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get the value from LocalizationContext (not from i18next)
  // Reading revision ensures this re-runs when translations change (undo/redo/update)
  const displayText = getValue(namespace, id);

  // Use revision to ensure component stays in sync (even though we don't directly use it)
  // This causes re-render when revision changes
  void revision;

  // Check if this translation has been edited (dirty)
  const isTextDirty = isDirty(namespace, id);

  // Only enable editing in dev mode
  const isDevMode = import.meta.env.DEV;

  // In production, just render the text from LocalizationContext
  if (!isDevMode) {
    return <>{displayText}</>;
  }

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        isTextDirty
          ? {
              textDecoration: "underline",
              textDecorationColor: "rgba(239, 68, 68, 0.4)", // red-500 at 40% opacity
              textDecorationStyle: "dotted",
              textDecorationThickness: "1px",
              textUnderlineOffset: "2px",
            }
          : undefined
      }
    >
      {displayText}

      {/* Edit icon on hover */}
      {isHovered && (
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="ml-1 inline-flex items-center justify-center p-0.5 bg-primary text-primary-foreground rounded shadow-sm hover:bg-primary/90 transition-all cursor-pointer hover:scale-105 opacity-70 hover:opacity-100"
          title="Edit text"
          style={{
            fontSize: "8px",
            lineHeight: 1,
            verticalAlign: "super",
          }}
        >
          <Pencil className="h-2 w-2" />
        </button>
      )}

      {/* Edit dialog */}
      {isEditing && (
        <TextEditDialog
          translationKey={id}
          namespace={namespace}
          currentValue={String(displayText)}
          onClose={() => setIsEditing(false)}
        />
      )}
    </span>
  );
}
