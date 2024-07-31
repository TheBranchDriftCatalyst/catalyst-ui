import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/catalyst-ui/ui/card";
import { ReactNode } from "react";

interface CatalystCardProps {
  title?: String | ReactNode;
  description?: String | ReactNode;
  content: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];

}



export const CatalystCardHeader = ({title, description, className}: {title: String | ReactNode, description: String | ReactNode}) => {
  return (
    <CardHeader>
      {title &&( <CardTitle>{title}</CardTitle>)}
      {description && (<CardDescription>{description}</CardDescription>)}
    </CardHeader>
  );
};


export const CatalystCardFooter = ({children}: {children: (ReactNode | ReactNode[]) }) => {
  return (
    <CardFooter className="flex justify-between">
      {children}
    </CardFooter>
  );
};

export const CatalystCard = ({title, description, content, footer}: CatalystCardProps) => {
  return (
    <Card>
      {(title || description) && (<CatalystCardHeader title={title} description={description} />)}
      <CardContent>
        {content}
      </CardContent>
      {footer && (<CardFooter>{footer}</CardFooter>)}
    </Card>
  );
};
