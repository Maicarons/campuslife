# Q&A Plaza

## Overview

The Q&A Plaza is a campus question-and-answer community where students ask questions, share answers, vote, and mark the best answer as resolved.

## Features

| Feature | Description |
|---------|-------------|
| Ask | Post a question with tags and topic |
| Answer | Reply with text, images, or code |
| Vote | Upvote helpful answers |
| Resolve | Mark an answer as accepted |
| AI | Suggest similar questions and draft answers |
| Sync scope | Platform-wide |

## Data fields

- title, body
- tags
- status: open / resolved

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/qa/questions | List questions |
| POST | /api/v1/qa/questions | Ask a question |
| GET | /api/v1/qa/questions/:id | Question detail |
| POST | /api/v1/qa/questions/:id/answers | Post an answer |
| POST | /api/v1/qa/answers/:id/vote | Vote on an answer |
