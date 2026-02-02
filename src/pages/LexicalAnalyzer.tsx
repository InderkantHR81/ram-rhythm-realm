import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { tokenize, calculateStats } from "@/utils/cLexer";
import { CodeEditor } from "@/components/lexer/CodeEditor";
import { TokenStats } from "@/components/lexer/TokenStats";
import { TokenTable } from "@/components/lexer/TokenTable";
import { ErrorPanel } from "@/components/lexer/ErrorPanel";
import { TokenLegend } from "@/components/lexer/TokenLegend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, ArrowLeft, Trash2, FileCode } from "lucide-react";

const SAMPLE_CODE = `#include <stdio.h>

// Calculate factorial recursively
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    char *message = "Factorial is: ";
    
    printf("%s%d\\n", message, factorial(num));
    
    return 0;
}`;

export default function LexicalAnalyzer() {
  const [code, setCode] = useState(SAMPLE_CODE);

  const tokens = useMemo(() => tokenize(code), [code]);
  const stats = useMemo(() => calculateStats(tokens), [tokens]);
  const errors = useMemo(() => tokens.filter((t) => t.type === "ERROR"), [tokens]);

  const handleClear = () => setCode("");
  const handleLoadSample = () => setCode(SAMPLE_CODE);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                C Lexical Analyzer
              </h1>
              <p className="text-muted-foreground">
                Real-time tokenization and syntax highlighting for C code
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLoadSample} variant="outline">
              <FileCode className="mr-2 h-4 w-4" />
              Load Sample
            </Button>
            <Button onClick={handleClear} variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Source Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeEditor code={code} onChange={setCode} tokens={tokens} />
              </CardContent>
            </Card>

            <TokenTable tokens={tokens} />
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <TokenStats stats={stats} />
            <ErrorPanel errors={errors} />
            <TokenLegend />
          </div>
        </div>

        {/* Viva Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">🎓 Viva Demonstration Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-primary mb-2">Show Token Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Type <code className="text-purple-400">int x</code> - shows keyword vs identifier</li>
                  <li>• Type <code className="text-orange-400">++</code> or <code className="text-orange-400">==</code> - multi-char operators</li>
                  <li>• Type <code className="text-green-400">0xFF</code> - hex number recognition</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Show Error Detection</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Type <code className="text-pink-400">"hello</code> (no closing quote) - string error</li>
                  <li>• Type <code className="text-gray-400">/* comment</code> (no closing) - comment error</li>
                  <li>• Type <code className="text-red-400">@</code> - unknown character error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
