# Organization

CampusLife uses a 5-level organization hierarchy to manage data sharing and the review workflow.

## Hierarchy

```
Project Admin (super_admin)
        |
        v
   School (school)  <- school admin
        |
        v
   College (college) <- college admin
        |
        v
   Major (major)    <- major admin
        |
        v
   Grade (grade)    <- grade admin
        |
        v
   Class (class)    <- class admin
```

## How admins are appointed

| Method | Description |
|--------|-------------|
| **Application** | A user applies -> the upper-level admin approves. |
| **Assignment** | The upper-level admin directly assigns a lower-level admin. |
| **Acting** | When a level has no admin, the upper-level admin reviews on its behalf or enables auto-approval. |

## Data sync scopes

| Data type | Available scope |
|-----------|-----------------|
| Cafeteria menu, takeout | School (shared campus-wide) |
| Campus bus | School |
| Free classrooms | School / building |
| Campus events | School / college |
| Announcements | School / college / major / grade / class |
| Course info | Major / class |
| Exams | Class / major / grade |
| Assignments | Class |
| Scholarships | School / college |
| Lost & found | School |
| Notes / forum | Unlimited |

## Review workflow

```
User uploads data (chooses a scope)
        |
        v
Match the admin of the chosen scope level
        |
        +-- Admin exists -> awaiting review
        |      +-- Approved -> data syncs to all users in scope + points granted
        |      +-- Rejected -> notify uploader
        |
        +-- No admin
               +-- auto_approve=true -> auto approved
               +-- auto_approve=false -> upper level reviews on behalf
```

## Points rules

| Action | Points | Note |
|--------|--------|------|
| Upload course info | +10 | Granted after approval |
| Upload exam info | +10 | Granted after approval |
| Upload campus event | +8 | Granted after approval |
| Upload cafeteria menu | +5 | Granted after approval |
| Upload lost & found | +5 | Granted after approval |
| Upload takeout / nearby | +3 | Granted after approval |
| Upload free classroom | +3 | Granted after approval |
| Submit correction (accepted) | +15 | After admin review |
| Complete profile | +20 | One-time |
| Daily check-in | +1 | Once per day |
