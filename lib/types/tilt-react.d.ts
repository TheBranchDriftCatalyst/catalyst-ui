/**
 * Type declarations for @jdion/tilt-react
 *
 * The package doesn't include TypeScript definitions,
 * so we define them here to avoid @ts-ignore comments.
 */

declare module "@jdion/tilt-react" {
  import { Component, ReactNode } from "react";

  export interface TiltProps {
    children?: ReactNode;
    className?: string;
    tiltEnable?: boolean;
    tiltReverse?: boolean;
    tiltAngleXInitial?: number;
    tiltAngleYInitial?: number;
    tiltMaxAngleX?: number;
    tiltMaxAngleY?: number;
    tiltAxis?: "x" | "y" | null;
    tiltAngleXManual?: number | null;
    tiltAngleYManual?: number | null;
    glareEnable?: boolean;
    glareMaxOpacity?: number;
    glareColor?: string;
    glareBorderRadius?: string;
    glarePosition?: "top" | "right" | "bottom" | "left" | "all";
    glareReverse?: boolean;
    scale?: number;
    perspective?: number;
    flipVertically?: boolean;
    flipHorizontally?: boolean;
    reset?: boolean;
    transitionEasing?: string;
    transitionSpeed?: number;
    trackOnWindow?: boolean;
    gyroscope?: boolean;
    onMove?: (
      tiltAngleX: number,
      tiltAngleY: number,
      tiltAngleXPercentage: number,
      tiltAngleYPercentage: number,
      glareAngle: number,
      glareOpacity: number
    ) => void;
    onEnter?: (event: MouseEvent | TouchEvent) => void;
    onLeave?: (event: MouseEvent | TouchEvent) => void;
  }

  export class Tilt extends Component<TiltProps> {}
  export { Tilt as default };
}
