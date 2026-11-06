<?php
// /api/server.php

// ---- CORS (adjust origin as needed) ----
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

// ---- Config ----
$dataDir = __DIR__ . "/data";
$allowedResources = ["trucks", "drivers", "customers", "loads"];

// ---- Helpers ----
function json_response($payload, $code = 200) {
  http_response_code($code);
  echo json_encode($payload, JSON_PRETTY_PRINT);
  exit;
}

function read_body_json() {
  $raw = file_get_contents("php://input");
  if (!$raw) return [];
  $decoded = json_decode($raw, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    json_response(["error" => "Invalid JSON body", "details" => json_last_error_msg()], 400);
  }
  return $decoded ?? [];
}

function safe_id_prefix($resource) {
  // Make IDs like T-xxxxx, D-xxxxx, etc.
  switch ($resource) {
    case "trucks": return "T-";
    case "drivers": return "D-";
    case "customers": return "C-";
    case "loads": return "L-";
    default: return "X-";
  }
}

function generate_id($prefix) {
  // Simple, good-enough for file-backed JSON (swap to UUID if you want)
  return $prefix . substr(strval(time()), -6) . rand(100, 999);
}

function file_path_for($dataDir, $resource) {
  return $dataDir . "/" . $resource . ".json";
}

function load_items($filePath) {
  if (!file_exists($filePath)) return [];
  $raw = file_get_contents($filePath);
  if ($raw === false || trim($raw) === "") return [];
  $decoded = json_decode($raw, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    json_response(["error" => "Corrupt JSON file", "file" => basename($filePath)], 500);
  }
  return is_array($decoded) ? $decoded : [];
}

function save_items_atomic($filePath, $items) {
  // Write atomically to avoid partial writes
  $tmp = $filePath . ".tmp";
  $json = json_encode($items, JSON_PRETTY_PRINT);
  if ($json === false) {
    json_response(["error" => "Failed to encode JSON"], 500);
  }

  // Use file locking on tmp file write
  $fp = fopen($tmp, "c");
  if (!$fp) json_response(["error" => "Failed to open temp file for write"], 500);
  if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(["error" => "Failed to lock file"], 500);
  }

  ftruncate($fp, 0);
  fwrite($fp, $json);
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);

  // Replace original
  rename($tmp, $filePath);
}

// ---- Parse route ----
// Expecting URLs like: /api/trucks or /api/trucks/T-1001
$uriPath = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Remove leading path up to /api/ if needed.
// If server.php sits at /api/server.php, then requests can be /api/trucks (via rewrite).
// We'll compute path relative to the /api/ directory name:
$baseDirName = basename(__DIR__); // "api"
$parts = explode("/", trim($uriPath, "/"));

// Find index of "api" in the URL path
$apiIndex = array_search($baseDirName, $parts);
$relative = [];
if ($apiIndex !== false) {
  $relative = array_slice($parts, $apiIndex + 1); // after "api"
} else {
  // fallback: assume entire path is relative
  $relative = $parts;
}

$resource = $relative[0] ?? null;
$id = $relative[1] ?? null;

if (!$resource || !in_array($resource, $allowedResources, true)) {
  json_response(["error" => "Unknown resource", "allowed" => $allowedResources], 404);
}

if (!is_dir($dataDir)) {
  json_response(["error" => "Data directory missing", "path" => $dataDir], 500);
}

$filePath = file_path_for($dataDir, $resource);
$method = $_SERVER["REQUEST_METHOD"];

$items = load_items($filePath);

// ---- Routes ----
if ($method === "GET" && !$id) {
  json_response($items, 200);
}

if ($method === "GET" && $id) {
  $found = null;
  foreach ($items as $it) {
    if (isset($it["id"]) && $it["id"] === $id) {
      $found = $it;
      break;
    }
  }
  if (!$found) json_response(["error" => "Not found"], 404);
  json_response($found, 200);
}

if ($method === "POST" && !$id) {
  $body = read_body_json();

  if (!isset($body["id"]) || $body["id"] === "" || $body["id"] === null) {
    $body["id"] = generate_id(safe_id_prefix($resource));
  }

  $items[] = $body;
  save_items_atomic($filePath, $items);
  json_response($body, 201);
}

if ($method === "PUT" && $id) {
  $body = read_body_json();

  $idx = -1;
  for ($i = 0; $i < count($items); $i++) {
    if (isset($items[$i]["id"]) && $items[$i]["id"] === $id) {
      $idx = $i;
      break;
    }
  }
  if ($idx === -1) json_response(["error" => "Not found"], 404);

  // Merge update, keep id stable
  $updated = array_merge($items[$idx], $body);
  $updated["id"] = $items[$idx]["id"];

  $items[$idx] = $updated;
  save_items_atomic($filePath, $items);
  json_response($updated, 200);
}

if ($method === "DELETE" && $id) {
  $idx = -1;
  for ($i = 0; $i < count($items); $i++) {
    if (isset($items[$i]["id"]) && $items[$i]["id"] === $id) {
      $idx = $i;
      break;
    }
  }
  if ($idx === -1) json_response(["error" => "Not found"], 404);

  $removed = $items[$idx];
  array_splice($items, $idx, 1);
  save_items_atomic($filePath, $items);
  json_response($removed, 200);
}

json_response(["error" => "Unsupported route/method"], 405);

?>