'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchemaCustomer = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    email: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    image_url: z.string({
        invalid_type_error: 'Please select a customer.',
    }),

    date: z.string(),
});



const CreateCustomerSchema = FormSchemaCustomer.omit({ id: true, date: true });

export async function createCustomer(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateCustomerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    // Nếu việc kiểm tra biểu mẫu thất bại, trả về lỗi sớm. Nếu không, tiếp tục.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Thiếu Thông Tin. Không Thể Tạo Khách Hàng.',
        };
    }

    // Chuẩn bị dữ liệu để chèn vào cơ sở dữ liệu
    const { name, email, image_url } = validatedFields.data;
  

    // Chèn dữ liệu vào cơ sở dữ liệu
    try {
        await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${image_url})
        `;
    } catch (error) {
        // Nếu có lỗi cơ sở dữ liệu xảy ra, trả về một thông báo lỗi cụ thể hơn.
        return {
            message: 'Lỗi Cơ Sở Dữ Liệu: Không Thể Tạo Khách Hàng.',
        };
    }

    // Kiểm tra lại bộ nhớ cache cho trang khách hàng và chuyển hướng người dùng.
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        return { message: 'Deleted customers.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}






const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

export type State = {
    errors?: {
        name?: string[];

        email?: string[];
        image_url?: string[];
        customerId?: string[];

        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {


    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}