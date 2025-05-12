import random
import logging

def processar_pagamento(nome):
    sucesso = random.random() > 0.1  # 90% de chance de sucesso
    if sucesso:
        logging.info(f"{nome} concluiu o pagamento.")
        return True
    else:
        logging.error(f"Pagamento de {nome} falhou.")
        return False