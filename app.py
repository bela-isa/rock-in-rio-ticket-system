import streamlit as st
from services.queue import entrar_na_fila, liberar_proximo, ingressos_disponiveis
from services.reservation import reservar_ingresso, reserva_valida, finalizar_reserva
from services.payment import processar_pagamento
import logging
from datetime import datetime
import streamlit.runtime.scriptrunner.script_run_context as script_context

# Log
logging.basicConfig(filename='logs/system.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

st.title("🎫 Sistema de Ingressos - Rock in Rio")

lineup = {
    "21/09/2025": ["Banda Eclipse", "DJ Nova Era", "The Firelights"],
    "22/09/2025": ["Luna Vox", "Graviton", "Som do Sul"],
    "23/09/2025": ["Os Incandescentes", "Zeta Roots", "Fênix Urbana"],
    "24/09/2025": ["Astral Pop", "Rockarmada", "Visão Noturna"],
    "25/09/2025": ["Tribo do Som", "Eletrônica Livre", "Nova Cena"]
}

for key in ["reserva_ativa", "pagamento_concluido", "usuario_nome", "data_ingresso", "entrou_na_fila"]:
    if key not in st.session_state:
        st.session_state[key] = "" if key == "usuario_nome" else False if key in ["pagamento_concluido", "entrou_na_fila"] else None

def resetar_sistema():
    st.session_state["usuario_nome"] = ""
    st.session_state["data_ingresso"] = None
    st.session_state["reserva_ativa"] = None
    st.session_state["pagamento_concluido"] = False
    st.session_state["entrou_na_fila"] = False
    if script_context.get_script_run_ctx():
        st.experimental_rerun()
    return

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
            if script_context.get_script_run_ctx():
                st.experimental_rerun()
        else:
            liberar_proximo()
            st.error("Tempo de reserva expirado.")
            st.session_state["reserva_ativa"] = None
            if script_context.get_script_run_ctx():
                st.experimental_rerun()

if st.session_state.get("pagamento_concluido") and st.session_state.get("usuario_nome"):
    nome = st.session_state["usuario_nome"]
    data = st.session_state.get("data_ingresso")
    artistas = lineup[data]
    codigo = f"#{datetime.now().strftime('%H%M%S')}{nome[:3].upper()}"

    st.subheader("📄 Informações do Ingresso")
    st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Ticket_icon.png/480px-Ticket_icon.png", width=200)

    ingresso_texto = f'''Evento: Rock in Rio
Nome: {nome}
Data: {data}
Horário: 18:00
Local: Parque Olímpico - RJ
Line-up: {', '.join(artistas)}
Código: {codigo}'''

    st.text(ingresso_texto)
    st.download_button("📄 Imprimir ingresso (simulação)", ingresso_texto, file_name="ingresso_RockInRio.txt")

if st.session_state.get("pagamento_concluido"):
    if st.button("Finalizar"):
        resetar_sistema()
