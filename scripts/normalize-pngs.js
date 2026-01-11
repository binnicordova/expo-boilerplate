#!/usr/bin/env node
/*
  This script normalizes all PNG files in the assets directory to a format
  that is compatible with the Android build process (AAPT).
  It reads each PNG and re-saves it, which helps fix issues with color profiles,
  bit depth, or other metadata that can cause build failures.
*/
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

const assetsDir = path.resolve(__dirname, "../assets");

async function findPngFiles(dir) {
    let pngFiles = [];
    try {
        const entries = await fs.readdir(dir, {withFileTypes: true});
        for (const entry of entries) {
            const fullPath = path.resolve(dir, entry.name);
            if (entry.isDirectory()) {
                pngFiles = pngFiles.concat(await findPngFiles(fullPath));
            } else if (
                entry.isFile() &&
                path.extname(entry.name).toLowerCase() === ".png"
            ) {
                pngFiles.push(fullPath);
            }
        }
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    return pngFiles;
}

async function normalizePng(filePath) {
    try {
        console.log(`Normalizing ${path.basename(filePath)}...`);
        const buffer = await fs.readFile(filePath);
        const normalizedBuffer = await sharp(buffer).png().toBuffer();
        await fs.writeFile(filePath, normalizedBuffer);
        console.log(`✅ Normalized ${path.basename(filePath)}`);
    } catch (error) {
        console.error(
            `❌ Failed to normalize ${path.basename(filePath)}:`,
            error
        );
    }
}

async function main() {
    console.log("Searching for PNG files to normalize...");
    const pngFiles = await findPngFiles(assetsDir);

    if (pngFiles.length === 0) {
        console.log("No PNG files found in the assets directory.");
        return;
    }

    console.log(
        `Found ${pngFiles.length} PNG file(s). Starting normalization...`
    );
    await Promise.all(pngFiles.map(normalizePng));
    console.log("\nNormalization complete.");
}

main().catch((err) => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
