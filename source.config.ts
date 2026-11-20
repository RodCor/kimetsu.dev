import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { codeSampleLabel } from "./src/lib/code-sample-label.mjs";

type HastNode = {
  type?: string;
  tagName?: string;
  name?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textProp(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function stampCodeOrder() {
  return (tree: HastNode) => {
    const blocks: HastNode[] = [];
    const walk = (node: HastNode) => {
      const isPre =
        (node.type === "element" && node.tagName === "pre") ||
        ((node.type === "mdxJsxFlowElement" ||
          node.type === "mdxJsxTextElement") &&
          node.name === "pre");
      if (isPre) blocks.push(node);
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
    const used = new Set<string>();
    for (const [index, block] of blocks.entries()) {
      const order = index + 1;
      if (!block.properties) block.properties = {};
      const props = block.properties;
      const title = textProp(props.dataTitle) ?? textProp(props.title);
      const language = textProp(props.dataLanguage);
      props.dataOrder = order;
      props.dataCodeLabel = codeSampleLabel({
        title,
        language,
        order,
        used,
      });
    }
  };
}

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
    rehypePlugins: (plugins) => [...plugins, stampCodeOrder],
  },
});
