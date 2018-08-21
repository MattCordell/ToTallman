using System;
using ToTallman;


//.Net Core Console App
namespace DemoApp1
{
    class Program
    {

        static void Main(string[] args)
        {
            var Drugs = Properties.Resources.MedicinalProductTerms.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            
            foreach (var D in Drugs)
            {
                Console.WriteLine("{0} => {1}", D, D.ToTallman());                                   
            }

            var s1 = "This drug is norfloxacin";
            Console.WriteLine("{0} => {1}", s1, s1.ToTallman(Tallman.List.AU));

            Console.WriteLine("Done");
            Console.ReadKey();
        }
    }
}
