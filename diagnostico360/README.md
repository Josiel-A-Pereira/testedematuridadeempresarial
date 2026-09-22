# Diagnóstico 360 — GitHub Pages

Aplicação estática de diagnóstico de maturidade empresarial com nove áreas e 71 perguntas. Inclui Inovação e tecnologias aplicadas, seleção livre de áreas, evidências, histórico, gráficos de barras e radar, relatório PDF com download direto e nível de gestão em destaque e exportação/importação JSON.

## Publicação

Os arquivos funcionam na raiz de um site ou em uma subpasta. Não exigem instalação, compilação, domínio próprio, banco de dados ou chave de acesso.

Em um repositório novo, envie os arquivos desta pasta (não o ZIP) e configure **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**. O GitHub exibirá o endereço de publicação. No GitHub Free, utilize um repositório público.

Se o repositório já possui GitHub Pages ativado, basta adicionar estes arquivos à pasta escolhida na origem publicada e aguardar a conclusão de “pages build and deployment” em Actions. Mantenha index.html, style.css, data.js, engine.js, app.js, pdf-report.js, pdf-lib.min.js e favicon.svg juntos.

## Dados dos diagnósticos

O GitHub publica somente o aplicativo e suas perguntas. Os dados preenchidos ficam no navegador de cada usuário, sem serem enviados pelo aplicativo a um servidor. Exporte o diagnóstico para guardar ou transferir a outro aparelho. Para continuar um diagnóstico feito no HTML local, exporte o JSON nele e importe na versão online: os dois endereços usam armazenamentos separados.

Não envie ao repositório os JSON de diagnósticos, relatórios preenchidos, a planilha de empresas ou informações pessoais. A aplicação e seu código ficam publicamente acessíveis quando publicados no GitHub Pages.

## Referências

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
