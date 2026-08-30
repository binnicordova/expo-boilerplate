import type {UniversalStyle} from "@expo/ui";
import type {SurfaceSpec} from "./surface.types";

export const surfaceModifiers = (_spec: SurfaceSpec): undefined => undefined;

export const surfaceStyle = (spec: SurfaceSpec): UniversalStyle =>
    ({
        width: spec.size ?? (spec.fill ? "100%" : undefined),
        // The web Button fallback ships a fixed 40px height; a surface must
        // grow with its content or long labels overflow their box.
        height: spec.size ?? (spec.fill ? "auto" : undefined),
        padding: spec.padding,
        paddingHorizontal: spec.paddingHorizontal,
        paddingVertical: spec.paddingVertical,
        paddingTop: spec.paddingTop,
        paddingBottom: spec.paddingBottom,
        borderRadius: spec.radius === "capsule" ? 9999 : spec.radius,
        backgroundColor: spec.backgroundColor,
        borderColor: spec.borderColor,
        borderWidth: spec.borderWidth,
        opacity: spec.opacity,
        ...(spec.grow || spec.fillHeight
            ? {flexGrow: 1, flexShrink: 1, flexBasis: 0}
            : null),
    }) as UniversalStyle;
