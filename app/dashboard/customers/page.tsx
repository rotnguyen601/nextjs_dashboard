// page.js

import Pagination from '@/app/ui/customers/pagination';
import Search from '@/app/ui/search';
import { Suspense } from 'react';
import { fetchCustomerPages } from '@/app/lib/data';
import { CreateCustomers } from '@/app/ui/customers/buttons';


// Importing the CustomersTable component
import { CustomersTable } from '@/app/ui/customers/table';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomerPages(query);

  return (
    <div className="w-full">
      <CreateCustomers />
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersTable query={query} currentPage={currentPage} />

      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}