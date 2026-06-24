import sys
from totallman import to_tallman

sample = "Prescribe vincristine and vinblastine carefully; prednisone requires monitoring."
text = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else sample

print(f"Input:   {text}")
print(f"DEFAULT: {to_tallman(text)}")
print(f"AU:      {to_tallman(text, 'AU')}")
