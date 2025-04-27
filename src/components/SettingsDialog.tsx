import { useState, useEffect } from 'react'
import { Store } from '@tauri-apps/plugin-store'
import { toast } from 'react-hot-toast'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface Settings {
  apiKey: string
  apiModel: string
  apiUrl: string
  apiPath: string
}

let store: Store | null = null;

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    apiModel: 'gpt-4o-mini',
    apiUrl: 'https://api.openai.com',
    apiPath: '/v1/chat/completions'
  })
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (isOpen) {
      initializeStore()
    }
  }, [isOpen])

  async function initializeStore() {
    if (!store) {
      store = await Store.load('settings.json');
    }
    await loadSettings();
  }

  async function loadSettings() {
    try {
      if (!store) return;
      const apiKey = (await store.get('apiKey')) as string || ''
      const apiModel = (await store.get('apiModel')) as string || 'gpt-4o-mini'
      const apiUrl = (await store.get('apiUrl')) as string || 'https://api.openai.com'
      const apiPath = (await store.get('apiPath')) as string || '/v1/chat/completions'
      setSettings({ apiKey, apiModel, apiUrl, apiPath })
    } catch (error) {
      console.error('加载设置失败:', error)
      toast.error('加载设置失败')
    }
  }

  async function handleSave() {
    try {
      if (!store) return;
      await store.set('apiKey', settings.apiKey)
      await store.set('apiModel', settings.apiModel)
      await store.set('apiUrl', settings.apiUrl)
      await store.set('apiPath', settings.apiPath)
      await store.save()
      toast.success('设置已保存')
      onClose()
    } catch (error) {
      console.error('保存设置失败:', error)
      toast.error('保存设置失败:'+error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">API 设置</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={e => setSettings({...settings, apiKey: e.target.value})}
                className="w-full border rounded p-2 pr-10"
                placeholder="输入你的 API Key"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showApiKey ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Model</label>
            <select
              value={settings.apiModel}
              onChange={e => setSettings({...settings, apiModel: e.target.value})}
              className="w-full border rounded p-2"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API URL</label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={e => setSettings({...settings, apiUrl: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="API 基础 URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Path</label>
            <input
              type="text"
              value={settings.apiPath}
              onChange={e => setSettings({...settings, apiPath: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="API 路径"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
} 