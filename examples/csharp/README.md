# ToTallman — C# Example

Demonstrates the ToTallman C# library using both the `DEFAULT` and `AU` lists.

## Prerequisites

.NET 8 SDK.

## Run

```powershell
# From the repo root:
dotnet run --project examples/csharp/Example.csproj
```

## Expected output

```
Input:   Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.
DEFAULT: Prescribe vinCRISTine and vinBLASTine carefully; predniSONE requires monitoring.
AU:      Prescribe vinCRISTine and vinBLASTine carefully; prednisone requires monitoring.
```

Note that `prednisone` is only in the `DEFAULT` list, not `AU` — the output differs between lists.

With custom input text:

```powershell
dotnet run --project examples/csharp/Example.csproj -- "prednisone and prednisolone"
```
