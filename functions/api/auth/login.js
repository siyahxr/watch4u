export async function onRequestPost({ request, env }) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    try {
        const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password = ?")
            .bind(email, password)
            .first();

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const authenticatedUser = { id: user.id, email: user.email, fullname: user.fullname };
        return new Response(JSON.stringify({ user: authenticatedUser }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
