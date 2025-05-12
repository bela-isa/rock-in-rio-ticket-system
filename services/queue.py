fila = []
ingressos_disponiveis = 5  # Número limitado de ingressos

def entrar_na_fila(nome):
    if nome not in fila:
        fila.append(nome)
    return fila[0] == nome  # Retorna True se for o primeiro da fila

def liberar_proximo():
    if fila:
        fila.pop(0)