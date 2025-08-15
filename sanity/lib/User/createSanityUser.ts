import { client } from "../client";

function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const randomPart1 = Array.from(
    { length: 3 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const randomPart2 = Array.from(
    { length: 3 },
    () => nums[Math.floor(Math.random() * nums.length)]
  ).join("");
  return `${randomPart1}${randomPart2}`;
}

// ID del plan gratuito (el que ya tenés)
const FREE_PLAN_ID =
  process.env.FREE_PLAN_ID || "9080a077-b426-478d-9e08-1eeb5fe9ca07";

// Crea un usuario en Sanity
export async function createSanityUser(user: {
  name?: string | null;
  email?: string | null;
}) {
  if (!user.email) return { success: false, message: "Email requerido" };

  // 1) comprobar si ya existe
  const existing = await client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email: user.email }
  );

  if (existing) {
    console.log("El usuario ya existe en Sanity.");
    return {
      success: true,
      message: "Usuario ya existe",
      userId: existing._id,
    };
  }

  // 2) obtener datos del plan gratuito (para tomar los créditos si querés)
  const freePlan = await client.fetch(
    `*[_type == "plansPayment" && _id == $id][0]{_id, name, credits, price, typeOfPlan, benefits}`,
    { id: FREE_PLAN_ID }
  );

  const creditsFromPlan =
    typeof freePlan?.credits === "number" ? freePlan.credits : 10;

  // 3) documento a crear (incluye referencia al plan)
  const doc = {
    _type: "user",
    fullName: user.name || "Sin nombre",
    email: user.email,
    token: {
      _type: "slug",
      current: generateToken(),
    },
    credits: creditsFromPlan,
    plan: { _type: "reference", _ref: FREE_PLAN_ID },
  };

  try {
    const created = await client.create(doc);
    return { success: true, message: "Usuario creado", userId: created._id };
  } catch (error) {
    console.error("Error creando usuario en Sanity:", error);
    return { success: false, message: "Error creando usuario" };
  }
}
