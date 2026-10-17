import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import matter from "gray-matter";
import { defaultLocale, locales } from "../src/i18n/config.ts";
import { createProjectContent, isPublished } from "../src/lib/project-content.ts";

const base = {
  title: "A real project",
  client: "Example client",
  year: 2026,
  summary: "A bounded implementation for the client's workflow.",
};

async function fixture(t, production = true) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "vnt-projects-"));
  assert.equal(path.dirname(rootDir), path.resolve(tmpdir()));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  const contentDir = path.join(rootDir, "content", "projects");
  const publicDir = path.join(rootDir, "public");
  await mkdir(contentDir, { recursive: true });
  await mkdir(publicDir);
  const content = createProjectContent({
    contentDir,
    publicDir,
    locales,
    defaultLocale,
    production,
  });

  async function write(
    slug,
    locale,
    fields = {},
    body = "## The work\n\nDelivered scope.",
  ) {
    const directory = path.join(contentDir, slug);
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, `${locale}.mdx`),
      matter.stringify(body, { ...base, ...fields }),
      "utf8",
    );
  }

  async function publish(slug, fields = {}, body) {
    for (const locale of locales) await write(slug, locale, fields, body);
  }

  async function asset(relativePath) {
    const absolutePath = path.join(publicDir, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, "image fixture", "utf8");
  }

  return { ...content, write, publish, asset };
}

test("legacy projects keep defaults and translated scope remains locale-specific", async (t) => {
  const content = await fixture(t);
  await content.write("legacy", "es", { scope: ["Catálogo"] });
  await content.write("legacy", "en", { title: "Translated title", scope: ["Catalog"] });
  const es = await content.getProject("legacy", "es");
  const en = await content.getProject("legacy", "en");
  assert.equal(es.frontmatter.status, "live");
  assert.equal(es.frontmatter.kind, "website");
  assert.equal(es.frontmatter.draft, false);
  assert.deepEqual(es.frontmatter.scope, ["Catálogo"]);
  assert.deepEqual(en.frontmatter.scope, ["Catalog"]);
  assert.equal(en.locale, "en");
  assert.equal(en.frontmatter.title, "Translated title");
  await content.publish("without-scope");
  assert.deepEqual(
    (await content.getProject("without-scope", "es")).frontmatter.scope,
    [],
  );
});

test("delivered and in-progress projects are public independently from draft", async (t) => {
  const content = await fixture(t);
  await content.publish("delivered", { status: "delivered", kind: "internal-tool" });
  await content.publish("ongoing", { status: "in-progress", kind: "catalog" });
  const projects = await content.getAllProjects("es");
  assert.deepEqual(projects.map(({ slug }) => slug).sort(), ["delivered", "ongoing"]);
  for (const project of projects) assert.equal(isPublished(project, true), true);
});

test("unsupported status, kind and blank scope entries fail with the source path", async (t) => {
  const content = await fixture(t);
  for (const [field, value] of [
    ["status", "planned"],
    ["kind", "application"],
    ["scope", ["  "]],
  ]) {
    await content.write("invalid", "es", { [field]: value });
    await assert.rejects(content.getProject("invalid", "es"), (error) => {
      assert.match(error.message, /invalid[\\/]es\.mdx/);
      assert.ok(error.message.includes(field));
      return true;
    });
  }
});

test("drafts never enter production lists or featured selections", async (t) => {
  const content = await fixture(t);
  await content.publish("visible", { featured: true });
  await content.write("unpublished", "es", {
    draft: true,
    featured: true,
    order: 0,
    status: "live",
  });
  const draft = await content.getProject("unpublished", "en");
  assert.equal(draft.locale, "es");
  assert.equal(isPublished(draft, true), false);
  assert.equal(isPublished(draft, false), true);
  assert.deepEqual(
    (await content.getAllProjects("es")).map(({ slug }) => slug),
    ["visible"],
  );
  assert.deepEqual(
    (await content.getFeaturedProjects("en")).map(({ slug }) => slug),
    ["visible"],
  );
  assert.equal(await content.getProject("missing", "es"), null);
});

