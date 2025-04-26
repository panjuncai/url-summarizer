#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::command;
use reqwest::Client;
use scraper::Html;
use html2text::from_read;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::env;
use dotenv::dotenv;

#[derive(Debug)]
enum FetchError {
    Network(String),
    HttpStatus(u16),
    HtmlParse(String),
    ExtractionFailed,
    ContentTooShort,
    Unknown(String),
    AiRequestFailed(String),
}

impl FetchError {
    fn to_user_message(&self) -> String {
        match self {
            FetchError::Network(_) => "无法连接到网址，请检查网络或网址是否正确。".to_string(),
            FetchError::HttpStatus(code) => format!("网页返回异常状态码：{}。", code),
            FetchError::HtmlParse(_) => "无法解析网页内容，可能网页结构异常。".to_string(),
            FetchError::ExtractionFailed => "没找到有效正文内容，请换一个链接。".to_string(),
            FetchError::ContentTooShort => "网页内容过短，无法生成有效摘要。".to_string(),
            FetchError::Unknown(_) => "出现未知错误，请稍后再试。".to_string(),
            FetchError::AiRequestFailed(msg) => format!("AI摘要生成失败: {}", msg),
        }
    }
}

fn clean_content(content: String) -> String {
    // 移除HTML标签
    let html_pattern = Regex::new(r"<[^>]+>").unwrap();
    let without_html = html_pattern.replace_all(&content, "").to_string();

    // 移除包含[数字]的整行
    let cleaned_lines: Vec<&str> = without_html
        .lines()
        .filter(|line| !line.contains('[') || !Regex::new(r"\[\d+\]").unwrap().is_match(line))
        .collect();

    // 合并行并清理多余空行
    let mut result = String::new();
    let mut last_line_empty = true;

    for line in cleaned_lines {
        let trimmed = line.trim();
        let is_empty = trimmed.is_empty();

        // 避免连续的空行
        if !(is_empty && last_line_empty) {
            result.push_str(trimmed);
            if !is_empty {
                result.push_str("\n");
            }
        }
        last_line_empty = is_empty;
    }

    result.trim().to_string()
}


#[derive(Serialize)]
struct OpenAIRequest<'a> {
    model: &'a str,
    messages: Vec<Message<'a>>,
    temperature: f32,
}

#[derive(Serialize)]
struct Message<'a> {
    role: &'a str,
    content: &'a str,
}

#[derive(Deserialize)]
struct OpenAIResponse {
    choices: Vec<Choice>,
}

#[derive(Deserialize)]
struct Choice {
    message: MessageContent,
}

#[derive(Deserialize)]
struct MessageContent {
    content: String,
}

async fn summarize_with_ai(content: &str) -> Result<String, FetchError> {
    let api_key = env::var("OPENAI_API_KEY").map_err(|_| FetchError::AiRequestFailed("未找到API密钥".to_string()))?;

    let client = Client::new();

    let request_body = OpenAIRequest {
        model: "gpt-4o", // 你可以换成gpt-4-turbo或者gpt-3.5-turbo
        messages: vec![
            Message {
                role: "system",
                content: "你是一个专业的信息摘要助手，我给你提供待总结的内容，内容可能是各种语言。请将内容进行总结，突出重点和难点，并以中文的格式返回。",
            },
            Message {
                role: "user",
                content,
            },
        ],
        temperature: 0.5,
    };

    let res = client.post("https://api.openai.com/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| FetchError::AiRequestFailed(e.to_string()))?;

    let res_json: OpenAIResponse = res.json()
        .await
        .map_err(|e| FetchError::AiRequestFailed(e.to_string()))?;

    if let Some(choice) = res_json.choices.into_iter().next() {
        Ok(choice.message.content)
    } else {
        Err(FetchError::AiRequestFailed("AI返回了空结果".to_string()))
    }
}

#[command]
async fn fetch_url_main_content(url: String) -> Result<String, String> {
    dotenv().ok(); // 加载.env环境变量

    let client = Client::new();
    let res = client.get(&url)
        .send()
        .await
        .map_err(|e| FetchError::Network(e.to_string()).to_user_message())?;

    if !res.status().is_success() {
        return Err(FetchError::HttpStatus(res.status().as_u16()).to_user_message());
    }

    let body = res.text()
        .await
        .map_err(|e| FetchError::HtmlParse(e.to_string()).to_user_message())?;

    // 将HTML解析和文本提取移到一个阻塞任务中执行
    let cleaned_content = tokio::task::spawn_blocking(move || {
        let _html_doc = Html::parse_document(&body);
        let content = from_read(body.as_bytes(), body.len());
        clean_content(content)
    }).await.map_err(|e| FetchError::Unknown(e.to_string()).to_user_message())?;

    let summary = summarize_with_ai(&cleaned_content)
        .await
        .map_err(|e| e.to_user_message())?;

    Ok(summary)
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_url_main_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
