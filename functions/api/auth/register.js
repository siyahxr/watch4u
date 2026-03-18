export async function onRequestPost({ request, env }) {
    const { fullname, email, password } = await request.json();

    if (!fullname || !email || !password) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    try {
        // Create users table if not exists
        await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname TEXT,
                email TEXT UNIQUE,
                password TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        // Check if user exists
        const existing = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (existing) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
        }

        // Insert new user
        // Note: In real production, hash the password!
        await env.DB.prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)")
            .bind(fullname, email, password)
            .run();

        const newUser = { fullname, email };
        return new Response(JSON.stringify({ user: newUser }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
