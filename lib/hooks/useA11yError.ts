import { useMemo } from "react";

/**
 * useA11yError - Creates accessible error message associations for form inputs
 *
 * Generates proper ARIA attributes for inputs with error states, ensuring
 * screen readers announce error messages correctly.
 *
 * This hook follows WCAG 3.3.1 (Error Identification) and 3.3.3 (Error Suggestion)
 * guidelines by properly associating error messages with form inputs.
 *
 * @param inputId - The ID of the input element
 * @param hasError - Whether the input currently has an error
 * @returns Object with errorId and ARIA props for input and error message
 *
 * @example
 * ```tsx
 * const { errorId, inputProps, errorProps } = useA11yError("email", !!errors.email);
 *
 * return (
 *   <>
 *     <Input {...inputProps} />
 *     {errors.email && <p {...errorProps}>{errors.email.message}</p>}
 *   </>
 * );
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html
 * @see https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html
 */
export function useA11yError(inputId: string, hasError: boolean) {
  const errorId = useMemo(() => `${inputId}-error`, [inputId]);

  const inputProps = useMemo(
    () => ({
      "aria-invalid": hasError ? ("true" as const) : ("false" as const),
      "aria-describedby": hasError ? errorId : undefined,
    }),
    [hasError, errorId]
  );

  const errorProps = useMemo(
    () => ({
      id: errorId,
      role: "alert" as const,
      "aria-live": "polite" as const,
    }),
    [errorId]
  );

  return {
    errorId,
    inputProps,
    errorProps,
  };
}
