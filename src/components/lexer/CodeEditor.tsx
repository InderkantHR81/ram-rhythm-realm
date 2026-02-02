import { useRef, useEffect } from "react";
import { Token, TOKEN_COLORS } from "@/types/lexer";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  tokens: Token[];
}

export function CodeEditor({ code, onChange, tokens }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const renderHighlightedCode = () => {
    return tokens.map((token, index) => {
      if (token.type === "WHITESPACE") {
        return <span key={index}>{token.value}</span>;
      }
      return (
        <span
          key={index}
          className={cn(TOKEN_COLORS[token.type], "transition-colors")}
          title={token.errorMessage || `${token.type}: ${token.value}`}
        >
          {token.value}
        </span>
      );
    });
  };

  const lines = code.split("\n");

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 border-r border-border overflow-hidden">
        <div className="p-4 font-mono text-sm text-muted-foreground">
          {lines.map((_, i) => (
            <div key={i} className="h-6 leading-6 text-right pr-2">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Code area */}
      <div className="relative ml-12">
        {/* Highlighted layer */}
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 font-mono text-sm whitespace-pre overflow-hidden pointer-events-none"
          style={{ lineHeight: "1.5rem" }}
        >
          {renderHighlightedCode()}
        </div>

        {/* Input layer */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="relative w-full min-h-[400px] p-4 font-mono text-sm bg-transparent text-transparent caret-primary resize-none focus:outline-none"
          style={{ lineHeight: "1.5rem" }}
          placeholder="// Enter your C code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
