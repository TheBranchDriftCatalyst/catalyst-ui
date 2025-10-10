"use client";

import { Button } from "@/catalyst-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/catalyst-ui/ui/card";
import { SiGit, SiGoogle } from "@icons-pack/react-simple-icons";
import { toLower } from "lodash";
import { FileQuestionIcon } from "lucide-react";
import React from "react";
import { AnimatedTilt } from "@/catalyst-ui/effects/AnimatedTilt";

import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  // Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/catalyst-ui/ui/form";
import { Input } from "@/catalyst-ui/ui/input";
import { Typography } from "@/catalyst-ui/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("CreateAccountCard");

const InputFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
});

const ProviderIcons = {
  github: SiGit,
  google: SiGoogle,
};

/**
 * OIDC provider configuration for authentication buttons
 * @interface OIDCProviderShape
 */
interface OIDCProviderShape {
  /** Provider name (must match ProviderIcons keys: 'github' or 'google') */
  name: keyof typeof ProviderIcons;
  /** Callback function triggered when provider button is clicked */
  onClick: () => void;
  /** Optional custom icon component (overrides default provider icon) */
  icon?: React.ComponentType;
}

/**
 * Props for the CreateAccountCard component
 * @interface CreateAccountCardProps
 */
interface CreateAccountCardProps {
  /** Array of OIDC authentication providers to display */
  oidcProviders: OIDCProviderShape[];
  /** Callback function triggered when login form is submitted */
  onLogin: (values: z.infer<typeof InputFormSchema>) => void;
  /** Callback function triggered when "Create account" button is clicked */
  onCreateAccount: () => void;
  /** Enable 3D tilt animation effect on hover (default: true) */
  enableTilt?: boolean;
}

/**
 * CreateAccountCard - Pre-styled authentication card with OIDC support
 *
 * A ready-to-use login card component featuring:
 * - Username/password form with Zod validation
 * - OIDC provider buttons (GitHub, Google)
 * - Optional 3D tilt animation effect
 * - Responsive design with Catalyst theme styling
 *
 * @param props - Component props
 * @returns Rendered authentication card
 *
 * @example
 * ```tsx
 * import { CreateAccountCard } from 'catalyst-ui';
 *
 * function LoginPage() {
 *   return (
 *     <CreateAccountCard
 *       oidcProviders={[
 *         { name: "github", onClick: () => loginWithGitHub() },
 *         { name: "google", onClick: () => loginWithGoogle() }
 *       ]}
 *       onLogin={(values) => console.log("Login:", values)}
 *       onCreateAccount={() => navigate("/signup")}
 *       enableTilt={true}
 *     />
 *   );
 * }
 * ```
 */
export const CreateAccountCard = ({
  oidcProviders,
  onLogin,
  onCreateAccount,
  enableTilt = true,
}: CreateAccountCardProps) => {
  const form = useForm<z.infer<typeof InputFormSchema>>({
    resolver: zodResolver(InputFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const cardContent = (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email below to login</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLogin)}>
          <CardContent>
            <div className="flex justify-evenly">
              {oidcProviders.map(provider => (
                <OIDCButton key={provider.name} provider={provider} />
              ))}
            </div>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                log.debug("Username field", field);
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="someone@somewhere.com"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                log.debug("Password field", field);
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-evenly">
              <span className="shrink-1">
                <Button variant="default" type="submit">
                  Login
                </Button>
              </span>
              <Typography size="2xs" className="text-muted-foreground">
                or
              </Typography>
              <span className="shrink-1">
                <Button variant="secondary" onClick={onCreateAccount}>
                  Create account
                </Button>
              </span>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );

  return (
    <AnimatedTilt
      enabled={enableTilt}
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      perspective={1500}
    >
      {cardContent}
    </AnimatedTilt>
  );
};

const OIDCButton: React.FC<{ provider: OIDCProviderShape }> = ({ provider }) => {
  const lookupName = toLower(provider.name) as keyof typeof ProviderIcons;
  const IconComponent = ProviderIcons[lookupName] || provider?.icon || FileQuestionIcon;

  return (
    <Button variant="outline" onClick={provider.onClick}>
      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
      {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
    </Button>
  );
};

export default CreateAccountCard;
