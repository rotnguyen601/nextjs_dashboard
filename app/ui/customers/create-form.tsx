'use client';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/actions';

export default function Form({ customers }: { customers: CustomerField[] }) {
    const initialState = { message: null, errors: {} };
    const [StateCustomer, dispatch] = useFormState(createCustomer, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Name
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="name-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {/* Name error messages */}
                    </div>
                </div>

                {/* email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Choose an amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="email"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="customer-error"
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id="customer-error" aria-live="polite" aria-atomic="true">
                            {StateCustomer.errors?.email &&
                                StateCustomer.errors.email.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Image URL */}
                <div className="mb-4">
                    <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                        Image URL
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            id="image_url"
                            name="image_url"
                            type="text"
                            placeholder="Image URL"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="image_url-error"
                        />
                    </div>
                    <div id="image_url-error" aria-live="polite" aria-atomic="true">
                       
                    </div>
                </div>  

                {/* Error Message */}
                {StateCustomer.message && (
                    <div className="mt-2 text-sm text-red-500">{StateCustomer.message}</div>
                )}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/customer"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Customer</Button>
            </div>
        </form>
    );
}