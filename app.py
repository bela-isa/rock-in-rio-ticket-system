import streamlit as st
import os
from services.queue import entrar_na_fila, liberar_proximo, ingressos_disponiveis
from services.reservation import reservar_ingresso, reserva_valida, finalizar_reserva
from services.payment import processar_pagamento
import logging
from datetime import datetime

# Configuração do diretório de logs
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
logging.basicConfig(
    filename=os.path.join(log_dir, 'system.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Configuração da página Streamlit
st.set_page_config(
    page_title="Rock in Rio - Ingressos",
    page_icon="🎫",
    layout="centered"
)

st.title("🎫 Sistema de Ingressos - Rock in Rio")

lineup = {
    "21/09/2025": ["Banda Eclipse", "DJ Nova Era", "The Firelights"],
    "22/09/2025": ["Luna Vox", "Graviton", "Som do Sul"],
    "23/09/2025": ["Os Incandescentes", "Zeta Roots", "Fênix Urbana"],
    "24/09/2025": ["Astral Pop", "Rockarmada", "Visão Noturna"],
    "25/09/2025": ["Tribo do Som", "Eletrônica Livre", "Nova Cena"]
}

# Inicialização de estado
for key in ["reserva_ativa", "pagamento_concluido", "usuario_nome", "data_ingresso", "entrou_na_fila"]:
    if key not in st.session_state:
        st.session_state[key] = "" if key == "usuario_nome" else False if key in ["pagamento_concluido", "entrou_na_fila"] else None

# Função de reset total
def resetar_sistema():
    st.session_state["usuario_nome"] = ""
    st.session_state["data_ingresso"] = None
    st.session_state["reserva_ativa"] = None
    st.session_state["pagamento_concluido"] = False
    st.session_state["entrou_na_fila"] = False
    st.rerun()
    return

# Entrada de nome
st.markdown("ℹ️ *Digite seu nome e pressione Enter para aparecer o botão de fila.*")
nome = st.text_input("Digite seu nome para entrar na fila", value=st.session_state["usuario_nome"])

if nome:
    st.session_state["usuario_nome"] = nome

    if not st.session_state["pagamento_concluido"] and st.button("Entrar na fila"):
        if ingressos_disponiveis <= 0:
            st.error("Ingressos esgotados.")
        else:
            if entrar_na_fila(nome):
                st.session_state["entrou_na_fila"] = True
                logging.info(f"{nome} é o próximo da fila.")
                st.success("É sua vez! Ingresso reservado por 10 minutos.")
                if reservar_ingresso(nome, tempo=600):
                    st.warning("Finalize o pagamento antes da reserva expirar.")
                    st.session_state["reserva_ativa"] = nome
            else:
                st.info("Aguardando sua vez na fila...")

# Escolha de data e pagamento
if st.session_state.get("entrou_na_fila") and not st.session_state["pagamento_concluido"]:
    data_escolhida = st.selectbox("Escolha o dia do evento", list(lineup.keys()))
    st.session_state["data_ingresso"] = data_escolhida

    if data_escolhida:
        st.markdown("🎶 **Line-up do dia:**")
        for artista in lineup[data_escolhida]:
            st.markdown(f"- {artista}")

    st.subheader("💳 Informações de Pagamento (fictícias)")
    st.markdown("**Estas informações são apenas para fins de apresentação visual.**")
    with st.container():
        st.text_input("Número do Cartão", value="4111 1111 1111 1111", disabled=True)
        st.text_input("Nome no Cartão", value=nome.upper(), disabled=True)
        st.text_input("Validade", value="12/29", disabled=True)
        st.text_input("CVV", value="123", disabled=True)

    if not st.session_state["pagamento_concluido"] and st.button("Pagar"):
        if reserva_valida(nome):
            logging.info(f"{nome} concluiu o pagamento.")
            liberar_proximo()
            finalizar_reserva(nome)
            st.success("🎉 Compra finalizada com sucesso!")
            st.session_state["reserva_ativa"] = None
            st.session_state["pagamento_concluido"] = True
            st.rerun()
        else:
            liberar_proximo()
            st.error("Tempo de reserva expirado.")
            st.session_state["reserva_ativa"] = None
            st.rerun()

# Ingresso final
if st.session_state.get("pagamento_concluido") and st.session_state.get("usuario_nome"):
    nome = st.session_state["usuario_nome"]
    data = st.session_state.get("data_ingresso")
    artistas = lineup[data]
    codigo = f"#{datetime.now().strftime('%H%M%S')}{nome[:3].upper()}"

    st.subheader("📄 Informações do Ingresso")

    ingresso_texto = f"""Evento: Rock in Rio
Nome: {nome}
Data: {data}
Horário: 18:00
Local: Parque Olímpico - RJ
Line-up: {', '.join(artistas)}
Código: {codigo}"""

    st.text(ingresso_texto)
    st.download_button("📄 Imprimir ingresso (simulação)", ingresso_texto, file_name="ingresso_RockInRio.txt")

# Mostra botão "Finalizar" só após pagamento
if st.session_state.get("pagamento_concluido"):
    if st.button("Finalizar"):
        resetar_sistema()

