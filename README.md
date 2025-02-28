
# Sistema de Controle de Conta Bancária

Este é um sistema simples de controle de conta bancária desenvolvido com **Next.js**. O objetivo deste projeto é permitir aos usuários visualizar o saldo da conta, realizar depósitos, retiradas e consultar o histórico de transações.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento de aplicações web.
- **React**: Biblioteca para a construção da interface de usuário.
- **Tailwind CSS**: Framework para estilos rápidos e responsivos.
- **API Routes (Next.js)**: Para criar APIs dentro da mesma aplicação Next.js.
- **LocalStorage**: Para persistir as transações e saldo da conta (pode ser substituído por um banco de dados real em versões futuras).

## Funcionalidades (em andamento)

- **Visualização do saldo**: Exibe o saldo atual da conta bancária do usuário.
- **Depósitos**: Permite ao usuário adicionar um valor à sua conta.
- **Retiradas**: Permite ao usuário retirar um valor da sua conta, se houver saldo suficiente.
- **Histórico de transações**: Exibe um histórico com todas as transações realizadas.
- **Responsividade**: Interface totalmente responsiva, funcionando bem em dispositivos móveis e desktop.

## Pré-requisitos

- **Node.js**: Para rodar o servidor de desenvolvimento e instalar as dependências.
- **npm ou yarn**: Para gerenciar pacotes e dependências.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/controle-conta-bancaria.git
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd controle-conta-bancaria
   ```

3. Instale as dependências:

   Se estiver usando o npm:

   ```bash
   npm install
   ```

   Ou se preferir o yarn:

   ```bash
   yarn install
   ```

4. Inicie o servidor de desenvolvimento:

   Se estiver usando o npm:

   ```bash
   npm run dev
   ```

   Ou com o yarn:

   ```bash
   yarn dev
   ```

5. Acesse o sistema no navegador:

   Abra seu navegador e vá até `http://localhost:3000`.

## Estrutura do Projeto

```
/pages
  (private)             # Rotas Privadas (dashboard)
  (public)              # Rotas Publicas (login, sign up, pricing)
  index.js              # Página inicial com interface para o usuário
/styles
  globals.css           # Estilos globais
  layout.tsx            # Base Layout
/components
  Button.tsx
  Checkbox.tsx
  Input.tsx
/services
  /auth
    route.ts            # Api para autenticação
  /user
    route.ts            # Api para obtenção de info do usuário
  
```

## Como Usar

1. Ao acessar a página inicial, o usuário verá seu saldo atual.
2. Para realizar um depósito, o usuário deve informar o valor desejado e clicar em "Depositar".
3. Para realizar uma retirada, o usuário deve informar o valor desejado e clicar em "Retirar" (se houver saldo suficiente).
4. O histórico de transações será exibido logo abaixo, mostrando depósitos e retiradas realizadas.

## Melhorias Futuras

- Implementar autenticação de usuário (Login e Senha).
- Integrar com banco de dados para persistir saldo e transações entre sessões.
- Criar um sistema de notificações para alertar o usuário sobre mudanças no saldo.

## Contribuindo

1. Fork este repositório.
2. Crie uma branch para sua feature (`git checkout -b feature-nome-da-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Envie para a branch principal (`git push origin feature-nome-da-feature`).
5. Crie uma pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
