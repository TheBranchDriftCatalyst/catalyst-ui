import { Avatar, AvatarImage, AvatarFallback } from "@/catalyst-ui/ui/avatar";
import { Toggle } from "@/catalyst-ui/ui/toggle";

export function AvatarToggleDemo() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage src="shadcn-avatar.png" alt="User avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex gap-2">
        <Toggle>Toggle 1</Toggle>
        <Toggle>Toggle 2</Toggle>
        <Toggle>Toggle 3</Toggle>
      </div>
    </div>
  );
}
