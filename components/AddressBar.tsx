import React from "react";

interface AddressBarProps {
  subdomain: string;
  pageTitle: string;
  pages: string[];
  onPageChange: (newPage: string) => void;
}

const AddressBar: React.FC<AddressBarProps> = ({
  subdomain,
  pageTitle,
  pages,
  onPageChange,
}) => {
  const baseUrl = `https://${subdomain}.aiwebsitebuilder.tech/`;

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 mb-2 flex items-center">
      <span className="text-green-600 mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="mr-2">{baseUrl}</span>
      <select
        value={pageTitle}
        onChange={(e) => onPageChange(e.target.value)}
        className="bg-transparent border-none focus:outline-none text-sm flex-grow"
      >
        {pages.map((page) => (
          <option key={page} value={page}>
            {page}.html
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddressBar;
