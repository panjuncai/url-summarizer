import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')

  const handleSummarize = async () => {
    // 这里后面可以加调用后端或AI接口
    setSummary(`已收到URL: ${url}，即将总结...`)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>URL智能摘要工具</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="请输入网页链接..."
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleSummarize} style={{ padding: 10 }}>
        开始总结
      </button>
      <div style={{ marginTop: 20 }}>
        <h2>摘要结果：</h2>
        <p>{summary}</p>
      </div>
    </div>
  )
}

export default App
