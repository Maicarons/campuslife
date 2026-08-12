# Marketplace

## Overview

The Marketplace is a second-hand trading platform where students buy and sell used items on campus.

## Features

| Feature | Description |
|---------|-------------|
| Publish | List a used item with photos, price, and description |
| Browse | Category and keyword search; filter by condition and price |
| Chat | Contact the seller through the Social module |
| Sync scope | School / College |
| Upload points | +3 (granted after review) |

## Data fields

- title, description
- price, original price
- category, condition (new / like-new / good / fair)
- images
- status: available / reserved / sold

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/marketplace/items | List items |
| POST | /api/v1/marketplace/items | Publish an item |
| GET | /api/v1/marketplace/items/:id | Detail |
| PUT | /api/v1/marketplace/items/:id | Update |
| DELETE | /api/v1/marketplace/items/:id | Remove |
