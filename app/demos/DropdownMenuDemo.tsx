import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Button } from "@/catalyst-ui/ui/button";
import { useToast } from "@/catalyst-ui/ui/use-toast";

export function DropdownMenuDemo() {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast({ title: "Profile clicked" })}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({ title: "Billing clicked" })}>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({ title: "Team clicked" })}>Team</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({ title: "Subscription clicked" })}>
          Subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
