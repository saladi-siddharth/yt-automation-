# 🚀 GitHub Actions Automated Deployment & Secrets Setup Guide

This project is configured with GitHub Actions to automatically generate and publish YouTube Shorts & Long Videos on schedule, **even when your personal PC is powered off**.

---

## 📅 Scheduled Workflows

The following GitHub Action workflows are ready in your repository:

1. [yt-automation.yml](file:///.github/workflows/yt-automation.yml)
   * **Target**: Daily Shorts (3x per day)
   * **Schedule**: 07:45 AM, 03:45 PM, and 07:45 PM IST
2. [yt-long-automation.yml](file:///.github/workflows/yt-long-automation.yml)
   * **Target**: Long Videos (1x per day)
   * **Schedule**: 05:00 PM IST (ready for 06:00 PM IST publish)

---

## 🔑 Required GitHub Secrets

To allow GitHub to run the AI engine and upload directly to your YouTube channel, set up these repository secrets on GitHub:

1. Push your project code to your GitHub Repository.
2. Navigate to: **Settings > Secrets and variables > Actions** in your GitHub repository.
3. Click **New repository secret** and add the following keys:

| Secret Name | Value Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `PEXELS_API_KEY` | Your Pexels API Key for video footage |
| `PIXABAY_API_KEY` | Your Pixabay API Key for images/videos |
| `YOUTUBE_CLIENT_ID` | Your Google Cloud OAuth Client ID |
| `YOUTUBE_CLIENT_SECRET` | Your Google Cloud OAuth Client Secret |
| `YOUTUBE_API_KEY` | Your YouTube Data API v3 Key |
| `YOUTUBE_TOKENS_JSON` | Content of your local `data/youtube_tokens.json` file |

> 💡 **Tip for `YOUTUBE_TOKENS_JSON`**: Open `data/youtube_tokens.json` on your PC, copy the entire JSON contents, and paste it into the `YOUTUBE_TOKENS_JSON` GitHub secret.

---

## 🛠 Manual Workflow Trigger

You can also trigger video generation manually anytime:
1. Go to the **Actions** tab on your GitHub repository.
2. Select **Viral YouTube Shorts Generator** or **Viral YouTube Long Video Generator**.
3. Click **Run workflow** -> **Run workflow**.
