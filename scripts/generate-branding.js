#!/usr/bin/env node
/*
  Generate TapPro branding assets using Sharp from SVG templates.
  Outputs:
    - assets/icon.png (1024x1024)
    - assets/adaptive-icon.png (1024x1024, transparent bg)
    - assets/splash.png (1284x2778)
    - assets/favicon.png (64x64)
    - resources/app-icon.png (512x512)
    - resources/feature-graphic.png (1024x500)
    - resources/privacy-policy.html to PlayStore/AppStore
*/
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const readline = require("readline");

const out = (p) => path.resolve(process.cwd(), p);

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
}

async function getBrandColors(logoBuffer) {
    try {
        const {dominant, channels} = await sharp(logoBuffer).stats();
        const isDark =
            dominant.r * 0.299 + dominant.g * 0.587 + dominant.b * 0.114 < 140;

        const primary = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;

        // Find a contrasting light color from the image for text/logo elements
        // This is a simplified heuristic: find the brightest color.
        const {max} = channels[0]; // Assuming R channel max is representative
        const white = max > 200 ? "#FFFFFF" : "#ffe3c9";

        return {
            primary: isDark ? primary : "#171c20",
            white: isDark ? white : primary,
        };
    } catch (e) {
        console.warn("Could not extract colors from image, using defaults.", e);
        return {primary: "#171c20", white: "#ffe3c9"};
    }
}

function logoSVG({
    size: _size = 1024,
    stroke: _stroke = 64,
    color: _color = "#ffe3c9",
    bg: _bg = "transparent",
    withGradientBg: _withGradientBg = false,
    brand,
    inputIsSVG,
    logo,
} = {}) {
    if (!inputIsSVG) {
        // For PNG input, we can't manipulate SVG properties.
        // The compositing will be handled later in svgToPng.
        // Return a placeholder or handle differently.
        return "";
    }
    return logo
        .replace(/width="[^"]*"/, `width="${_size}"`)
        .replace(/height="[^"]*"/, `height="${_size}"`);
}

function splashSVG({
    width = 1284,
    height = 2778,
    brand,
    inputIsSVG,
    logo,
    logoSVG,
}) {
    // Maintain center-safe design and reuse logoSVG for the rings
    const minSide = Math.min(width, height);
    const stroke = Math.round(minSide * 0.03);
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height * 0.58);
    const r3 = Math.round(minSide * 0.3);

    const logoSize = Math.round(r3 / 0.8);
    const gradientId = "bgGrad";
    const shadowId = "textShadow";

    if (!inputIsSVG) {
        const logoBase64 = `data:image/png;base64,${logo.toString("base64")}`;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <image href="${logoBase64}" x="${Math.round(centerX - logoSize / 2)}" y="${Math.round(centerY - logoSize / 2)}" width="${logoSize}" height="${logoSize}" />

  <g font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="${Math.round(minSide * 0.08)}" font-weight="700" text-anchor="middle" fill="${brand.white}" filter="url(#${shadowId})">
    <text x="${centerX}" y="${Math.round(centerY + r3 + minSide * 0.12)}">${brand.name}</text>
  </g>
</svg>`;
    }

    // Generate logo SVG (transparent background) and extract inner content to inline
    const logoRaw = logoSVG({
        size: logoSize,
        stroke,
        color: brand.white,
        bg: "transparent",
        withGradientBg: false,
        brand,
    });
    const logoInner = logoRaw
        .replace(/<\?xml[\s\S]*?\?>/, "")
        .replace(/^[\s\S]*?<svg[^>]*>/, "")
        .replace(/<\/svg>\s*$/, "");

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Inline logoSVG content, centered at desired location -->
  <svg x="${Math.round(centerX - logoSize / 3)}" y="${Math.round(centerY - logoSize / 8)}" width="${logoSize}" height="${logoSize}" viewBox="0 0 ${logoSize} ${logoSize}">
    ${logoInner}
  </svg>

  <g font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="${Math.round(minSide * 0.08)}" font-weight="700" text-anchor="middle" fill="${brand.white}" filter="url(#${shadowId})">
    <text x="${centerX}" y="${Math.round(centerY + r3 + minSide * 0.12)}">${brand.name}</text>
  </g>
</svg>`;
}

