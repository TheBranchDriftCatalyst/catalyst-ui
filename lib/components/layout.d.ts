import "@/styles/globals.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
export declare function generateMetadata(params: {
    params: {
        theme: string;
    };
}): Promise<Metadata>;
interface RootLayoutProps {
    children: ReactNode;
    params: any;
}
export default function RootLayout({ children, params }: RootLayoutProps): import("react").JSX.Element;
export {};
