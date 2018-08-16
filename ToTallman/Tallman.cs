using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ToTallman
{
    public static class Tallman
    {
        private static Dictionary<string, string> Tallmen = new Dictionary<string, string>();

        private static string[] TM = Properties.Resources.Tallmen.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

        static Tallman()
        {
            //initialiseTallmen
            foreach (var entry in TM)
            {
                AddTallman(entry);
            }
        }

        private static void AddTallman(string s)
        {
            Tallmen.Add(s.ToLower(), s);
        }

        public static string ToTallman(this String term)
        {
            var words = term.ToLower().Split(' ');

            foreach (var word in words)
            {
                if (Tallmen.ContainsKey(word))
                {
                    string pattern = String.Format("({0}|{1}){2}", Char.ToUpper(word[0])
                                                                 , word[0]
                                                                 , word.Substring(1));
                    Regex rgx = new Regex(pattern);
                    term = rgx.Replace(term, Tallmen[word]);
                }
            }

            return term;
        }

    }
}
