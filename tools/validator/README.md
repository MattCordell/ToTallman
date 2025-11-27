# Tallman List Validator

This tool validates ToTallman JSON list files against the defined schema.

## Installation

```bash
cd tools/validator
npm install
```

## Usage

```bash
npm run validate
```

Or run directly:

```bash
node validate-schema.js
```

## What It Validates

1. **JSON Schema Compliance**: All list files must conform to `/tallman-lists/schema.json`
2. **Duplicate Detection**: Checks for duplicate entries (case-insensitive)
3. **Version Format**: Validates version follows `YYYYMMDD.N` format
4. **Entry Integrity**: Ensures no empty entries exist
5. **Data Quality**: Validates date components in version strings

## Output

The validator will:
- Display validation results for each file
- Generate a manifest file at `/tallman-lists/manifest.json`
- Exit with code 0 on success, non-zero on failure

## Manifest File

The generated `manifest.json` contains:
- List ID
- Version
- Number of entries
- Description

Example:
```json
[
  {
    "id": "AU",
    "version": "20171124.0",
    "entries": 206,
    "description": "Australian National Tall Man Lettering List (November 2017)"
  }
]
```

## Exit Codes

- `0`: All validations passed
- `1`: Validation errors found

## Integration

This validator should be run:
- Before committing changes to list files
- As part of CI/CD pipeline
- When adding new lists
