# agentic-ai-ui
This repo contains the code that facilitates AI agent style chat

# 📽️ YouTube to LinkedIn Post Automation

This project automates the transformation of a YouTube video into a blog and a LinkedIn post using [CrewAI](https://github.com/joaomdmoura/crewAI). It extracts captions, summarizes them into a LinkedIn-style post, and optionally edits it on command.

---

## 🚀 Features

- 📥 Extracts captions from YouTube videos
- 📝 Summarizes transcripts into a clean, readable content(Markdown)
- 💼 Generates LinkedIn-ready posts from the blog
- 🧠 Modular agent-based design using CrewAI
- 🔁 Maintains shared state across tasks
- ✉️ Supports email draft creation (optional)

---

## ⚙️ Requirements

### Python Dependencies

- Install ffmpeg for handling audio data.
- crewai>=0.22.1 
- openai>=1.14.0
- python-dotenv>=1.0.1
- google-auth>=2.29.0
- google-auth-oauthlib>=1.2.0
- google-api-python-client>=2.117.0
- pydantic>=2.6.4
- ffmpeg-python>=0.2.0

