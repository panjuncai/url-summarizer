import { useState, useEffect } from "react";
import { Store } from "@tauri-apps/plugin-store";
import { toast } from "react-hot-toast";
import { EyeInvisibleOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Select, Modal, Form, Space, Radio, Typography } from "antd";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  defaultTab: string;
  apiKey: string;
  apiModel: string;
  apiUrl: string;
  apiPath: string;
  apiScript: string[];
}

let store: Store | null = null;

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({
    defaultTab: "url",
    apiKey: "",
    apiModel: "gpt-4o-mini",
    apiUrl: "https://api.openai.com",
    apiPath: "/v1/chat/completions",
    apiScript: [
      "你是一个专业的信息摘要助手，我给你提供待总结的内容，内容可能是各种语言。请将内容进行总结，突出重点和难点，并以中文的Markdown格式返回。",
    ],
  });
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initializeStore();
    }
  }, [isOpen]);

  async function initializeStore() {
    if (!store) {
      store = await Store.load("settings.json");
    }
    await loadSettings();
  }

  async function loadSettings() {
    try {
      if (!store) return;
      const defaultTab = ((await store.get("defaultTab")) as string) || "url";
      const apiKey = ((await store.get("apiKey")) as string) || "";
      const apiModel =
        ((await store.get("apiModel")) as string) || "gpt-4o-mini";
      const apiUrl =
        ((await store.get("apiUrl")) as string) || "https://api.openai.com";
      const apiPath =
        ((await store.get("apiPath")) as string) || "/v1/chat/completions";
      const apiScript =
        ((await store.get("apiScript")) as string[]) ||
        ["你是一个专业的信息摘要助手，我给你提供待总结的内容，内容可能是各种语言。请将内容进行总结，突出重点和难点，并以中文的Markdown格式返回。"];
      setSettings({ defaultTab, apiKey, apiModel, apiUrl, apiPath, apiScript });
    } catch (error) {
      console.error("加载设置失败:", error);
      toast.error("加载设置失败");
    }
  }

  async function handleSave() {
    try {
      if (!store) return;
      await store.set("defaultTab", settings.defaultTab);
      await store.set("apiKey", settings.apiKey);
      await store.set("apiModel", settings.apiModel);
      await store.set("apiUrl", settings.apiUrl);
      await store.set("apiPath", settings.apiPath);
      await store.set("apiScript", settings.apiScript);
      await store.save();
      toast.success("设置已保存");
      onClose();
    } catch (error) {
      console.error("保存设置失败:", error);
      toast.error("保存设置失败:" + error);
    }
  }

  return (
    <Modal
      title="系统设置"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          保存
        </Button>,
      ]}
    >
      <Form layout="horizontal" labelCol={{ span: 4 }}>
        <Form.Item label="默认标签">
          <Radio.Group
            value={settings.defaultTab}
            onChange={(e) =>
              setSettings({ ...settings, defaultTab: e.target.value })
            }
            options={[
              {
                value: "url",
                label: <div>网址</div>,
              },
              {
                value: "text",
                label: <div>文本</div>,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="API Key">
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
              placeholder="输入你的 API Key"
              suffix={
                showApiKey ? (
                  <EyeInvisibleOutlined onClick={() => setShowApiKey(false)} />
                ) : (
                  <EyeOutlined onClick={() => setShowApiKey(true)} />
                )
              }
            />
          </div>
        </Form.Item>

        <Form.Item label="API Model">
          <Space.Compact block>
            <Select
              value={
                settings.apiModel === "gpt-4o" ||
                settings.apiModel === "gpt-4o-mini"
                  ? settings.apiModel
                  : "custom"
              }
              onChange={(value: string) =>
                setSettings({
                  ...settings,
                  apiModel: value === "custom" ? "" : value,
                })
              }
              options={[
                { label: "gpt-4o", value: "gpt-4o" },
                { label: "gpt-4o-mini", value: "gpt-4o-mini" },
                { label: "自定义", value: "custom" },
              ]}
            />
            {settings.apiModel !== "gpt-4o" &&
              settings.apiModel !== "gpt-4o-mini" && (
                <Input
                  value={settings.apiModel}
                  onChange={(e) =>
                    setSettings({ ...settings, apiModel: e.target.value })
                  }
                  placeholder="输入你的 API Model"
                />
              )}
          </Space.Compact>
        </Form.Item>

        <Form.Item label="API URL">
          <Input
            value={settings.apiUrl}
            onChange={(e) =>
              setSettings({ ...settings, apiUrl: e.target.value })
            }
            placeholder="API 基础 URL"
          />
        </Form.Item>

        <Form.Item label="API Path">
          <Input
            value={settings.apiPath}
            onChange={(e) =>
              setSettings({ ...settings, apiPath: e.target.value })
            }
            placeholder="API 路径"
          />
        </Form.Item>

        <Form.Item label="提示词" required>
          {settings.apiScript.map((script, index) => (
            <div key={index} style={{ marginBottom: index !== settings.apiScript.length - 1 ? 16 : 0 }}>
              <Space.Compact block>
                <Input.TextArea
                  value={script}
                  onChange={(e) => {
                    const newApiScript = [...settings.apiScript];
                    newApiScript[index] = e.target.value;
                    setSettings({ ...settings, apiScript: newApiScript });
                  }}
                  placeholder="请输入提示词..."
                  rows={2}
                  style={{ borderRadius: index === 0 ? undefined : '6px' }}
                />
                {index !== 0 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newApiScript = settings.apiScript.filter((_, i) => i !== index);
                      setSettings({ ...settings, apiScript: newApiScript });
                    }}
                  />
                )}
              </Space.Compact>
              {index === 0 && (
                <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                  这是默认提示词，不可删除
                </Typography.Text>
              )}
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() => {
              setSettings({
                ...settings,
                apiScript: [...settings.apiScript, ""]
              });
            }}
            icon={<PlusOutlined />}
            style={{ width: '100%', marginTop: 8 }}
          >
            添加提示词
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
