#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";
import { TwitterUsersSchema } from "./data";
import PQueue from "p-queue";

// Parse input file and load existing profiles
const misa = TwitterUsersSchema.parse(
  JSON.parse(await readFile(process.argv[2], "utf-8"))
);

let profiles = JSON.parse(await readFile("profiles.json", "utf-8"));

// Create a queue with concurrency of 3
const queue = new PQueue({ concurrency: 30 });

// Add all fetch tasks to the queue
for (const p of misa) {
  const screen_name = p.result.legacy.screen_name;

  // Skip if already exists in profiles
  if (profiles.find((profile) => profile.username === screen_name)) {
    continue;
  }

  // Add task to queue
  queue.add(async () => {
    console.log(`Fetching ${screen_name}`);
    const res = await fetch(
      `https://docial.nulo.lol/api/users/@${screen_name}`,
      {
        headers: {
          Authorization: "Bearer " + process.argv[3],
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (res.status === 404) return;

    const txt = await res.text();
    const data = JSON.parse(txt);
    profiles.push(data.profile);
    console.log(`Added: ${screen_name} - Total: ${profiles.length}`);
    await writeFile("profiles.json", JSON.stringify(profiles, null, 2));
  });
}

// Wait for all tasks to complete
await queue.onIdle();
console.log("All tasks completed");
