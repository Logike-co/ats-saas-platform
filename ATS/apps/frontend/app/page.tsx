async function getHealth() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
    const response = await fetch(`${baseUrl}/health`, { cache: "no-store" });
    if (!response.ok) return "backend unavailable";
    const json = (await response.json()) as { status?: string };
    return json.status ?? "unknown";
  } catch {
    return "backend unavailable";
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main>
      <h1>LTI ATS</h1>
      <p>Proyecto base listo para iniciar el desarrollo funcional.</p>
      <p>
        Estado backend: <strong>{health}</strong>
      </p>
    </main>
  );
}
