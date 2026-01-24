import {useEffect, useRef} from "react";
import {Animated, type DimensionValue, type ViewProps} from "react-native";
import {RADIUS} from "@/theme/border";
import {theme} from "@/theme/colors";

export type SkeletonVariant = "rect" | "circle" | "rounded";

export type SkeletonProps = ViewProps & {
    width?: DimensionValue;
    height?: DimensionValue;
    variant?: SkeletonVariant;
};

export const Skeleton = ({
    width = "100%",
    height = 20,
    variant = "rect",
    style,
    ...props
}: SkeletonProps) => {
    const {lightness} = theme();
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [pulseAnim]);

    const getBorderRadius = () => {
        switch (variant) {
            case "circle":
                return typeof height === "number" ? height / 2 : 9999;
            case "rounded":
                return RADIUS[5];
            default:
                return 0;
        }
    };

    return (
        <Animated.View
            testID="skeleton"
            {...props}
            style={[
                {
                    width,
                    height,
                    backgroundColor: lightness,
                    borderRadius: getBorderRadius(),
                    opacity: pulseAnim,
                },
                style,
            ]}
        />
    );
};
