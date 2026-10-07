# Dr. Smith Authorized Members Directory

This directory contains `members.json`, which controls administrative and staff access for the Dr. Smith Healthcare portal.

## How to Add or Edit Members

Simply open `data/members.json` and add a new row to the JSON list:

```json
{
  "id": "new-user-id",
  "pass": "secret-password",
  "name": "Full Name",
  "department": "Department Name",
  "role": "Designation",
  "organization": "Dr. Smith Healthcare",
  "status": "Active"
}
```

### Fields:
- **`id`**: Unique login username (e.g. `lucky`, `ritu`, `dr-sharma`). Case-insensitive.
- **`pass`**: The password required to log in.
- **`name`**: Full display name shown on badges and submission receipts.
- **`department`**: Department or division (e.g. `Export Department`, `Administration`, `Cardiology`).
- **`role`**: Official title or designation (e.g. `Head of Export`, `Administrator`, `Surgeon`).
- **`organization`**: Company or hospital name (default: `Dr. Smith Healthcare`).
- **`status`**: Set to `"Active"` to allow access, or `"Inactive"` to revoke access without deleting the row.
