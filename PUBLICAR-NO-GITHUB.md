# Publicar no GitHub Pages

Esta pasta já está pronta para ser publicada. O arquivo `index.html` está na raiz, como o GitHub Pages exige.

## 1. Criar o repositório

1. Entre em https://github.com e faça login.
2. Clique em **New** para criar um repositório.
3. Use um nome simples, por exemplo: `sondagem-empresarial`.
4. Selecione **Public**.
5. Não marque as opções para criar README, `.gitignore` ou licença: a pasta já contém os arquivos necessários.
6. Clique em **Create repository**.

## 2. Enviar os arquivos

1. Na página do repositório, escolha **uploading an existing file**.
2. Arraste todos os arquivos desta pasta, inclusive `index.html`, `styles.css`, `app.js`, `.nojekyll` e `.gitignore`.
3. Clique em **Commit changes**.

## 3. Ativar o site

1. No repositório, abra **Settings**.
2. No menu lateral, clique em **Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/(root)`.
5. Clique em **Save**.

Em alguns minutos, o GitHub exibirá o endereço público. Ele terá este formato:

`https://SEU-USUARIO.github.io/sondagem-empresarial/`

## Atualizações

Quando precisar alterar a aplicação, abra o repositório no GitHub, envie a versão atualizada dos arquivos e confirme em **Commit changes**. O endereço público continua o mesmo.

## Privacidade

O GitHub Pages de um repositório público deixa o código visível para qualquer pessoa. Os dados preenchidos na aplicação ficam no armazenamento local do navegador de cada usuário e não são enviados ao GitHub.
