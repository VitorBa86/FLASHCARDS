# Revisão Guiada CGU · Flashcards

Página de estudos com 1.400 cartões organizados em 14 módulos. Permite selecionar módulos ou partes, estudar em ordem embaralhada, registrar acertos e erros e revisar as respostas erradas ao final da sessão.

## Como abrir

Abra `index.html` no navegador. Não é necessário instalar dependências nem compilar o projeto. Mantenha a pasta `assets` junto do HTML.

As fontes do Google Fonts precisam de internet; se estiver offline, o navegador utiliza as fontes alternativas do sistema. Os cartões e a lógica são locais.

## Estrutura

```text
.
├── index.html                # Estrutura da página
├── assets/
│   ├── css/styles.css        # Estilos e layout responsivo
│   └── js/
│       ├── flashcards.js     # Conteúdo dos 1.400 cartões
│       └── app.js            # Seleção, estudo e revisão
├── docs/
│   └── CGU_Revisao_Guiada_1400_Flashcards.md
├── .gitignore
├── .nojekyll
└── README.md
```

O arquivo em `docs` é o material de referência. Para alterar os cartões exibidos na página, edite `assets/js/flashcards.js`; não há sincronização automática com o Markdown. Preserve os códigos únicos dos cartões e carregue esse arquivo antes de `app.js`.

## Enviar para o GitHub

Crie um repositório vazio no GitHub. Nesta pasta, execute os comandos abaixo, substituindo `SEU-USUARIO` e `SEU-REPOSITORIO` pelos valores reais:

```sh
git init
git add .
git commit -m "Organiza página de flashcards CGU"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

O backup `index.backup.html` permanece local e é ignorado pelo Git, assim como os arquivos `.DS_Store`.

## Publicar no GitHub Pages

No repositório, abra **Settings → Pages**. Em **Build and deployment**, selecione **Deploy from a branch**, escolha a branch `main` e a pasta `/ (root)` e salve. Quando a publicação terminar, o GitHub exibirá o endereço da página.

Os caminhos dos arquivos são relativos e funcionam tanto na raiz de um domínio quanto em um endereço de projeto como `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.

## Uso

Selecione os módulos e clique em **Começar a estudar**. Clique no cartão ou pressione `R` para ver a resposta; use `A` para marcar acerto e `E` para marcar erro. Ao finalizar, confira o resultado ou revise apenas os erros.

Os resultados ficam apenas na memória da aba: recarregar ou fechar a página apaga a sessão. Não há login, servidor ou armazenamento de progresso.
