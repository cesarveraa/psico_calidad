// /src/nbooks/NBooks.js
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import BookCard from "../../components/BookCard"; // Import the book card component
import BookCardSkeleton from "../../components/BookCardSkeleton"; // Import the skeleton component
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import { getAllBooks } from "../../services/index/books"; // Import the book service

let isFirstRun = true;

const NBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllBooks(searchKeyword, currentPage, 12),
    queryKey: ["books"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  console.log(data);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, searchKeyword, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  return (
    <MainLayout>
       <section
        style={{
          background: 'linear-gradient(to right, #0077ff, #32CD32)',
          color: 'white',
          textAlign: 'center',
          padding: '10px 0',
          fontSize: '2rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          width: '100%',
        }}
      >
        Psicopedia
      </section>
      <section className="flex flex-col container mx-auto px-5 py-10">
     
        <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
          {isLoading || isFetching ? (
            [...Array(3)].map((item, index) => (
              <BookCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : isError ? (
            <ErrorMessage message="No se encontraron datos" />
          ) : data?.data.length === 0 ? (
            <p className="text-orange-500">No se encontraron libros</p>
          ) : (
            data?.data.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          )}
        </div>
        {!isLoading && (
          <Pagination
            onPageChange={(page) => handlePageChange(page)}
            currentPage={currentPage}
            totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
          />
        )}
      </section>
    </MainLayout>
  );
};

export default NBooks;
