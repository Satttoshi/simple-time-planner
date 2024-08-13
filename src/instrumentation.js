import dbConnect from "@/db/connect"

export async function register() {
    await dbConnect()
}
