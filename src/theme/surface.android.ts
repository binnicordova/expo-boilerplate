import type {ModifierConfig} from "@expo/ui/jetpack-compose/modifiers";
import {
    alpha,
    animateContentSize,
    background,
    border,
    clip,
    fillMaxSize,
    fillMaxWidth,
    padding,
    Shapes,
    shadow,
    size,
    spring,
    weight,
} from "@expo/ui/jetpack-compose/modifiers";
import type {SurfaceSpec} from "./surface.types";

const CAPSULE_RADIUS = 1000;

export const surfaceModifiers = (spec: SurfaceSpec): ModifierConfig[] => {
    const modifiers: ModifierConfig[] = [];

    if (spec.opacity != null) {
        modifiers.push(alpha(spec.opacity));
    }

    if (spec.fillHeight) {
        modifiers.push(fillMaxSize());
    } else if (spec.grow) {
        modifiers.push(weight(1));
    }

    if (spec.size != null) {
        modifiers.push(size(spec.size, spec.size));
    } else if (spec.fill) {
        modifiers.push(fillMaxWidth());
    }

    if (spec.elevation) {
        modifiers.push(shadow(spec.elevation));
    }

    if (spec.radius != null) {
        modifiers.push(
            clip(
                Shapes.RoundedCorner(
                    spec.radius === "capsule" ? CAPSULE_RADIUS : spec.radius
                )
            )
        );
    }

    if (spec.backgroundColor) {
        modifiers.push(
            background(
                spec.backgroundColor,
                spec.animateOn != null ? {animationSpec: spring()} : undefined
            )
        );
    }

    if (spec.borderColor && spec.borderWidth) {
        modifiers.push(border(spec.borderWidth, spec.borderColor));
    }

    const horizontal = spec.paddingHorizontal ?? spec.padding ?? 0;
    const vertical = spec.paddingVertical ?? spec.padding ?? 0;
    const top = spec.paddingTop ?? vertical;
    const bottom = spec.paddingBottom ?? vertical;

    if (horizontal || top || bottom) {
        modifiers.push(padding(horizontal, top, horizontal, bottom));
    }

    if (spec.animateOn != null) {
        modifiers.push(animateContentSize());
    }

    return modifiers;
};

export const surfaceStyle = (_spec: SurfaceSpec): undefined => undefined;
