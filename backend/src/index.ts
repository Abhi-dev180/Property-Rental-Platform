import app from "./app";
import { env } from "./config/env";
import { supabaseAdmin } from "./config/supabase";

app.listen(env.port, async () => {
  console.log(`Backend running on http://localhost:${env.port} [${env.nodeEnv}]`);

  const { error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error("❌ Supabase connection failed:", error.message);
  } else {
    console.log("✅ Supabase connected successfully");
  }
});

