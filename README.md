[![CI](https://github.com/MattCordell/ToTallman/actions/workflows/ci.yml/badge.svg)](https://github.com/MattCordell/ToTallman/actions/workflows/ci.yml)
[![CodeQL](https://github.com/MattCordell/ToTallman/actions/workflows/codeql.yml/badge.svg)](https://github.com/MattCordell/ToTallman/actions/workflows/codeql.yml)

# ToTallman

Cross-language [Tall Man lettering](https://en.wikipedia.org/wiki/Tall_Man_lettering) library for medication safety. Converts drug names to their standardised mixed-case form (e.g. `prednisone` → `predniSONE`) to reduce look-alike, sound-alike (LASA) medication errors.

Available in C#/.NET, Python, JavaScript/TypeScript, and Java. All implementations share a canonical dataset, produce byte-identical output, and pass 99/99 canonical tests.

## Quick Start

### C# / .NET

```bash
dotnet add package ToTallman
```

```csharp
using ToTallman;

"prednisone".ToTallman();               // "predniSONE"
"vincristine".ToTallman("AU");          // "vinCRISTine"
"ms contin".ToTallman();                // "MS Contin"
"solu-medrol".ToTallman();             // "SOLU-medrol"
```

### Python

```bash
pip install totallman
```

```python
from totallman import to_tallman

to_tallman("prednisone")               # "predniSONE"
to_tallman("vincristine", "AU")        # "vinCRISTine"
to_tallman("ms contin")                # "MS Contin"
```

### JavaScript / TypeScript

```bash
npm install totallman
```

```typescript
import { toTallman } from 'totallman';

toTallman('prednisone');               // 'predniSONE'
toTallman('vincristine', 'AU');        // 'vinCRISTine'
toTallman('ms contin');                // 'MS Contin'
```

### Java

```xml
<dependency>
  <groupId>com.totallman</groupId>
  <artifactId>totallman</artifactId>
  <version>2.0.0</version>
</dependency>
```

```java
import com.totallman.TallmanConverter;

TallmanConverter.toTallman("prednisone");           // "predniSONE"
TallmanConverter.toTallman("vincristine", "AU");    // "vinCRISTine"
TallmanConverter.toTallman("ms contin");            // "MS Contin"
```

## Available Lists

| ID | Description | Entries |
|----|-------------|---------|
| `DEFAULT` | Combined list (AU + ISMP + NZ + FDA, precedence AU > ISMP > NZ > FDA) | 384 |
| `AU` | Australian National Tall Man Lettering List (ACSQHC) | 235 |
| `ISMP` | FDA + ISMP Tall Man Lettering Lists (combined) | 171 |
| `NZ` | Aotearoa New Zealand Tall Man Lettering List (HQSC) | 219 |
| `FDA` | US Food and Drug Administration Name Differentiation Project | 43 |

Entry counts and list versions are in [`tallman-lists/manifest.json`](tallman-lists/manifest.json).

## Language Implementations

| Language | Package | README |
|----------|---------|--------|
| C# / .NET | `ToTallman` on NuGet | [languages/csharp/](languages/csharp/README.md) |
| Python | `totallman` on PyPI | [languages/python/](languages/python/README.md) |
| JavaScript / TypeScript | `totallman` on npm | [languages/js/](languages/js/README.md) |
| Java | `com.totallman:totallman` | [languages/java/](languages/java/README.md) |

See the [Technical Specification](spec/TECHNICAL-SPEC.md) for the canonical algorithm and cross-language design decisions.

## Examples

Runnable examples for each language live under [`examples/`](examples/):

| Language | Path | Run (after build, from repo root) |
|----------|------|-----------------------------------|
| C# | [examples/csharp/](examples/csharp/) | `dotnet run --project examples/csharp/Example.csproj` |
| Python | [examples/python/](examples/python/) | `python examples/python/example.py` |
| JavaScript | [examples/javascript/](examples/javascript/) | `node examples/javascript/example.js` |
| Java | [examples/java/](examples/java/) | `mvn -f examples/java/pom.xml compile exec:java` |

Each example requires the library to be built first — see the README in each example directory.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or update Tall Man lists, run the test suite, and submit changes.

## Release Status

| Phase | Status |
|-------|--------|
| 1. Foundation (data format + validation) | ✅ Complete |
| 2. Canonical test suite | ✅ Complete |
| 3. C# implementation | ✅ Complete — 99/99 canonical, 123 total |
| 4. Multi-language (Python, JS, Java) | ✅ Complete — all 99/99 canonical |
| 5. CI/CD | ✅ Complete |
| 6. Documentation | ✅ Complete |
| 7. Example applications | ✅ Complete |
| 8. Manual list review (clinical correctness) | ✅ Complete |
| 9. Release & publishing | ⛔ Blocked — [#49](https://github.com/MattCordell/ToTallman/issues/49) |

Detailed, up-to-date work lives in [GitHub issues](https://github.com/MattCordell/ToTallman/issues).
