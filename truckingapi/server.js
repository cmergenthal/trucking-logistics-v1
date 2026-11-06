// api/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8101;

// Middleware
app.use(cors());                // allow all origins in dev; tighten for prod
app.use(express.json());        // parse JSON bodies

// Helper to get path to data files
const dataDir = path.join(__dirname, "data");

const getFilePath = (name) => path.join(dataDir, `${name}.json`);

async function readJson(name) {
  const filePath = getFilePath(name);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(name, data) {
  const filePath = getFilePath(name);
  // pretty-print for easier manual editing
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf8");
}

// Simple ID generator (you can swap for uuid later)
function generateId(prefix = "") {
  const now = Date.now();
  const rnd = Math.floor(Math.random() * 1000);
  return `${prefix}${now}${rnd}`;
}

// ---- Generic CRUD route factory ----
function createCrudRoutes(resourceName) {
  const router = express.Router();

  // GET /api/<resource>
  router.get("/", async (req, res) => {
    try {
      const items = await readJson(resourceName);
      res.json(items);
    } catch (err) {
      console.error(`Error reading ${resourceName}:`, err);
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // GET /api/<resource>/:id
  router.get("/:id", async (req, res) => {
    try {
      const items = await readJson(resourceName);
      const item = items.find((i) => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Not found" });
      }
      res.json(item);
    } catch (err) {
      console.error(`Error reading ${resourceName}:`, err);
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // POST /api/<resource>
  router.post("/", async (req, res) => {
    try {
      const items = await readJson(resourceName);
      const body = req.body || {};

      // make sure id exists
      if (!body.id) {
        body.id = generateId(resourceName[0].toUpperCase() + "-");
      }

      items.push(body);
      await writeJson(resourceName, items);
      res.status(201).json(body);
    } catch (err) {
      console.error(`Error creating ${resourceName} item:`, err);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  // PUT /api/<resource>/:id (replace/update)
  router.put("/:id", async (req, res) => {
    try {
      const items = await readJson(resourceName);
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Not found" });
      }

      const updated = {
        ...items[index],
        ...req.body,
        id: items[index].id, // keep id stable
      };

      items[index] = updated;
      await writeJson(resourceName, items);
      res.json(updated);
    } catch (err) {
      console.error(`Error updating ${resourceName} item:`, err);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // DELETE /api/<resource>/:id
  router.delete("/:id", async (req, res) => {
    try {
      const items = await readJson(resourceName);
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Not found" });
      }

      const [removed] = items.splice(index, 1);
      await writeJson(resourceName, items);
      res.json(removed);
    } catch (err) {
      console.error(`Error deleting ${resourceName} item:`, err);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  return router;
}

// Mount resource routers
app.use("/api/trucks", createCrudRoutes("trucks"));
app.use("/api/drivers", createCrudRoutes("drivers"));
app.use("/api/customers", createCrudRoutes("customers"));
app.use("/api/loads", createCrudRoutes("loads"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Trucking API is running" });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
