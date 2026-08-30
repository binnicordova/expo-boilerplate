import {Column, Row} from "@expo/ui";
import type {ReactNode} from "react";
import {surfaceModifiers, surfaceStyle} from "@/theme/surface";
import type {SurfaceSpec} from "@/theme/surface.types";

export type SurfaceProps = SurfaceSpec & {
    children: ReactNode;
    direction?: "column" | "row";
    spacing?: number;
    alignment?: "start" | "center" | "end";
    testID?: string;
};

export const Surface = ({
    children,
    direction = "column",
    spacing,
    alignment,
    testID,
    ...spec
}: SurfaceProps) => {
    const Container = direction === "row" ? Row : Column;

    return (
        <Container
            testID={testID}
            spacing={spacing}
            alignment={alignment}
            modifiers={surfaceModifiers(spec)}
            style={surfaceStyle(spec)}
        >
            {children}
        </Container>
    );
};
