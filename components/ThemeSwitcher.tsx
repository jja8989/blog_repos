// // components/ThemeSwitcher.tsx
// "use client";

// import { useEffect } from "react";
// import { themeChange } from "theme-change";

// const ThemeSwitcher = () => {
//   useEffect(() => {
//     themeChange(false);
//   }, []);

//   return (
//     <div className="form-control">
//       <label className="label">
//         <span className="label-text">Select Theme</span>
//       </label>
//       <select
//         data-choose-theme
//         className="select select-bordered w-full max-w-xs"
//       >
//         <option value="synthwave">synthwave</option>
//         <option value="corporate">corporate</option>
//         <option value="business">business</option>
//         <option value="winter">winter</option>
//       </select>
//     </div>
//   );
// };

// export default ThemeSwitcher;

// components/ThemeSwitcher.tsx
"use client";

import { useEffect } from "react";
import { themeChange } from "theme-change";

const ThemeSwitcher = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="dropdown dropdown-top">
      <div tabIndex={0} className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60 ml-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box w-52 p-2 shadow"
      >
        <li>
          <button
            data-set-theme="synthwave"
            className="btn btn-sm btn-block btn-ghost justify-start text-base-content"
          >
            Synthwave
          </button>
        </li>
        <li>
          <button
            data-set-theme="corporate"
            className="btn btn-sm btn-block btn-ghost justify-start text-base-content"
          >
            Corporate
          </button>
        </li>
        <li>
          <button
            data-set-theme="business"
            className="btn btn-sm btn-block btn-ghost justify-start text-base-content"
          >
            Business
          </button>
        </li>
        <li>
          <button
            data-set-theme="winter"
            className="btn btn-sm btn-block btn-ghost justify-start text-base-content"
          >
            Winter
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeSwitcher;

