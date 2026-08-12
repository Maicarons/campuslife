# Lost & Found

## Overview

The Lost & Found module helps students publish and search lost and found items across the campus.

## Features

| Feature | Description |
|---------|-------------|
| Publish | Post a lost or found item with photo, location, and contact |
| Search | Filter by type, category, and location |
| Sync scope | School (campus-wide) |
| AI | Image recognition assists automatic categorization |
| OCR | Yes - recognize text from photos |
| Upload points | +5 (granted after review) |

## Data fields

- type: lost / found
- title, description
- location, contact
- category
- status: pending / approved / resolved

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/campus/lost-found | List lost & found |
| POST | /api/v1/campus/lost-found | Publish a post |
| GET | /api/v1/campus/lost-found/:id | Detail |
| PUT | /api/v1/campus/lost-found/:id | Update |
| DELETE | /api/v1/campus/lost-found/:id | Remove |
