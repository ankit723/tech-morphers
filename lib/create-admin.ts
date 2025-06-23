"use server"
import { hashPassword } from "./auth";
import { prisma } from "./db";

export async function createAdminUser() {
    const email = "admin@techmorphers.com";
    const password = "00000000";
    const name = "Ankit Biswas";
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role: "ADMIN" },
    });
    return user;
}

if (require.main === module) {
    createAdminUser()
        .then(() => {
            console.log("✨ Admin user created");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Admin user creation failed:", error);
            process.exit(1);
        });
}