import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { toast, Toaster } from 'react-hot-toast'

function App() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    if (!url.startsWith('http')) {
      toast.error('❌ 请输入有效的网址（以 http 或 https 开头）')
      return
    }

    setLoading(true)
    setSummary('')

    try {
      const result = await invoke<string>('fetch_url_main_content', { url })
      setSummary(result)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">🌐 URL 智能摘要工具</h1>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="请输入网页链接..."
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSummarize}
          className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? '⏳ 正在总结...' : '开始总结'}
        </button>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">📄 摘要结果：</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </div>
  )
}

export default App
