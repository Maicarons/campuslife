# Social

## Overview

The Social module provides community features such as a forum and Q&A. (The dedicated Q&A Plaza module is documented separately under [Q&A Plaza](./qa).)

## Submodules

### Forum

| Feature | Description |
|---------|-------------|
| Features | Post, comment, like |
| Sync scope | Visible platform-wide |

### Q&A

| Feature | Description |
|---------|-------------|
| Features | Ask, answer, vote, mark resolved |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/social/forum | List posts |
| POST | /api/v1/social/forum | Create a post |
| GET | /api/v1/social/forum/:id | Post detail |
| POST | /api/v1/social/forum/:id/comments | Post a comment |
| GET | /api/v1/social/forum/:id/comments | List comments |
