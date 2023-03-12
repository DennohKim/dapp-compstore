import React from "react";

export default function AddComputerModal() {
  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my-modal-3"
        className="cursor-pointer rounded-full border-2 border-gray-800 text-gray-800 px-3 py-2"
      >
        List a Computer
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div data-theme="cupcake" className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <form>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  ">
                <div>
                  <label className="label">
                    <span className="label-text">Computer Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input rounded-md w-full max-w-xs"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Image URL</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input rounded-md w-full max-w-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  ">
                <div className="">
                  <label className="label">
                    <span className="label-text">Computer Specs</span>
                  </label>
                  <textarea
                    className="textarea-bordered rounded-md textarea h-24 w-full"
                    placeholder="Bio"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
                <div>
                  <label className="label">
                    <span className="label-text">Store Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input rounded-md w-full max-w-xs"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input rounded-md w-full max-w-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 items-end gap-6  ">
                <div>
                  <button
                    type="submit"
                    className="btn-wide btn border-none bg-[#250438] text-white"
                  >
                    List Computer
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
