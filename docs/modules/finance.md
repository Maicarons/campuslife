# Finance

## Overview

Helps students record daily income and expenses, and discover scholarship and part-time opportunities.

## Submodules

### Expense Tracker

| Feature | Description |
|---------|-------------|
| Features | Income/expense records, category stats, budget management |
| AI | Spending analysis and saving suggestions |
| OCR | Yes - receipt recognition for auto-entry |

### Scholarships

| Feature | Description |
|---------|-------------|
| Sync scope | School / College |
| AI | Eligibility matching score |

### Part-time Jobs

| Feature | Description |
|---------|-------------|
| AI | Time-conflict detection |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/finance/transactions | List income/expense records |
| POST | /api/v1/finance/transactions | Create a record |
| DELETE | /api/v1/finance/transactions/:id | Delete a record |
| GET | /api/v1/finance/scholarships | List scholarships |
| GET | /api/v1/finance/jobs | List part-time jobs |
