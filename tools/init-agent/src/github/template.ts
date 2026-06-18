type TemplateValues = Record<string, string | number | null | undefined>;

export function renderTemplate(template: string, values: TemplateValues) {
  return template.replace(/\{([a-zA-Z0-9]+)\}/g, (match, key) => {
    const value = values[key];
    return value === null || value === undefined ? match : String(value);
  });
}

export function normalizeShortTitle(title: string) {
  return title.replace(/^Init:\s*/i, '').trim();
}

