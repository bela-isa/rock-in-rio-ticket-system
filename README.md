# 🎫 Sistema de Ingressos - Rock in Rio

Este projeto simula a venda de ingressos para um evento de alto tráfego, como o Rock in Rio. Foi desenvolvido como parte de um desafio técnico, com foco em arquitetura de software, controle de fluxo de usuários, reserva temporária e visualização de logs.

## 🧩 Funcionalidades

- ✅ Entrada em fila controlada  
- ✅ Reserva temporária do ingresso (10 minutos)  
- ✅ Escolha do dia do evento  
- ✅ Line-up personalizado por data  
- ✅ Simulação de pagamento com informações fictícias  
- ✅ Geração de ingresso fictício com botão para impressão  
- ✅ Sistema de logs com registro de ações  
- ✅ Botão "Finalizar" que reinicia a aplicação

## 🖥️ Tecnologias utilizadas

- Python 3.11+
- [Streamlit](https://streamlit.io/)
- Módulos personalizados para fila, pagamento e reserva
- Logging

## 🚀 Como executar

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o app:
```bash
streamlit run app.py
```

## 📸 Demonstração

![Demonstração da interface](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Ticket_icon.png/480px-Ticket_icon.png)

## 🗂️ Estrutura do projeto

```
├── app.py                  # Interface principal (Streamlit)
├── services/
│   ├── queue.py            # Controle de fila
│   ├── reservation.py      # Reserva temporária
│   └── payment.py          # Simulação de pagamento
├── logs/
│   └── system.log          # Arquivo de logs
└── README.md
```

## 📄 Observações

- O sistema permite apenas 1 ingresso por vez.
- As informações de pagamento são meramente ilustrativas.
- Toda a interação é registrada em logs no diretório `/logs`.

---

Desenvolvido por Isabela ✨