import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config
import { database } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { handleApiAction } from "@/lib/handleApiAction";
import { getAuth } from "@/lib/requirePermission";
import { ApiError } from "@/lib/api-error";
import { translations } from "@/lib/translation";

export async function POST(request: NextRequest) {
    return handleApiAction(async () => {
        const session = await getAuth()

        if (!session) throw new ApiError(translations.unauthorized, 401)

        // 2. Get body
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) throw new ApiError(translations.allFiledRequired, 400)

        // 3. Get user
        const user = await database.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });

        if (!user || !user.password) throw new ApiError(translations.notFound, 404)

        // 4. Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) throw new ApiError(translations.passwordMisMatch, 400)

        // 5. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 6. Update password
        const updated = await database.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
            select: { id: true }
        });

        return { message: translations.updatedSuccess, data: updated }

    })
}
