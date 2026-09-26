const yaml = require("js-yaml");

function pathPrefixFromEnv() {
  const raw = process.env.PATH_PREFIX;
  if (!raw || raw === "/") {
    return "/";
  }
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function compareIssue(a, b) {
  const year = Number(a.year) - Number(b.year);
  if (year) return year;
  const issue = Number(a.issue) - Number(b.issue);
  if (issue) return issue;
  return (a.second ? 1 : 0) - (b.second ? 1 : 0);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml,yaml", {
    parser: (contents) => yaml.load(contents),
  });

  eleventyConfig.ignores.add("src/admin/**");
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/pdfs": "pdfs" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  // Decap writes one file per paper per year. Rebuild when those change.
  eleventyConfig.addWatchTarget("./src/volumes/");

  eleventyConfig.addFilter("telHref", (value) => {
    const digits = String(value || "").replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) return digits;
    if (digits.startsWith("354")) return `+${digits}`;
    return `+354${digits}`;
  });

  eleventyConfig.addFilter("forPaper", (list, paperId) => {
    return (list || []).filter((item) => item.paper === paperId).sort(compareIssue);
  });

  eleventyConfig.addFilter("latestIssue", (list) => {
    const sorted = [...(list || [])].sort(compareIssue);
    return sorted.length ? sorted[sorted.length - 1] : null;
  });

  eleventyConfig.addFilter("groupByYear", (list) => {
    const groups = new Map();
    for (const item of [...(list || [])].sort(compareIssue)) {
      const year = Number(item.year);
      if (!groups.has(year)) {
        groups.set(year, { year, items: [] });
      }
      groups.get(year).items.push(item);
    }
    return [...groups.values()].sort((a, b) => b.year - a.year);
  });

  eleventyConfig.addGlobalData("buildYear", new Date().getFullYear());

  return {
    pathPrefix: pathPrefixFromEnv(),
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
