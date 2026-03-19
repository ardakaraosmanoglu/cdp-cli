import { getPackageVersion, fetchLatestVersion, isNewerVersion } from "../utils/update-checker.js";
import { success, warning, colors } from "../utils/colors.js";

export async function versionCommand(): Promise<void> {
  const pkg = await getPackageVersion();
  const latestVersion = await fetchLatestVersion(pkg.name);
  
  console.log(`\n${colors.bold("cdp")} version ${colors.info(pkg.version)}\n`);
  
  if (!latestVersion) {
    console.log("  Could not check for updates.\n");
    return;
  }
  
  if (isNewerVersion(latestVersion, pkg.version)) {
    console.log(`  ${warning("Update available:")} ${pkg.version} → ${latestVersion}`);
    console.log(`  ${colors.dim("Run: npm install -g " + pkg.name + "@latest")}\n`);
  } else {
    console.log(`  ${colors.success("You are on the latest version.")}\n`);
  }
}
