import re

tonicasSus = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
tonicasBem = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']


def transpoe_cola(tonicasSus, tonicasBem):
    semitons = int(input('Semitons: '))

    cola = []

    linha = input('\nCola original:\n\n')
    cola.append(linha)
    while linha != '.':
        linha = input()
        cola.append(linha)

    nova_cola = []

    bemol = False

    for linha in cola:
        notas = re.split('[\ \[\(]', linha)
        nova_linha = ''
        for nota in notas:
            tonica = nota[0:2]
            nova_nota = nota
            if tonica in tonicasSus or tonica in tonicasBem:
                if tonica in tonicasSus:
                    indice = (tonicasSus.index(tonica) + semitons) % len(tonicasSus)
                    nova_nota = tonicasSus[indice] + nota[2:]
                else:
                    indice = (tonicasBem.index(tonica) + semitons) % len(tonicasBem)
                    nova_nota = tonicasBem[indice] + nota[2:]
                    bemol = True
            else:
                tonica = nota[0:1]
                if tonica in tonicasSus:
                    if not bemol:
                        indice = (tonicasSus.index(tonica) + semitons) % len(tonicasSus)
                        nova_nota = tonicasSus[indice] + nota[1:]
                    else:
                        indice = (tonicasBem.index(tonica) + semitons) % len(tonicasBem)
                        nova_nota = tonicasBem[indice] + nota[1:]
            nova_linha = nova_linha + nova_nota + ' '
        nova_cola.append(nova_linha)

    print('\nNova cola:\n')
    for i in nova_cola:
        print(i)
    print()


while True:
    transpoe_cola(tonicasSus, tonicasBem)
