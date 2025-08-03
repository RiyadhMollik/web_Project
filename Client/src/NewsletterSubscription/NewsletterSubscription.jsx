import React, { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Normally you'd send this to an API here
      console.log("Subscribed with email:", email);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto text-center mt-12">
      <h2 className="text-2xl font-bold mb-4">Subscribe to CureSync Updates</h2>
      <p className="mb-4 text-gray-600">Get the latest news and features on how CureSync is transforming healthcare scheduling.</p>
      {submitted ? (
        <p className="text-green-600 font-semibold">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border rounded-xl px-4 py-2 w-full sm:w-auto flex-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
