import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear en caso de que el texto contenga títulos
const formatHeadings = (text: string) => {
  // Títulos desde ### hasta #
  return text
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");
};

// Formatear en caso de que el texto contenga negrita
const formatBold = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};

// Formatear en caso de que el texto contenga código inline
const formatInlineCode = (text: string) => {
  return text.replace(/`([^`]+)`/g, "<code>$1</code>");
};

// Formatear en caso de que el texto contenga saltos de línea
const formatLineBreaks = (text: string) => {
  return text.replace(/\n/g, "<br>");
};

// Formatear en caso de que el texto contenga bloques de código
const formatCodeBlocks = (text: string) => {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang = "", code) => {
    return `<pre class="code-card"><code class="language-${lang.trim()}">${code.trim()}</code></pre>`;
  });
};

// Formatear en caso de que el texto contenga listas
const formatLists = (text: string) => {
  // Detectar bloques de lista con *
  return text.replace(/(?:^|\n)(\* .+(?:\n\* .+)*)/g, (match, listBlock) => {
    const items = listBlock
      .split("\n")
      .map((item: string) => item.replace(/^\* /, "").trim())
      .map((item: string) => `<li>${item}</li>`)
      .join("");

    return `<ul>${items}</ul>`;
  });
};

// Verificar que se hayan cerrado correctamente las etiquetas HTML
const validateHtmlTags = (html: string) => {
  const stack = [];
  const tagPattern = /<\/?([a-zA-Z0-9\-]+)(?:\s[^>]*)?>/g;
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const [fullTag, tagName] = match;
    if (!fullTag.startsWith("</")) {
      // Opening tag
      if (!["br", "hr", "img", "input", "meta", "link"].includes(tagName)) {
        stack.push(tagName);
      }
    } else {
      // Closing tag
      const last = stack.pop();
      if (last !== tagName) {
        console.warn(`Tag mismatch: expected </${last}>, found </${tagName}>`);
        return false;
      }
    }
  }

  return stack.length === 0;
};

// Formatear el texto de la respuesta de la IA
export const formatResponse = (text: string) => {
  let formatted = text;
  formatted = formatCodeBlocks(formatted); // primero bloques de código
  formatted = formatHeadings(formatted); // títulos
  formatted = formatLists(formatted); // listas con *
  formatted = formatBold(formatted); // negrita **
  formatted = formatInlineCode(formatted); // código inline con `
  formatted = formatLineBreaks(formatted); // saltos de línea

  // Verificación final
  const valid = validateHtmlTags(formatted);
  if (!valid) {
    console.warn("HTML mal cerrado en el texto formateado.");
  }

  return formatted;
};
