const forbidden = /[«»:]/g;

function clean(value) {
  return value.replace(forbidden, "").replace(/\s+/g, " ").trim();
}

export function codeSampleLabel({ title, language, order, used }) {
  const named = clean(title ?? "");
  const lang = clean(language ?? "");
  const base = named
    ? named
    : lang
      ? `${lang} code ${order}`
      : `Code sample ${order}`;
  let label = base;
  let extra = 2;
  while (used.has(label)) {
    label = `${base} ${extra}`;
    extra += 1;
  }
  used.add(label);
  return label;
}
