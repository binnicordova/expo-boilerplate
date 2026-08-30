import type {ModifierConfig} from "@expo/ui/swift-ui/modifiers";
import {
    Animation,
    animation,
    background,
    clipShape,
    contentShape,
    frame,
    opacity as opacityModifier,
    padding,
    shadow,
    shapes,
    strokeBorder,
} from "@expo/ui/swift-ui/modifiers";
import type {SurfaceSpec} from "./surface.types";

const FILL_MAX_WIDTH = 100000;

/**
 * A snappy, lightly damped spring — the iOS default feel for state changes.
 * Springs are interruptible, so a fast tapper never fights the animation.
 */
const SPRING = Animation.spring({response: 0.32, dampingFraction: 0.82});

export const surfaceModifiers = (spec: SurfaceSpec): ModifierConfig[] => {
    const modifiers: ModifierConfig[] = [];

    if (
        spec.padding != null ||
        spec.paddingHorizontal != null ||
        spec.paddingVertical != null ||
        spec.paddingTop != null ||
        spec.paddingBottom != null
    ) {
        modifiers.push(
            padding({
                all: spec.padding,
                horizontal: spec.paddingHorizontal,
                vertical: spec.paddingVertical,
                top: spec.paddingTop,
                bottom: spec.paddingBottom,
            })
        );
    }

    if (spec.size != null) {
        modifiers.push(frame({width: spec.size, height: spec.size}));
    } else if (spec.fill) {
        modifiers.push(frame({maxWidth: FILL_MAX_WIDTH}));
    }

    if (spec.backgroundColor) {
        modifiers.push(background(spec.backgroundColor));
    }

    const isCapsule = spec.radius === "capsule";
    const cornerRadius =
        typeof spec.radius === "number" ? spec.radius : undefined;

    if (spec.radius != null) {
        modifiers.push(
            isCapsule
                ? clipShape("capsule")
                : clipShape("roundedRectangle", spec.radius as number)
        );
    }

    if (spec.borderColor && spec.borderWidth) {
        modifiers.push(
            strokeBorder({
                color: spec.borderColor,
                style: {lineWidth: spec.borderWidth},
                shape: isCapsule ? "capsule" : "roundedRectangle",
                cornerRadius,
            })
        );
    }

    if (spec.elevation) {
        modifiers.push(
            shadow({
                radius: spec.elevation,
                y: Math.round(spec.elevation / 2),
                color: "#0627431F",
            })
        );
    }

    if (spec.opacity != null) {
        modifiers.push(opacityModifier(spec.opacity));
    }

    if (spec.interactive) {
        // SwiftUI hit-tests a button's label, not its padded frame, so without
        // this only the text and icon respond to a tap.
        modifiers.push(
            contentShape(
                isCapsule
                    ? shapes.capsule()
                    : shapes.roundedRectangle({cornerRadius: cornerRadius ?? 0})
            )
        );
    }

    if (spec.animateOn != null) {
        modifiers.push(animation(SPRING, spec.animateOn));
    }

    return modifiers;
};

export const surfaceStyle = (_spec: SurfaceSpec): undefined => undefined;
