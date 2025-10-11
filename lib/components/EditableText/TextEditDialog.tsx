import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/catalyst-ui/ui/dialog";
import { Button } from "@/catalyst-ui/ui/button";
import { Textarea } from "@/catalyst-ui/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/catalyst-ui/ui/form";
import { useToast } from "@/catalyst-ui/ui/use-toast";
import { useLocalizationContext } from "@/catalyst-ui/contexts/Localization";

const textEditSchema = z.object({
  value: z.string().min(1, "Text cannot be empty"),
});

interface TextEditDialogProps {
  /**
   * The translation key being edited
   */
  translationKey: string;

  /**
   * The namespace of the translation
   */
  namespace: string;

  /**
   * The current value of the translation
   */
  currentValue: string;

  /**
   * Callback when dialog is closed
   */
  onClose: () => void;
}

/**
 * TextEditDialog - Modal for editing translation text
 *
 * Shows:
 * - Translation key and file path
 * - Textarea for editing text
 * - Save/Cancel buttons
 *
 * On save:
 * - Updates LocalizationContext (offline)
 * - Shows toast notification
 * - Closes dialog
 * - Text updates immediately via i18next resource update
 */
export function TextEditDialog({
  translationKey,
  namespace,
  currentValue,
  onClose,
}: TextEditDialogProps) {
  const { toast } = useToast();
  const { updateTranslation } = useLocalizationContext();

  const form = useForm({
    resolver: zodResolver(textEditSchema),
    defaultValues: {
      value: currentValue,
    },
  });

  const onSubmit = async (data: z.infer<typeof textEditSchema>) => {
    try {
      // Update translation (local only - no API call)
      // The provider will propagate these back through
      // the vite API middleware eventually
      updateTranslation(namespace, translationKey, data.value);

      toast({
        title: "Text updated",
        description: "Translation has been updated successfully.",
      });

      // Close dialog
      onClose();

      // Note: i18next resources are updated immediately in LocalizationContext.updateTranslation
      // So the text will update instantly without a page reload
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update text",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <strong>Translation Key:</strong> {namespace}:{translationKey}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>File:</strong> {namespace}/.locale/{namespace}.i18n.json
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter text..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
