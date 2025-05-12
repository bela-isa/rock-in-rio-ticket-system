import time
import logging

reservas = {}

def reservar_ingresso(nome, tempo=30):
    if nome in reservas:
        return False  # já tem reserva
    logging.info(f"{nome} iniciou uma reserva válida por {tempo}s.")
    reservas[nome] = time.time() + tempo
    return True

def reserva_valida(nome):
    expira_em = reservas.get(nome)
    if not expira_em:
        return False
    if time.time() > expira_em:
        del reservas[nome]
        logging.warning(f"Reserva de {nome} expirou.")
        return False
    return True

def finalizar_reserva(nome):
    reservas.pop(nome, None)