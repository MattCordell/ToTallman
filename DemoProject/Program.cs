using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace DemoProject
{
    class Program
    {
        public static Dictionary<string, string> Tallmen = new Dictionary<string, string>();


        static void Main(string[] args)
        {
            var Drugs = Properties.Resources.MedicinalProductTerms.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            var TM = Properties.Resources.Tallmen.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

            //initialiseTallmen
            foreach (var entry in TM)
            {
                AddTallman(entry);
            }

            Console.WriteLine("{0} => {1}", "amitriptyline", ToTallman("amitriptyline"));

            foreach (var D in Drugs)
            {
                Console.WriteLine("{0} => {1}", D, ToTallman(D));
            }

            Console.WriteLine("Done");
            Console.ReadKey();

        }

        public static void AddTallman(string s)
        {
            Tallmen.Add(s.ToLower(), s);
        }

        public static string ToTallman(string term)
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
