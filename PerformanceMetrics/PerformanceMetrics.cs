using System;
using ToTallman;
using System.Diagnostics;

namespace PerformanceMetrics
{
    class PerformanceMetrics
    {
        static void Main(string[] args)
        {
            var Drugs = Properties.Resources.MedicinalProductTerms.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

            var sw = new Stopwatch();

            foreach (var item in Drugs)
            {
                sw.Start();                
                Console.Write("{0}\t{1}\t{2}\t", item, sw.ElapsedTicks.ToString(), sw.ElapsedMilliseconds.ToString());
                sw.Restart();
                Console.Write("{0}\t{1}\t{2}\r\n", item.ToTallman(), sw.ElapsedTicks.ToString(), sw.ElapsedMilliseconds.ToString());
                sw.Reset();

            }

            Console.ReadKey();
        }
    }
}
