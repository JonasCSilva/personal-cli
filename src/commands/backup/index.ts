import "https://deno.land/std@0.181.0/dotenv/load.ts";
import { join } from "https://deno.land/std@0.181.0/path/mod.ts";
import backupAirtable from "./backuppers/backup-airtable.ts";
import backupDatoCMS from "./backuppers/backup-datocms.ts";
import backupGitHub from "./backuppers/backup-github.ts";
import backupHabitica from "./backuppers/backup-habitica.ts";
import backupSpotify from "./backuppers/backup-spotify.ts";
import backupScoop from "./backuppers/backup-scoop.ts";
import backupFile from "./backuppers/backup-file.ts";
import backupWinget from "./backuppers/backup-winget.ts";

export async function backup() {
  const backupPath = join(Deno.cwd(), "dist");

  const vsCodeSettingsPath = join(
    Deno.env.get("USERPROFILE")!,
    "AppData",
    "Roaming",
    "Code",
    "User",
    "settings.json",
  );

  await Promise.all([
    backupAirtable(backupPath, "1"),
    backupAirtable(backupPath, "2"),
    backupDatoCMS(backupPath),
    backupGitHub(backupPath),
    backupFile(
      backupPath,
      vsCodeSettingsPath,
      "vs-code",
    ),
    backupHabitica(backupPath),
    backupScoop(backupPath),
    backupSpotify(backupPath),
    backupWinget(backupPath),
  ]);
}
