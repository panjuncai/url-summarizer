import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast, Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { SettingsDialog } from './components/SettingsDialog'

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSummarize = async () => {
    if (!url.startsWith("http")) {
      toast.error("请输入有效的网址（以 http 或 https 开头）");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const result = await invoke<string>("fetch_url_main_content", { url });
      setSummary(result);
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <Toaster position="top-center" />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">
          🌐 URL 智能摘要工具
        </h1> */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入网页链接..."
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setUrl("")}
            className="px-6 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition whitespace-nowrap"
          >
            清除
          </button>
          <button
            onClick={handleSummarize}
            className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
            disabled={loading}
          >
            {loading ? "⏳ 正在总结..." : "开始总结"}
          </button>
        </div>
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md overflow-auto">
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
            {summary ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mb-4" />,
                  h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mb-3" />,
                  h3: ({node, ...props}) => <h3 {...props} className="text-lg font-bold mb-2" />,
                  p: ({node, ...props}) => <p {...props} className="mb-4 leading-relaxed" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc ml-6 mb-4" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal ml-6 mb-4" />,
                  li: ({node, ...props}) => <li {...props} className="mb-1" />,
                  blockquote: ({node, ...props}) => (
                    <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic my-4" />
                  ),
                  code: ({node, ...props}) => (
                    <code {...props} className="bg-gray-100 rounded px-1 py-0.5" />
                  ),
                  pre: ({node, ...props}) => (
                    <pre {...props} className="bg-gray-100 rounded p-4 overflow-auto my-4" />
                  ),
                }}
              >
                {summary}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">摘要结果...</p>
            )}
          </div>
        </div>
      </div>

      {/* 底部配置栏 */}
      <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center px-4 justify-end gap-2">
        <div className="text-xs text-gray-500">
          Powered by OpenAI
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-gray-600 hover:text-gray-800"
          title="设置"
        >
          ⚙️
        </button>
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
