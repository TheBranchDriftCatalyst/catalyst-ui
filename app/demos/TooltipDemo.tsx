import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/catalyst-ui/ui/tooltip";
import { Button } from "@/catalyst-ui/ui/button";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default">Or me</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltips can be positioned on any side</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Or me too</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>They support rich content</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
