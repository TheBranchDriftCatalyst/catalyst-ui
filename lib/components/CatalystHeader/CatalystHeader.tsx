'use client';

import NavigationHeader from "@/catalyst-ui/components/NavigationHeader/NavigationHeader";
import NavigationItem from "@/catalyst-ui/components/NavigationHeader/NavigationItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import Typography from "@/catalyst-ui/ui/typography";

//  TODO: when we get to it, this interface is going to == the CatalystHeaderContext shape
interface CatalystHeaderProps {
  navigationItems: React.ReactElement<typeof NavigationItem>[];
  title: string;

  breadcrumbs?: any[]
}

export const CatalystHeader = ({ navigationItems, title }: CatalystHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="ml-4 mr-4 flex justify-between">
        {/* Left Subgroup */}
        <div className="flex items-center">
            <div className="flex items-center">
              <Typography>{title}</Typography>
            </div>
        </div>
        {/* Right Subgroup */}
        <div className="flex items-center justify-around">
            <NavigationHeader direction="right">{navigationItems}</NavigationHeader>
            <Avatar>
              {/* TODO: turn this into the login widget */}
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
      </div>
      {/* <div className="ml-4 mr-4">
          <Breadcrumbs crumbs={breadcrumbs}  />
      </div> */}
    </header>
  );
};

export default CatalystHeader;
