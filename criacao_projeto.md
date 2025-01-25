# Criação do Projeto

Inicializando projeto package.json

1. npm init -y

Fazer a instalação do Typescript na pasta do projeto, como uma dependência de desenvolvimento. Como o código final é convertido para javascript antes de ser disponibilizado online, só precisaremos do Typescript em ambiente de desenvolvimento.

2. npm install typescript ts-node-dev @types/node tsconfig-paths -D

Foi adicionado o pacote tsconfig-paths para também ser instalado. Esse pacote servirá para criação de atalhos para os paths de arquivos ao usar o import.

Criar o arquivo "tsconfig.json" que conterá as configurações do Typescript, com o comando:

3. npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true

Em resumo, os parâmetros passados são:

* rootDir: É aqui que o TypeScript procura nosso código.

* outDir: Onde o TypeScript coloca nosso código compilado.

* esModuleInterop: Se estiver usando commonjs como sistema de módulo (recomendado para aplicativos Node), então esse parâmetro deve ser definido como true.

* resolveJsonModule: Se usarmos JSON neste projeto, esta opção permite que o TypeScript o use.

* lib: Esta opção adiciona tipos de ambiente ao nosso projeto, permitindo-nos contar com recursos de diferentes versões do Ecmascript, bibliotecas de teste e até mesmo a API DOM do navegador. Usaremos recursos es6 da linguagem.

* module: commonjs é o sistema de módulo Node padrão.

* allowJs: Se você estiver convertendo um projeto JavaScript antigo em TypeScript, esta opção permitirá que você inclua arquivos .js no projeto.

* noImplicitAny: Em arquivos TypeScript, não permita que um tipo seja especificado inexplicitamente. Cada tipo precisa ter um tipo específico ou ser declarado explicitamente any.
