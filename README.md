# mzk-sticker-bot

本 bot 是一个基于 Telegram 的电报机器人，可以根据 query 文字生成 pjsk mizuki 表情包。

<img width="381" alt="2024-11-14 17 16 01" src="https://github.com/user-attachments/assets/bf953386-cb80-45b0-a455-ce1cfde666f9">

## 🎈使用方式

- clone 本仓库，在项目根目录中按照 `.env.example` 的示例创建 `.env` 文件
- 配置完成之后使用 `docker compose up` 运行
- 运行成功后将会通过 `8080` 端口转发出去

## 🙏感谢

- 感谢 [sekai-stickers](https://github.com/TheOriginalAyaka/sekai-stickers) 提供 pjsk 表情包以及 canvas 的实现方法
- 感谢 [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) 提供基于 nodejs 的 Telegram API 调用
- 感谢 [node-canvas](https://github.com/Automattic/node-canvas) 提供与 web 端一致的 canvas 实现
