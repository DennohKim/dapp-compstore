import React from 'react'

export default function CheckoutModal() {
  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my-modal-4"
        className="cursor-pointer rounded-full border-2 border-gray-800 text-gray-800 px-3 py-2"
      >
        List a Computer
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            been selected for a chance to get one year of subscription to use
            Wikipedia for free!
          </p>
        </label>
      </label>
    </>
  );
}
