const fs = require("fs");
const path = require("path");
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
require("dotenv").config();

const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "data", "db.json");

const BUCKET = process.env.BUCKET;
const ENDPOINT = process.env.ENDPOINT;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const REGION = process.env.B2_REGION || "us-east-005";

if (!BUCKET || !ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error("ERROR: B2 environment variables are missing.");
  console.error("Required: BUCKET, ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY");
  process.exit(1);
}

const songsToImport = [
  { title: "Sidu Sidu", key: "Sidu Sidu.mp3" },
  { title: "Uyir-Uruvaatha-Uru", key: "Uyir-Uruvaatha-Uru.mp3" },
  { title: "Pesum Mazhai", key: "Pesum Mazhai.mp3" },
  { title: "Kurumugil", key: "Kurumugil.mp3" },
  { title: "Kurunchiragu", key: "Kurunchiragu.mp3" },
  { title: "Inayae", key: "Inayae.mp3" },
  { title: "Blinding Lights", key: "Blinding_Lights.mp3" },
  { title: "End Of Beginning", key: "End Of Beginning.mp3" },
  { title: "Espresso", key: "Espresso.mp3" },
  { title: "Heeriye", key: "Heeriye.mp3" },
  { title: "Jhol", key: "Jhol.mp3" },
  { title: "Lovely", key: "Lovely.mp3" },
  { title: "Play Date Lilly Brooks", key: "Play Date Lilly Brooks.mp3" },
  { title: "Sahiba", key: "Sahiba.mp3" },
  { title: "Shape of You", key: "Shape of You .mp3" },
  { title: "Taste", key: "Taste.mp3" },
  { title: "Tere Vaaste Zara Hatke", key: "Tere Vaaste Zara Hatke .mp3" },
  { title: "hiii", key: "hiii .mp3" },
  { title: "edsheeran.", key: "edsheeran..mp3" },
  { title: "Night Changes", key: "One Direction - Night Changes.mp3" }
];


const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found: ${DB_PATH}`);
  }

  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}

function getSongsArray(db) {
  if (Array.isArray(db)) return db;

  if (Array.isArray(db.songs)) return db.songs;

  throw new Error(
    "Could not find the songs array in data/db.json."
  );
}

async function b2ObjectExists(key) {
  try {
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: key,
        MaxKeys: 10
      })
    );

    return (result.Contents || []).some(
      item => item.Key === key
    );
  } catch (err) {
    console.error(`B2 check failed for "${key}":`, err.message);
    return false;
  }
}

function makeSong(title, key) {
  return {
    title,
    artist: "Unknown Artist",
    album: "",
    file: "",
    cover: "",
    b2Key: key
  };
}

async function main() {
  console.log("");
  console.log("========================================");
  console.log(" SYNTH AUDIO V65 - B2 SONG IMPORT");
  console.log("========================================");
  console.log("");
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Database: ${DB_PATH}`);
  console.log("");

  const db = loadDatabase();
  const songs = getSongsArray(db);

  console.log(`Existing songs: ${songs.length}`);
  console.log("");

  let added = 0;
  let alreadyExists = 0;
  let missing = 0;

  for (const item of songsToImport) {
    console.log(`Checking: ${item.title}`);

    const existsInB2 = await b2ObjectExists(item.key);

    if (!existsInB2) {
      console.log(`  B2 file NOT FOUND: ${item.key}`);
      missing++;
      continue;
    }

    const existing = songs.find(song => {
      return (
        song.b2Key === item.key ||
        song.title === item.title
      );
    });

    if (existing) {
      if (!existing.b2Key) {
        existing.b2Key = item.key;
      }

      if (existing.file === undefined) {
        existing.file = "";
      }

      if (existing.cover === undefined) {
        existing.cover = "";
      }

      console.log("  Already in database - updated B2 reference.");
      alreadyExists++;
      continue;
    }

    const newSong = makeSong(item.title, item.key);
    songs.push(newSong);

    console.log(`  ADDED: ${item.key}`);
    added++;
  }

  const output = JSON.stringify(db, null, 2);

  const backupPath =
    DB_PATH.replace(
      /\.json$/i,
      `.backup-before-b2-import-${Date.now()}.json`
    );

  fs.copyFileSync(DB_PATH, backupPath);
  fs.writeFileSync(DB_PATH, output, "utf8");

  console.log("");
  console.log("========================================");
  console.log(" IMPORT COMPLETE");
  console.log("========================================");
  console.log(`Added:          ${added}`);
  console.log(`Already existed:${alreadyExists}`);
  console.log(`Missing in B2:  ${missing}`);
  console.log(`Total songs:    ${songs.length}`);
  console.log("");
  console.log(`Backup created: ${backupPath}`);
  console.log("");
  console.log("The existing Synth Audio files were not replaced.");
  console.log("The existing B2 configuration was not changed.");
  console.log("");
}

main().catch(err => {
  console.error("");
  console.error("IMPORT FAILED");
  console.error(err);
  process.exit(1);
});
