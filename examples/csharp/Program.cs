using System;
using ToTallman;

string sample = "Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.";
string input = args.Length > 0 ? string.Join(" ", args) : sample;

Console.WriteLine($"Input:   {input}");
Console.WriteLine($"DEFAULT: {input.ToTallman()}");
Console.WriteLine($"AU:      {input.ToTallman("AU")}");
