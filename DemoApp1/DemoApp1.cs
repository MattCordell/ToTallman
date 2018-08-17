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

            Console.WriteLine("Done");
            Console.ReadKey();
        }
    }
}
