import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        {
          name: "kimetsu-code-language",
          pre(node) {
            const lang = this.options.lang;
            if (typeof lang === "string" && lang.length > 0) {
              node.properties.dataLanguage = lang;
            }
            const title = this.options.meta?.title;
            if (typeof title === "string" && title.length > 0) {
              node.properties.dataTitle = title;
            }
          },
        },
      ],
    },
  },
});
