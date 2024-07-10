using MiniCalculator;

namespace MiniCalculatorTest
{
    public class Tests
    {
        // right click project, add project reference to MiniCalculator
        Calculator calc { get; set; } = null;
        [SetUp] // works as a controller to the project

        public void Setup()
        {
            calc = new Calculator();
        }

        [Test] // any test should start with this tag
        public void TestGetAddition()
        {   /*
             * Insert the method body we need to perform three operations
             * AAA:
             * A: Arrange the code
             * A: Act on the code
             * A: Assert operation
             * 
             */
            // A: Arrange
            double a = 5.7, b = 6.8, expectedResult = 12.5;

            // A: Act
            double result = calc.getAddition(a, b);

            // A: Assert Operation
            Assert.AreEqual(expectedResult, result);
            Assert.That(result, Is.TypeOf<double>());

            // Assert.Pass();
        }

        [Test]
        public void TestGetMultiplication() {
            // Arrange
            double a = 2.5, b = 3.5, expectedResult = 8.75;
            // Act
            var result = calc.getMultiplication(a, b);
            // Assert
            Assert.AreEqual(expectedResult, result);
            Assert.That(result, Is.TypeOf<double>());
        }
    }
}