test("development keeps drafts and the locale fallback", async (t) => {
  const content = await fixture(t, false);
  await content.write("draft", "es", { draft: true });
  const [project] = await content.getAllProjects("en");
  assert.equal(project.slug, "draft");
  assert.equal(project.locale, "es");
});

test("production requires every translation and consistent publication flags", async (t) => {
  const content = await fixture(t);
  await content.write("incomplete", "es");
  await assert.rejects(content.getProject("incomplete", "es"), /requiere en\.mdx/);
  await content.write("incomplete", "en", { draft: true });
  await assert.rejects(content.getAllProjects("es"), /todos los idiomas/);
  await content.write("incomplete", "en", { status: "delivered" });
  await assert.rejects(content.getAllProjects("es"), /status y kind deben coincidir/);
  await content.write("incomplete", "en", { kind: "mixed" });
  await assert.rejects(content.getAllProjects("es"), /status y kind deben coincidir/);
});

test("sorting and featured fallback preserve editorial order and limit", async (t) => {
  const content = await fixture(t);
  await content.publish("older", { order: 2, year: 2024 });
  await content.publish("newer", { order: 2, year: 2026 });
  await content.publish("priority", { order: 1, year: 2020 });
  assert.deepEqual(
    (await content.getAllProjects("es")).map(({ slug }) => slug),
    ["priority", "newer", "older"],
  );
  assert.deepEqual(
    (await content.getFeaturedProjects("es", 2)).map(({ slug }) => slug),
    ["priority", "newer"],
  );
  await content.publish("older", { order: 2, year: 2024, featured: true });
  assert.deepEqual(
    (await content.getFeaturedProjects("es")).map(({ slug }) => slug),
    ["older"],
  );
});

test("cover alt and local cover existence are required when a cover is supplied", async (t) => {
  const content = await fixture(t);
  await content.publish("cover", { cover: "/projects/cover/home.webp" });
  await assert.rejects(content.getAllProjects("es"), /coverAlt/);
  await content.publish("cover", {
    cover: "/projects/cover/home.webp",
    coverAlt: "Project home page",
  });
  await assert.rejects(content.getAllProjects("es"), /Falta la imagen publicada/);
  await content.asset("projects/cover/home.webp");
  assert.equal((await content.getAllProjects("es")).length, 1);
});

test("rendered Figure and Markdown image references must exist in public", async (t) => {
  const content = await fixture(t);
  const body = [
    '<Figure src="/projects/images/figure.webp" width={100} height={100} alt="Detail" />',
    '![Detail](/projects/images/markdown.webp "Caption")',
    '{/* <Figure src="/projects/images/commented.webp" /> */}',
  ].join("\n\n");
  await content.publish("images", {}, body);
  await assert.rejects(content.getAllProjects("es"), /figure\.webp/);
  await content.asset("projects/images/figure.webp");
  await assert.rejects(content.getAllProjects("es"), /markdown\.webp/);
  await content.asset("projects/images/markdown.webp");
  assert.equal((await content.getAllProjects("en")).length, 1);
});

test("local image paths cannot point outside public or use filesystem absolutes", async (t) => {
  const content = await fixture(t);
  for (const reference of [
    "/../outside.webp",
    "/%2e%2e/outside.webp",
    "C:\\images\\cover.webp",
  ]) {
    await content.publish("paths", { cover: reference, coverAlt: "Project cover" });
    await assert.rejects(content.getAllProjects("es"), /public/);
  }
});

test("repository portfolio validates both locales and hides every draft", async () => {
  const options = {
    contentDir: path.join(process.cwd(), "content", "projects"),
    publicDir: path.join(process.cwd(), "public"),
    locales,
    defaultLocale,
  };
  const production = createProjectContent({ ...options, production: true });
  const development = createProjectContent({ ...options, production: false });
  const es = await production.getAllProjects("es");
  const en = await production.getAllProjects("en");
  assert.deepEqual(
    es.map(({ slug }) => slug),
    en.map(({ slug }) => slug),
  );
  for (const locale of locales) {
    const visibleSlugs = (await production.getAllProjects(locale)).map(
      ({ slug }) => slug,
    );
    for (const project of await development.getAllProjects(locale)) {
      if (project.frontmatter.draft)
        assert.equal(visibleSlugs.includes(project.slug), false);
    }
  }
});
