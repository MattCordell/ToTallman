using Microsoft.VisualStudio.TestTools.UnitTesting;
using ToTallman;

namespace ToTallman_Tests
{
    [TestClass]
    public class BaselineValidation_amiODAROne
    {
        [TestMethod]
        public void Lower_case_input()
        {
            var expected = "amiODAROne";            
            
            Assert.AreEqual(expected, expected.ToLower().ToTallman());
        }

        [TestMethod]
        public void Upper_case_input()
        {
            var expected = "amiODAROne";

            Assert.AreEqual(expected, expected.ToUpper().ToTallman());
        }

        [TestMethod]
        public void Sentence_case_input()
        {
            var expected = "amiODAROne";

            var sentenceCase = expected.Substring(0,1).ToUpper() + expected.Substring(1).ToLower();            

            Assert.AreEqual(expected, sentenceCase.ToTallman());
        }

        [TestMethod]
        public void Within_text()
        {
            //Text from https://www.nps.org.au/australian-prescriber/articles/amiodarone
            var input = "Amiodarone is the most effective antiarrhythmic drug available. In most countries (including Australia), amiodarone is the most commonly prescribed antiarrhythmic apart from drugs such as digoxin and beta blockers. Amiodarone can be used to treat tachyarrhythmias, including atrial fibrillation, ventricular tachycardia and patients at high risk of sudden cardiac death. Although amiodarone is effective, it is not generally recommended for minor rhythm disturbances because of its toxicity. It is a difficult and challenging drug to use in clinical practice. This is because of its very prolonged half-life and because of its multiple adverse effects.";
            //validate input
            Assert.IsTrue(input.Contains("Amiodarone"));
            Assert.IsTrue(input.Contains("amiodarone"));
            Assert.IsFalse(input.Contains("amiODAROne"));


            var expected = "amiODAROne is the most effective antiarrhythmic drug available. In most countries (including Australia), amiODAROne is the most commonly prescribed antiarrhythmic apart from drugs such as digoxin and beta blockers. amiODAROne can be used to treat tachyarrhythmias, including atrial fibrillation, ventricular tachycardia and patients at high risk of sudden cardiac death. Although amiODAROne is effective, it is not generally recommended for minor rhythm disturbances because of its toxicity. It is a difficult and challenging drug to use in clinical practice. This is because of its very prolonged half-life and because of its multiple adverse effects.";
            //validate expected
            Assert.IsFalse(expected.Contains("Amiodarone"));
            Assert.IsFalse(expected.Contains("amiodarone"));
            Assert.IsTrue(expected.Contains("amiODAROne"));

            //Now actually validate ToTallman()
            Assert.AreEqual(expected, input.ToTallman());                       
            Assert.IsFalse(input.ToTallman().Contains("Amiodarone"));
            Assert.IsFalse(input.ToTallman().Contains("amiodarone"));
            Assert.IsTrue(input.ToTallman().Contains("amiODAROne"));
        }

        [TestMethod]
        public void WithOtherCharacters()
        {
            //ToTallman() should not affect any of these inputs.
            //"nexiUM" but with other characters attached

            var input = "nexium";
            var input1 = "nexiUMPost";
            var input2 = "PrenexiUM";
            var input3 = "PREnexiUMPOST";

            Assert.AreNotEqual(input, input.ToTallman());
            Assert.AreEqual("nexiUM", input.ToTallman());

            Assert.AreEqual(input1, input1.ToTallman());
            Assert.AreEqual(input2, input2.ToTallman());
            Assert.AreEqual(input3, input3.ToTallman());
        }

        [TestMethod]
        public void With_a_hyphen()
        {
            var expected = "SOLU-medrol";

            var sentenceCase = expected.Substring(0, 1).ToUpper() + expected.Substring(1).ToLower();

            Assert.AreEqual(expected, sentenceCase.ToTallman());
        }

        
    }
}
