import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/girl_2.png";
import contactImage from "../assets/contact.jpg";

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="bg-[#0a1f44] text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto relative">
        <div className="md:w-1/2 space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-blue-400">shopMart</span>
          </h1>
          <p className="text-lg text-gray-300">
            Discover premium products, seamless checkout, and a secure shopping experience.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/products"
              className="px-6 py-2 rounded-md border border-blue-500 text-blue-300 font-semibold hover:text-white hover:border-white transition-all duration-300"
            >
              Browse Products
            </Link>
            {!isAuthenticated && (
              <button
                onClick={() => loginWithRedirect()}
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Right Image with Shape */}
        <div className="md:w-1/2 mt-10 md:mt-5 relative z-10">
          <div className="relative">
            <div className="absolute -top-0 left-4 w-80 h-80 bg-black rounded-tr-[100px] rounded-bl-[100px] rotate-12 opacity-40 z-0"></div>
            <img
              src={heroImage}
              alt="Hero"
              className="relative rounded-lg shadow-lg w-full z-10"
            />
          </div>
        </div>
      </section>

      {/* Collections */}
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-16">
            <h2 className="text-4xl font-bold text-gray-900">Collections</h2>
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
              {[
                {
                  title: "Desk and Office",
                  description: "Work from home accessories",
                  image:
                    "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-01.jpg",
                },
                {
                  title: "Self-Improvement",
                  description: "Journals and note-taking",
                  image:
                    "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-02.jpg",
                },
                {
                  title: "Travel",
                  description: "Daily commute essentials",
                  image:
                    "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-03.jpg",
                },
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                  />
                  <h3 className="mt-6 text-sm text-gray-500">
                    <span className="absolute inset-0"></span>
                    {item.title}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Secure Checkout",
              description:
                "Your data is protected with industry-standard encryption and Auth0 authentication.",
            },
            {
              title: "Fast Delivery",
              description:
                "We ship quickly and reliably, with tracking and support every step of the way.",
            },
            {
              title: "Quality Products",
              description:
                "Handpicked items from trusted vendors, curated for your satisfaction.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[#1a1a2e] p-6 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="p-2 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="bg-[#f5f5f5] text-[#1a1a2e] py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#0a1f44]">Contact Us</h2>
            <p className="text-xl text-gray-700">
              We're here to help you with anything related to your shopping experience. Reach out
              anytime!
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-base">
                <span className="font-semibold">Company:</span> ShopMart Pvt Ltd
              </p>
              <p className="text-base">
                <span className="font-semibold">Address:</span> 123 Market Street, Colombo, Sri Lanka
              </p>
              <p className="text-base">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:support@shopmart.com"
                  className="text-blue-600 hover:underline"
                >
                  support@shopmart.com
                </a>
              </p>
              <p className="text-base">
                <span className="font-semibold">Phone:</span>{" "}
                <a href="tel:+94112223344" className="text-blue-600 hover:underline">
                  +94 112 223 344
                </a>
              </p>
              <p className="text-base">
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href="https://shopmartwebsite.com"
                  className="text-blue-600 hover:underline"
                >
                  shopmartwebsite.com
                </a>
              </p>
            </div>
            <Link
              to="/products"
              className="inline-block mt-4 px-6 py-2 bg-[#0a1f44] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Shop Now
            </Link>
          </div>

          {/* Decorative Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#e0e0e0] rounded-tr-[80px] rounded-bl-[80px] rotate-6 opacity-30 z-0"></div>
            <img
              src={contactImage}
              alt="Contact Graphic"
              className="relative z-10 rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;