using System;

namespace ToTallman
{
    /// <summary>
    /// Exception thrown when an error occurs during Tallman conversion.
    /// </summary>
    public class TallmanException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TallmanException"/> class.
        /// </summary>
        public TallmanException()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="TallmanException"/> class with a specified error message.
        /// </summary>
        /// <param name="message">The message that describes the error</param>
        public TallmanException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="TallmanException"/> class with a specified error message
        /// and a reference to the inner exception that is the cause of this exception.
        /// </summary>
        /// <param name="message">The message that describes the error</param>
        /// <param name="innerException">The exception that is the cause of the current exception</param>
        public TallmanException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
