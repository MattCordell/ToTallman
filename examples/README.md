# ToTallman — Examples

Runnable example applications for each supported language.

Each example takes a sample medication sentence, applies Tall Man lettering with the
`DEFAULT` list and the `AU` (Australian) list, and prints both results. An optional
command-line argument lets you supply your own text.

| Language | Path | Run (after build, from repo root) |
|----------|------|-----------------------------------|
| C# | [examples/csharp/](csharp/) | `dotnet run --project examples/csharp/Example.csproj` |
| Python | [examples/python/](python/) | `python examples/python/example.py` |
| JavaScript | [examples/javascript/](javascript/) | `node examples/javascript/example.js` |
| Java | [examples/java/](java/) | `mvn -f examples/java/pom.xml compile exec:java` |

> **Note:** Each language requires the library to be built/installed first.
> See the README in each example directory for the one-time build step.

## Available list IDs

All examples support any of the five built-in list IDs: `DEFAULT`, `AU`, `FDA`, `ISMP`, `NZ`.
