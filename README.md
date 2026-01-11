# 🎸 Rock in Rio 2024 - Sistema de Ingressos

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)

Sistema de venda de ingressos desenvolvido como projeto de portfólio, simulando a experiência de compra de um evento de alto tráfego como o Rock in Rio.

## 🎯 Sobre o Projeto

Este projeto demonstra a implementação de um sistema completo de venda de ingressos online, incluindo:
- Controle de fila de espera
- Gerenciamento de sessões temporárias
- Validação de formulários em tempo real
- Geração de ingressos digitais

## ✨ Funcionalidades

- ✅ **Fila de Espera Controlada**: Sistema que permite apenas 1 usuário por vez
- ✅ **Reserva Temporária**: 10 minutos para conclusão da compra
- ✅ **Seleção de Dias**: Escolha entre 3 dias de festival com line-ups diferentes
- ✅ **Validação em Tempo Real**: Formulário com feedback instantâneo
- ✅ **Geração de Ingresso Digital**: Layout profissional pronto para impressão
- ✅ **Sistema de Logs**: Rastreamento discreto de todas as ações do usuário
- ✅ **Design Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones moderna

### Recursos React
- `useState` - Gerenciamento de estado
- `useEffect` - Efeitos colaterais e timers
- `useCallback` - Otimização de performance

### Técnicas de Estilização
- Gradientes complexos e animações CSS
- Glassmorphism (backdrop-blur)
- Responsive design com Grid e Flexbox
- Animações e transições suaves
- Print-ready styles

## 🚀 Como Executar

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/rock-in-rio-tickets.git
cd rock-in-rio-tickets
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o projeto:**
```bash
npm start
```

4. **Acesse no navegador:**
```
http://localhost:3000
```

## 📦 Estrutura do Projeto

```
rock-in-rio-tickets/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx                # Componente principal
│   ├── App.css               # Estilos globais
│   ├── index.tsx             # Entrada da aplicação
│   └── react-app-env.d.ts    # Tipos TypeScript
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## 🎨 Features de Design

- **Tela de Boas-Vindas**: Apresentação profissional do evento
- **Background Animado**: Efeitos de blur em movimento
- **Cards Interativos**: Hover effects e transições suaves
- **Sistema de Cores Vibrante**: Pink, purple e cyan
- **Micro-animações**: Bounce, pulse e slide effects
- **Dark Mode**: Design escuro moderno

## 📱 Fluxo do Usuário

1. **Welcome Screen** → Apresentação do evento
2. **Queue System** → Fila de espera (2-10 segundos)
3. **Day Selection** → Escolha do dia e line-up
4. **Payment Form** → Preenchimento com validação
5. **Ticket Generated** → Ingresso digital gerado
6. **Print/Reset** → Imprimir ou fazer nova compra

## 🔒 Validações Implementadas

- Nome completo obrigatório
- CPF com formatação automática (000.000.000-00)
- Email com validação de padrão
- Número do cartão (mínimo 16 dígitos com formatação)
- CVV (3 dígitos)
- Data de validade obrigatória

## ⚠️ Importante

Este é um projeto educacional/demonstrativo. Todas as transações são simuladas e nenhum dado real é processado ou armazenado.

## 🎯 Objetivo do Projeto

Demonstrar competências em:
- Arquitetura de aplicações React
- TypeScript e tipagem estática
- Gerenciamento complexo de estado
- Design de interfaces modernas
- UX/UI design
- Validações e tratamento de erros
- Clean code e boas práticas

## 📝 Licença

Este projeto está sob a licença MIT.

## 👩‍💻 Desenvolvedor

**[Isabela Neves]**

- 💼 LinkedIn: [https://www.linkedin.com/in/isabela-neves-analista/]
- 🐙 GitHub: [@bela-isa](https://github.com/bela-isa)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

## 🚀 Deploy

Este projeto pode ser facilmente implantado em:
- [Vercel](https://vercel.com) (recomendado)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

---

Desenvolvido com ❤️ e muita música! 🎸
