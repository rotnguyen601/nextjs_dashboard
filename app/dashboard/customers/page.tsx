
import Pagination from '@/app/ui/customers/pagination';
import Search from '@/app/ui/search';
import { Suspense } from 'react';
import { fetchCustomerPages } from '@/app/lib/data';
import { CreateCustomers } from '@/app/ui/customers/buttons';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';


// Importing the CustomersTable component

import { CustomersTable } from '@/app/ui/customers/table';

export const metadata: Metadata = {
  title: 'Customer',
};
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
       <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customer..." />
        <CreateCustomers />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}