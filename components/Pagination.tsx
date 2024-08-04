import React from "react";
import Image from "next/image";
import left from "@/images/left.svg";
import right from "@/images/right.svg";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="buttons flex items-center">
      <button
        className="button w-[40px] h-[40px] flex justify-center items-center rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image src={left} height={10} width={10} alt="Previous" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`button w-[40px] h-[40px] flex justify-center items-center rounded-full ${
            currentPage === page ? "bg-[#F2E8F2]" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="button w-[40px] h-[40px] flex justify-center items-center rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image src={right} height={10} width={10} alt="Next" />
      </button>
    </div>
  );
};

export default Pagination;
