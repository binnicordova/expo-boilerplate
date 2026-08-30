export type SurfaceRadius = number | "capsule";

export type SurfaceSpec = {
    fill?: boolean;
    grow?: boolean;
    fillHeight?: boolean;
    size?: number;
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingTop?: number;
    paddingBottom?: number;
    radius?: SurfaceRadius;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity?: number;
    elevation?: number;
    /** Makes the whole padded box tappable, not just the glyphs inside it. */
    interactive?: boolean;
    /** Springs the surface between visual states whenever this value changes. */
    animateOn?: number | boolean;
};
