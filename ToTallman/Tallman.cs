using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ToTallman
{    
    public static class Tallman
    {              
            public enum List {AU,FDA,NZ,ISMP};

            //Aggregate (default) list
            private static Dictionary<string, string> Tallmen = new Dictionary<string, string>();
            //Specific Regional Lists
            private  static Dictionary<string, string> AU = new Dictionary<string, string>();
        private static Dictionary<string, string> FDA = new Dictionary<string, string>();
        private static Dictionary<string, string> NZ = new Dictionary<string, string>();
        private static Dictionary<string, string> ISMP = new Dictionary<string, string>();


        static Tallman()
        {
            string[] TM = Properties.Resources.Tallmen.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

            string[] _AU = Properties.Resources.AU_2017.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            string[] _FDA = Properties.Resources.FDA_2016.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            string[] _ISMP = Properties.Resources.ISMP_2016.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            string[] _NZ = Properties.Resources.NZ_2013.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);            

            //initialiseTallmen
            //Do this more elegantly
            foreach (var entry in TM)
            {
                Tallmen.AddTallman(entry);                              
            }

            foreach (var entry in _AU)
            {
                AU.AddTallman(entry);
            }

            foreach (var entry in _FDA)
            {
                FDA.AddTallman(entry);
            }

            foreach (var entry in _ISMP)
            {
                ISMP.AddTallman(entry);
            }

            foreach (var entry in _NZ)
            {
                NZ.AddTallman(entry);
            }
            
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
                    string pattern = String.Format(@"\b(?i){0}\b", word);
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
                    string pattern = String.Format(@"\b(?i){0}\b", word);
                    Regex rgx = new Regex(pattern);
                    term = rgx.Replace(term, Tallmen [word]);
                }
            }
            return term;
        }

        //Method for accepting applying mulitple lists e.g. FDA+ISMP
        private static string ToTallman(string v, params List[] args)
        {
            throw new NotImplementedException();
        }
    }

    
}
