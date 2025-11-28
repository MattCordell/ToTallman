using System;
using ToTallman;

class Test {
    static void Main() {
        var dict = EmbeddedTallmanLists.GetList("DEFAULT");
        Console.WriteLine($"Dictionary has {dict.Count} entries");
        
        string testKey = UnicodeHelpers.CaseFold("prednisone");
        Console.WriteLine($"CaseFold('prednisone') = '{testKey}'");
        
        if (dict.ContainsKey(testKey)) {
            Console.WriteLine($"Found! Value = '{dict[testKey]}'");
        } else {
            Console.WriteLine("NOT FOUND");
            Console.WriteLine("\nFirst 10 keys in dictionary:");
            int count = 0;
            foreach (var key in dict.Keys) {
                Console.WriteLine($"  '{key}'");
                if (++count >= 10) break;
            }
        }
        
        Console.WriteLine("\nActual conversion test:");
        string result = "prednisone".ToTallman();
        Console.WriteLine($"'prednisone'.ToTallman() = '{result}'");
    }
}
