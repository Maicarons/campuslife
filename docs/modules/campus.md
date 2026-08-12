# Campus Life

## Overview

The Campus Life module brings together everyday campus services: cafeteria menus, takeout, lost & found, events, maps, campus bus, and announcements.

## Submodules

### Cafeteria Menu

| Feature | Description |
|---------|-------------|
| Features | Dish showcase per canteen, nutrition analysis, favorites |
| Sync scope | School (shared campus-wide) |
| AI | Nutrition pairing suggestions |
| OCR | Yes - snap a photo to recognize the menu |
| Upload points | +5 |

Dining-point types: cafeteria / takeout / nearby.
Dish fields: name, price, original price (discount), category, description, nutrition, spiciness, popular.

### Takeout Aggregation

| Feature | Description |
|---------|-------------|
| Features | Aggregate on/off-campus takeout platforms, deals |
| Sync scope | School |
| AI | Personalized ordering recommendations |
| Upload points | +3 |

### Nearby Places

| Feature | Description |
|---------|-------------|
| Features | Nearby dining / shops, ratings, average spend |
| AI | Exploration recommendations |

### Dining Diary

| Feature | Description |
|---------|-------------|
| Features | Log each meal, nutrition stats, spend stats |
| AI | Diet analysis and health advice |
| OCR | Yes - snap a photo to log a meal |

Fields: dining point, meal type (breakfast / lunch / dinner / snack), dishes, total price, photo, nutrition summary.

### Lost & Found

| Feature | Description |
|---------|-------------|
| Features | Publish / search lost & found posts |
| Sync scope | School |
| AI | Image recognition to assist classification |
| OCR | Yes - image recognition |
| Upload points | +5 |

Fields: type (lost / found), title, description, location, contact, category, status.

### Campus Events

| Feature | Description |
|---------|-------------|
| Features | Event calendar, sign-up, reminders |
| Sync scope | School / College |
| AI | Personalized event recommendations |
| Upload points | +8 |

Fields: title, description, location, time, sign-up deadline, max attendees, tags.

### Campus Bus

| Feature | Description |
|---------|-------------|
| Features | Route query, timetable |
| Sync scope | School |

### Announcements

| Feature | Description |
|---------|-------------|
| Sync scope | Any level |
| Priority | Normal / Important / Urgent |

## Review system

- Star rating (1-5)
- Text review + image
- Tags (tasty / good value / fast / generous portion)
- Average spend tier ($ / $$ / $$$)

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/campus/dining | List dining points (type filter supported) |
| GET | /api/v1/campus/dining/:id | Dining point detail |
| POST | /api/v1/campus/dining | Upload a dining point |
| POST | /api/v1/campus/dining/:id/reviews | Post a review |
| GET | /api/v1/campus/lost-found | List lost & found |
| POST | /api/v1/campus/lost-found | Publish a lost & found post |
| GET | /api/v1/campus/events | List events |
| GET | /api/v1/campus/announcements | List announcements |
| GET | /api/v1/campus/bus | Campus bus timetable |
