import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders product descriptions written in Markdown.
 * Supports bold (**text**), bullet lists (- item), and paragraphs.
 */
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-3 text-slate-600 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          a: ({ children, href }) => (
            <a href={href} className="text-brand-600 underline">
              {children}
            </a>
          ),
          h1: ({ children }) => (
            <h3 className="text-lg font-semibold text-slate-800">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-800">{children}</h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
