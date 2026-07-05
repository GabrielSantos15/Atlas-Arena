# ⚡ Quiz Multiplayer

![Status Em Desenvolvimento](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

Uma plataforma de quiz multiplayer em tempo real, projetada para testar conhecimentos em salas temáticas simultâneas. Desenvolvida com foco em alta performance, UX/UI responsiva e arquitetura orientada a eventos.

## 🎯 Visão Geral do Projeto

Este projeto é um estudo de caso prático focado em resolver os desafios de conectividade e gestão de estado em aplicações **Stateful**. A plataforma simula a dinâmica de jogos interativos, permitindo que múltiplos usuários conectem-se a salas temáticas (ex: Tecnologia, Matemática, Lógica) e interajam simultaneamente com latência mínima.

### 🚀 Principais Funcionalidades (Em Desenvolvimento)
- **Salas Temáticas (Rooms):** Isolamento de tráfego via WebSockets, garantindo que eventos ocorram de forma independente em diferentes sessões.
- **Sincronização em Tempo Real:** Atualização instantânea de placares, cronômetros e transição de perguntas sem necessidade de *polling*.
- **Gestão de Estado In-Memory:** Lógica de partida processada diretamente na memória do servidor Node.js para maximizar a velocidade de resposta, sem sobrecarga de banco de dados no núcleo do jogo.
- **Interface Fluida e Dinâmica:** Feedback visual imediato e animações otimizadas na transição de estados do jogo.

## 🏗️ Arquitetura e Tecnologias

A aplicação utiliza uma arquitetura separada para contornar as limitações de conexões contínuas (WebSockets) em ambientes *Serverless*, garantindo escalabilidade e robustez.

**Front-end (Interface & BFF):**
- **Next.js (App Router):** Framework React para renderização e rotas.
- **TypeScript:** Tipagem estática para maior segurança no fluxo de dados.
- **Tailwind CSS:** Estilização utilitária ágil e responsiva.

**Back-end (Servidor de Tempo Real):**
- **Node.js & Express:** Servidor dedicado para manter conexões stateful ativas.
- **Socket.io:** Motor de comunicação bidirecional e orientada a eventos.

## 🛠️ Como Executar Localmente

*(Instruções detalhadas de inicialização do Back-end serão adicionadas em breve).*

### Front-end
```bash
# Clone o repositório
git clone 

# Acesse a pasta do front-end
cd quiz-multiplayer/frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev