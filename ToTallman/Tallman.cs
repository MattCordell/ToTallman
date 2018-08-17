using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ToTallman
{    
    public static class Tallman
    {              
            public enum List {AU,US,NZ,UK};

            //Aggregate (default) list
            private static Dictionary<string, string> Tallmen = new Dictionary<string, string>();
            //Specific Regional Lists
            private  static Dictionary<string, string> AU;
            private static Dictionary<string, string> US;
            private static Dictionary<string, string> NZ;
            private static Dictionary<string, string> UK;                          
        

        static Tallman()
        {
            string[] TM = Properties.Resources.Tallmen.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            
            //initialiseTallmen
            foreach (var entry in TM)
            {
                Tallmen.AddTallman(entry);                              
            }

            AU = Tallmen;
            US = AU;
            UK = AU;
            NZ = AU;
        }

        private static void AddTallman(this Dictionary<string,string> list,string s)
        {
            list.Add(s.ToLower(), s);
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

        public static string ToTallman(this String term, Tallman.List specificList)
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
                    term = rgx.Replace(term, Tallmen [word]);
                }
            }
            return term;
        }
    }

    
}
