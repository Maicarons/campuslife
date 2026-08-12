# Volunteer

## Overview

The Volunteer module connects students with campus and community volunteer opportunities and public-welfare activities.

## Features

| Feature | Description |
|---------|-------------|
| Browse | List volunteer activities with time, location, and quota |
| Sign up | Register for an activity |
| Hours | Track and display accumulated volunteer hours |
| Certificates | Generate service certificates |
| Sync scope | School / College |
| Upload points | +8 (granted after review) |

## Data fields

- title, description
- location, time
- quota, enrolled
- status: recruiting / ongoing / finished

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/volunteer/activities | List activities |
| POST | /api/v1/volunteer/activities | Create an activity |
| GET | /api/v1/volunteer/activities/:id | Detail |
| POST | /api/v1/volunteer/activities/:id/signup | Sign up |
| GET | /api/v1/volunteer/records | List my volunteer records |
