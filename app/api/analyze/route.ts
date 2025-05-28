export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos del formulario route analyze:", body);

    const res = await fetch(`${process.env.API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: body.texto,
        // email: result.data.email
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: false,
          error:
            errorData.message ||
            `Error en el servicio externo: ${res.statusText}`,
        }),
        { status: res.status }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el servidor route analyze:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno del servidor",
      }),
      { status: 500 }
    );
  }
}