async function svgToPng(
    svg,
    filePath,
    width,
    height,
    brand,
    {
        inputIsSVG,
        logo,
        padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    }
) {
    if (!inputIsSVG) {
        // PNG input logic
        const baseImage = sharp(logo).resize(width, height, {
            fit: "contain",
            background: {r: 0, g: 0, b: 0, alpha: 0},
        });
        if (filePath.includes("icon.png") && !filePath.includes("adaptive")) {
            // Non-adaptive icon
            const background = Buffer.from(
                `<svg><rect x="0" y="0" width="${width}" height="${height}" fill="${brand.primary}"/></svg>`
            );
            await sharp(background)
                .composite([{input: await baseImage.toBuffer()}])
                .png()
                .toFile(filePath);
        } else if (filePath.includes("favicon.png")) {
            const background = Buffer.from(
                `<svg><rect x="0" y="0" width="${width}" height="${height}" fill="${brand.primary}"/></svg>`
            );
            await sharp(background)
                .composite([
                    {
                        input: await sharp(logo)
                            .resize(
                                Math.round(width * 0.8),
                                Math.round(height * 0.8),
                                {fit: "contain"}
                            )
                            .toBuffer(),
                    },
                ])
                .png()
                .toFile(filePath);
        } else if (filePath.includes("splash.png")) {
            const buffer = Buffer.from(svg);
            await sharp(buffer, {density: 300})
                .resize(width, height, {fit: "cover"})
                .png()
                .toFile(filePath);
        } else {
            // adaptive-icon, app-icon, feature-graphic
            await baseImage.png().toFile(filePath);
        }
        return;
    }
    const buffer = Buffer.from(svg);
    await sharp(buffer, {density: 300})
        .extend({
            ...padding,
            background: {r: 0, g: 0, b: 0, alpha: 0},
        })
        .resize(width, height, {fit: "cover"})
        .png()
        .toFile(filePath);
}

const EXAMPLE_APP_NAME = "Expo";
const EXAMPLE_INPUT_FILE = "./scripts/logo.svg";
async function run() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(
        `Enter input file (e.g., logo.svg or logo.png) [${EXAMPLE_INPUT_FILE}]: `,
        (inputFileAnswer) => {
            const inputFile = inputFileAnswer || EXAMPLE_INPUT_FILE;
            rl.question(
                `Enter brand name [${EXAMPLE_APP_NAME}]: `,
                async (brandNameAnswer) => {
                    const brandName = brandNameAnswer || EXAMPLE_APP_NAME;
                    rl.close();
                    try {
                        await main(inputFile, brandName);
                    } catch (err) {
                        console.error(
                            "Failed to generate branding assets",
                            err
                        );
                        process.exit(1);
                    }
                }
            );
        }
    );
}

async function main(inputFile, brandName) {
    const resolvedPath = path.resolve(inputFile);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Input file not found: ${resolvedPath}`);
    }

    const inputIsSVG = path.extname(inputFile).toLowerCase() === ".svg";
    const logo = fs.readFileSync(resolvedPath, inputIsSVG ? "utf-8" : null);

    const logoBuffer = inputIsSVG ? Buffer.from(logo) : logo;
    const {primary, white} = await getBrandColors(logoBuffer);
    const brand = {name: brandName, primary, white};

    ensureDir(out("assets"));

    const logoSVGFor = (opts) => logoSVG({...opts, inputIsSVG, logo});
    const splashSVGFor = (opts) =>
        splashSVG({...opts, inputIsSVG, logo, logoSVG: logoSVGFor});
    const svgToPngFor = (svg, filePath, width, height, padding) =>
        svgToPng(svg, filePath, width, height, brand, {
            inputIsSVG,
            logo,
            padding,
        });

    // Icon (gradient bg + white rings)
    const iconSvg = logoSVGFor({
        size: 1024,
        stroke: 64,
        color: brand.white,
        withGradientBg: true,
        brand,
    });
    await svgToPngFor(iconSvg, out("assets/icon.png"), 1024, 1024);

    // Adaptive icon (transparent bg + white rings)
    const adaptiveSvg = logoSVGFor({
        size: 1024,
        stroke: 64,
        color: brand.white,
        bg: "transparent",
        withGradientBg: false,
        brand,
    });
    await svgToPngFor(adaptiveSvg, out("assets/adaptive-icon.png"), 1024, 1024);

    // Splash
    const splashSvg = splashSVGFor({width: 1284, height: 2778, brand});
    await svgToPngFor(splashSvg, out("assets/splash.png"), 1284, 2778);

    // Favicon 64x64 (simple white rings on blue bg)
    const faviconSvg = logoSVGFor({
        size: 256,
        stroke: 24,
        color: brand.white,
        withGradientBg: true,
        brand,
    });
    await svgToPngFor(faviconSvg, out("assets/favicon.png"), 64, 64);

    console.log(`✅ Generated ${brand.name} branding assets in assets/*.png`);

    ensureDir(out("resources"));

    const appIcon = logoSVGFor({
        size: 512,
        stroke: 32,
        color: brand.white,
        bg: "transparent",
        withGradientBg: false,
        brand,
    });
    await svgToPngFor(appIcon, out("resources/app-icon.png"), 512, 512);

    const featureGraphic = logoSVGFor({
        size: 1024,
        stroke: 64,
        color: brand.white,
        bg: "transparent",
        withGradientBg: false,
        brand,
    });
    await svgToPngFor(
        featureGraphic,
        out("resources/feature-graphic.png"),
        1024,
        500
    );

    const socialFeatureGraphic = logoSVGFor({
        size: 1900,
        stroke: 96,
        color: brand.white,
        bg: "#000000",
        withGradientBg: false,
        brand,
    });

    await svgToPngFor(
        socialFeatureGraphic,
        out("resources/social-feature-graphic.png"),
        1900,
        900,
        {
            top: 700,
            left: 1200,
        }
    );

    console.log(`✅ Generated ${brand.name} resources in resources/*.png`);
}

run().catch((err) => {
    console.error("An unexpected error occurred in run()", err);
    process.exit(1);
});
