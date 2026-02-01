// lib/getRequestLocale.ts
import { routing } from '@/i18n/routing';
import { NextRequest } from 'next/server';


export function getRequestLocale(request: NextRequest) {
    const locale = request.nextUrl.searchParams.get('lang');

    if (locale && routing.locales.includes(locale as any)) {
        return locale;
    }

    return routing.defaultLocale;
}
