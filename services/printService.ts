// /src/services/printService.ts
type PrintDocType = "CAT" | "SINAN";

export type PrintOptions = {
  type: PrintDocType;
  data: any;                 // Notificacao (ou o objeto que você já usa)
  title?: string;            // opcional: título da aba do print
  timeoutMs?: number;        // opcional: tempo máximo aguardando carregar
  removeAfterPrint?: boolean;// default: true
};

function waitForLoad(iframe: HTMLIFrameElement, timeoutMs: number) {
  return new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(() => {
      cleanup();
      reject(new Error("Timeout: não carregou o HTML de impressão a tempo."));
    }, timeoutMs);

    const onLoad = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      window.clearTimeout(t);
      iframe.removeEventListener("load", onLoad);
    };

    iframe.addEventListener("load", onLoad);
  });
}

function waitNextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export const printService = {
  async print(options: PrintOptions) {
    const {
      type,
      data,
      title = type === "CAT" ? "Impressão CAT" : "Impressão SINAN",
      timeoutMs = 8000,
      removeAfterPrint = true,
    } = options;

    const url =
      type === "CAT"
        ? "/prints/CAT_PRINT.html"
        : "/prints/SINAN_PRINT.html";

    // 1) Cria iframe invisível
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.setAttribute("aria-hidden", "true");

    document.body.appendChild(iframe);

    try {
      // 2) Carrega o HTML
      iframe.src = url;

      await waitForLoad(iframe, timeoutMs);

      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;

      if (!win || !doc) {
        throw new Error("Falha ao acessar o conteúdo do iframe para imprimir.");
      }

      // 3) Injeta dados pro HTML (o HTML já tem script que lê window.__DATA__)
      (win as any).__DATA__ = data;

      // opcional: você pode mudar o title do documento
      try {
        doc.title = title;
      } catch {}

      // 4) Dá um tempo pro script do HTML preencher os campos
      // (hydrate() roda logo ao carregar; mas aqui garantimos repintura)
      await waitNextFrame();
      await new Promise((r) => setTimeout(r, 50));
      await waitNextFrame();

      // 5) Imprime só o iframe
      // focus ajuda em alguns browsers
      win.focus();
      win.print();

      // 6) Remove depois
      if (removeAfterPrint) {
        // afterprint nem sempre dispara; removemos com delay seguro
        window.setTimeout(() => {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1000);
      }
    } catch (err) {
      // remove em caso de erro
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      throw err;
    }
  },
};
