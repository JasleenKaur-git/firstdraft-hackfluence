# FirstDraft — From First Draft to First Audience

An AI-powered tool for aspiring content creators who are stuck 
before they even begin.

Built in 48 hours at Hackfluence 2026 by team canonEvent.

## The Problem

Most creator tools help you after you've made content. Nothing 
helps you before. Creators quit before publishing their first 
post — not because they lack talent, but because they're stuck 
on four questions:

- Is my idea good enough?
- Has this been done before?
- How do I start?
- Am I accidentally sharing too much?

## Features

**Idea Capture and Brief Generator**
Dump your raw idea as text or voice. Get a structured content 
brief with title, hook, target audience, format, tone, effort 
level, and why the idea is worth making.

**Starting Point Generator**
Input your topic, platform, and personal angle. Get three hook 
variations, your actual opening line, a full content outline, 
and three platform-optimised title suggestions.

**Originality Checker**
Uses the YouTube Data API to pull real video counts and gives 
you a saturation score, an angle score, three specific ways to 
stand out, and a final verdict on your idea.

**Pre-Publish Safety Scanner**
Analyses your caption and thumbnail for privacy risks before 
you publish. Flags location data, daily routines, and metadata 
hidden in images. Gives you a risk score and recommendations.

## Tech Stack

- Frontend: Next.js 14 + Tailwind CSS
- AI Engine: GitHub Models (GPT-4o + GPT-4o-mini)
- Data: YouTube Data API v3
- Privacy: exifr.js for metadata extraction
- Architecture: Stateless, no database, privacy-first

## Team

- Jasleen Kaur (Project Lead)
- Shhloka Bhat
- Palak Shroff
- Tanvi Sharma

## Getting Started

Clone the repo and install dependencies:

npm install

Create a .env.local file in the root with:

GITHUB_TOKEN=your_github_token_here
YOUTUBE_API_KEY=your_youtube_api_key_here

Run the development server:

npm run dev

Open localhost:3000 in your browser.
