import assert from "node:assert/strict";
import { test } from "node:test";
import { submitContact } from "../src/lib/contact-validation.ts";

const baseValues = {
  name: "Ada",
  email: "ada@example.com",
  company: "Example",
  message: "Please tell me about your services.",
};

function makeForm(overrides = {}) {
  const formData = new FormData();
  const fields = {
    ...baseValues,
    locale: "es",
    website: "",
    ...overrides,
  };
  for (const [field, value] of Object.entries(fields)) {
    formData.set(field, value);
  }
  return formData;
}

test("an oversized company reports its field and skips delivery", async () => {
  let deliveries = 0;
  let events = 0;
  const state = await submitContact(makeForm({ company: "x".repeat(201) }), {
    send: async () => {
      deliveries += 1;
      return true;
    },
    onSubmitted: async () => {
      events += 1;
    },
  });
  assert.deepEqual(state, {
    status: "error",
    fieldErrors: { company: true },
    fieldValues: { ...baseValues, company: "x".repeat(200) },
  });
  assert.equal(deliveries, 0);
  assert.equal(events, 0);
});

test("a filled honeypot succeeds before validation without delivery or analytics", async () => {
  const formData = new FormData();
  formData.set("website", "https://spam.example");
  const state = await submitContact(formData, {
    send: async () => assert.fail("The honeypot must not send mail"),
    onSubmitted: async () => assert.fail("The honeypot must not emit events"),
  });
  assert.deepEqual(state, { status: "success" });
});

test("validation reports all invalid editable fields", async () => {
  const state = await submitContact(
    makeForm({ name: "  ", email: "invalid", message: "short" }),
    { send: async () => assert.fail("Invalid fields must not reach the provider") },
  );
  assert.deepEqual(state, {
    status: "error",
    fieldErrors: { name: true, email: true, message: true },
    fieldValues: { ...baseValues, name: "  ", email: "invalid", message: "short" },
  });
});

test("an unsupported locale gets a visible general error without delivery", async () => {
  const state = await submitContact(makeForm({ locale: "fr" }), {
    send: async () => assert.fail("Only configured locales may reach the provider"),
  });
  assert.deepEqual(state, { status: "error", fieldValues: baseValues });
});

test("accepted delivery trims inputs and only then records the locale", async () => {
  const calls = [];
  const state = await submitContact(
    makeForm({
      name: " Ada ",
      email: " ada@example.com ",
      company: " Example ",
      message: " Please tell me about your services. ",
      locale: "en",
    }),
    {
      send: async (submission) => {
        calls.push(["delivery", submission]);
        return true;
      },
      onSubmitted: async (...properties) => {
        calls.push(["analytics", ...properties]);
      },
    },
  );
  assert.deepEqual(state, { status: "success" });
  assert.deepEqual(calls, [
    [
      "delivery",
      {
        name: "Ada",
        email: "ada@example.com",
        company: "Example",
        message: "Please tell me about your services.",
        locale: "en",
      },
    ],
    ["analytics", "en"],
  ]);
});

test("a provider rejection preserves original input without recording a submission", async () => {
  const originalMessage = "  Please preserve my original message.  ";
  const state = await submitContact(makeForm({ message: originalMessage }), {
    send: async () => false,
    onSubmitted: async () => assert.fail("Rejected mail must not count as submitted"),
  });
  assert.deepEqual(state, {
    status: "error",
    fieldValues: { ...baseValues, message: originalMessage },
  });
});

test("a provider exception returns an error without recording a submission", async () => {
  const state = await submitContact(makeForm(), {
    send: async () => {
      throw new Error("Simulated provider outage");
    },
    onSubmitted: async () => assert.fail("Failed mail must not count as submitted"),
  });
  assert.deepEqual(state, { status: "error", fieldValues: baseValues });
});

test("analytics failure preserves accepted delivery", async () => {
  let accepted = false;
  const state = await submitContact(makeForm(), {
    send: async () => {
      accepted = true;
      return true;
    },
    onSubmitted: async () => {
      assert.equal(accepted, true);
      throw new Error("Simulated analytics outage");
    },
  });
  assert.deepEqual(state, { status: "success" });
});

test("valid boundary lengths and an omitted company are accepted", async () => {
  const formData = makeForm({ name: "n".repeat(200), message: "m".repeat(5000) });
  formData.delete("company");
  const state = await submitContact(formData, {
    send: async (submission) => {
      assert.equal(submission.company, undefined);
      return true;
    },
  });
  assert.deepEqual(state, { status: "success" });
});

test("oversized fields are rejected and values returned to the form are bounded", async () => {
  const state = await submitContact(
    makeForm({
      name: "n".repeat(201),
      email: "e".repeat(1000),
      company: "c".repeat(201),
      message: "m".repeat(5001),
    }),
    { send: async () => assert.fail("Oversized fields must not reach the provider") },
  );
  assert.deepEqual(state, {
    status: "error",
    fieldErrors: { name: true, email: true, company: true, message: true },
    fieldValues: {
      name: "n".repeat(200),
      email: "e".repeat(254),
      company: "c".repeat(200),
      message: "m".repeat(5000),
    },
  });
});

test("file inputs are rejected and never become text field defaults", async () => {
  const formData = makeForm();
  formData.set("message", new Blob(["Not a text field"]), "project.txt");
  const state = await submitContact(formData, {
    send: async () => assert.fail("Files must not reach the provider"),
    onSubmitted: async () => assert.fail("Invalid fields must not emit events"),
  });
  assert.deepEqual(state, {
    status: "error",
    fieldErrors: { message: true },
    fieldValues: {
      name: "Ada",
      email: "ada@example.com",
      company: "Example",
    },
  });
});
