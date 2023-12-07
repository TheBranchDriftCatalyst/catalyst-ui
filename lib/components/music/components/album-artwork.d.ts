/// <reference types="react" />
import { Album } from "../data/albums";
interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: Album;
    aspectRatio?: "portrait" | "square";
    width?: number;
    height?: number;
}
export declare function AlbumArtwork({ album, aspectRatio, width, height, className, ...props }: AlbumArtworkProps): import("react").JSX.Element;
export {};
