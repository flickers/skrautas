const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function isSecondEdition(item) {
  if (item.second === true || item.second === "true") return true;
  return Boolean(item.edition && String(item.edition).trim());
}

function readVolumes(dir, paperFromFolder, issues) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      readVolumes(full, entry.name, issues);
      continue;
    }
    if (!entry.name.endsWith(".yml") && !entry.name.endsWith(".yaml")) continue;

    const data = yaml.load(fs.readFileSync(full, "utf8")) || {};
    const paper = paperFromFolder || (data.paper ? String(data.paper) : "");
    const yearFromName = Number(path.basename(entry.name, path.extname(entry.name)));
    const year = Number(data.year || yearFromName);
    const list = Array.isArray(data.issues) ? data.issues : [];

    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      issues.push({
        paper,
        year,
        issue: Number(item.issue),
        second: isSecondEdition(item),
        url: item.url ? String(item.url).trim() : "",
        pdf: item.pdf ? String(item.pdf).trim() : "",
      });
    }
  }
}

module.exports = function () {
  const issues = [];
  readVolumes(path.join(__dirname, "..", "volumes"), "", issues);
  return issues;
};
