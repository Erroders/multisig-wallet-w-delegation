import React from "react";
// import Navbar from "../components/navbar";
// import Header from "./Header";
import Navbar from "./../components/Navbar";

type Props = {};

const addSigner = (props: Props) => {
  return (
    <>
      <Navbar></Navbar>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
            Add Signer
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
            sunt dolores deleniti inventore quaerat mollitia?
          </p>

          <form
            action=""
            className="mt-6 mb-0 space-y-4 rounded-lg p-8 shadow-2xl"
          >
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="number" className="text-sm font-medium">
                Number
              </label>

              <div className="relative mt-1">
                <input
                  type="tel"
                  id="number"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Number"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter email"
                />

                <span className="absolute inset-y-0 right-4 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium">
                Wallet Address
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="walletAddress"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Wallet Address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="Role" className="text-sm font-medium">
                Role
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="Role"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Role"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium " htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full rounded-lg border-gray-200 p-3 text-sm shadow-md"
                placeholder="Message"
                rows={8}
                id="message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-500">
              No account?
              <a className="underline" href="">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default addSigner;
