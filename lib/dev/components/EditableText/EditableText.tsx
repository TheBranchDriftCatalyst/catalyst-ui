import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TextEditDialog } from "./TextEditDialog";
import { useLocalizationContext } from "../../context/LocalizationContext";
import { isDevUtilsEnabled } from "../../utils/devMode";

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
 * In development (or when DEV_UTILS_ENABLED):
 * - Shows edit icon (✏️) on hover
 * - Clicking icon opens edit dialog
 * - Changes are saved locally and can be dumped
 * - Edited text shows a subtle red dotted underline (dirty state)
 * - Supports Ctrl+Z to undo changes
 *
 * In production (without DEV_UTILS_ENABLED):
 * - Completely transparent (no overhead)
 * - Uses i18next directly for translations
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
  const { t } = useTranslation(namespace);
  const devUtilsEnabled = isDevUtilsEnabled();

  // Only use LocalizationContext when dev utils are enabled
  const locContext = useLocalizationContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // In production without dev utils, use i18next directly
  if (!devUtilsEnabled) {
    return <>{t(id)}</>;
  }

  // Get the value from LocalizationContext for dev mode
  const displayText = locContext.getValue(namespace, id);

  // Check if this translation has been edited (dirty)
  const isTextDirty = locContext.isDirty(namespace, id);

  // Use revision to ensure component stays in sync
  void locContext.revision;

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
