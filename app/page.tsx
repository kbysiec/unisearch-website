import { redirect } from 'next/navigation';
import { defaultLocale } from '@/src/config/i18n';

export default function IndexPage() {
  redirect(`/${defaultLocale}`);
}
