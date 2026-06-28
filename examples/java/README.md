# ToTallman — Java Example

Demonstrates the ToTallman Java library using both the `DEFAULT` and `AU` lists.

## Prerequisites

Java 11+ and Maven.

## Run

Install the library to the local Maven repository first, then run the example:

```powershell
# From the repo root — install the library once:
mvn -f languages/java/pom.xml install -DskipTests

# Run the example:
mvn -f examples/java/pom.xml compile exec:java
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
mvn -f examples/java/pom.xml compile exec:java "-Dexec.args=prednisone and prednisolone"
```
