import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";

/**
 * ProfileDropdown - User profile menu with avatar
 */
export function ProfileDropdown() {
  // Mock user data
  const user = {
    name: "Alex Rivera",
    email: "alex.rivera@catalyst.dev",
    avatar: "", // Empty string will show fallback
    initials: "AR",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border/40 transition-all hover:ring-primary/50">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
