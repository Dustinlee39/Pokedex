export function commandRouter(input, context) {

  const text = input.toLowerCase();

  /* REGION COMMAND */
  if (text.includes("region")) {

    if (text.includes("kanto")) return "kanto";
    if (text.includes("johto")) return "johto";
    if (text.includes("hoenn")) return "hoenn";
    if (text.includes("sinnoh")) return "sinnoh";
  }

  /* SEARCH COMMAND */
  if (text.startsWith("show ")) {

    const name = text.replace("show ", "").trim();

    const match = context.cache.find(p =>
      p.name === name
    );

    return { action: "show", data: match };
  }

  /* BATTLE COMMAND */
  if (text.includes("battle")) {
    return { action: "battle" };
  }

  /* DEFAULT */
  return { action: "unknown", raw: input };
}
