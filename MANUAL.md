# Simulador de Propagação Wi-Fi — Manual de Operação

## 1. Introdução

Este simulador permite desenhar plantas baixas com obstáculos (paredes, pilares,
paletes, portas, vidros), posicionar pontos de acesso (APs) e visualizar um
**mapa de calor (heatmap)** da intensidade do sinal (RSSI) em uma área fixa de
**50 m × 50 m**.

O motor de propagação usa o modelo **log-distance** com perda de percurso no
espaço livre (FSPL) e atenuação por materiais, calculado em uma Web Worker
para não travar a interface.

---

## 2. Interface

```
┌──────┬─────────────────────────────────────┬────────────┐
│      │                                     │            │
│  BA- │          CANVAS (50 m × 50 m)       │  PAINEL    │
│  RRA │                                     │  DIREITO   │
│  DE  │    Grid 1 m / 5 m                   │            │
│  FER │    Réguas métricas                  │  Frequênc. │
│  RA- │    Imagem de fundo                  │  Heatmap   │
│  MEN │    APs + obstáculos                 │  Grid      │
│  TAS │    Heatmap (semi-transparente)      │  Resolução │
│      │                                     │  Plano     │
│      │                                     │  de fundo  │
├──────┴─────────────────────────────────────┴────────────┤
│  LEGENDA: dBm: ■ -40  ■ -50  ■ -60  ■ -70  ■ -80  ■ -90 │
└──────────────────────────────────────────────────────────┘
```

### 2.1 Barra de Ferramentas (esquerda)

| Ícone | Ferramenta | Atalho | Descrição |
|-------|-----------|--------|-----------|
| ⬚ | Selecionar | V | Mover APs; redimensionar/rotacionar imagem de fundo |
| ▤ | Parede Externa | W | Desenhar paredes (clique e arraste) |
| ▢ | Vidro | G | Desenhar divisórias de vidro |
| ⊓ | Porta | D | Desenhar portas |
| ▬ | Palete | R | Desenhar paletes/estantes (retângulo) |
| ○ | Coluna | C | Desenhar pilares (círculo) |
| ◎ | AP Omni | O | Posicionar AP omnidirecional (clique) |
| → | AP Direcional | X | Posicionar AP direcional (arraste para definir direção) |
| ✕ | Borracha | E | Remover AP ou estrutura (clique) |
| 💾 | Salvar | Ctrl+S | Exportar projeto `.wifisim` |
| 📂 | Carregar | Ctrl+O | Importar projeto `.wifisim` |
| 🗑 | Limpar | — | Limpar todo o projeto |
| 📡 | Sinal | H | Ligar/desligar o heatmap |

### 2.2 Painel de Configurações (direita)

- **Frequência**: 2.4 GHz ou 5 GHz
- **Heatmap**: liga/desliga a visualização do sinal
- **Grid**: liga/desliga as linhas de grade
- **Resolução**: qualidade do cálculo (100² rápido, 200² padrão, 400² preciso)
- **Plano de Fundo**:
  - `Selecionar Imagem...` — faz upload de uma planta baixa
  - `Remover Fundo` — remove a imagem

### 2.3 Canvas (centro)

- Área de desenho de **50 m × 50 m** com fundo branco
- **Grid**: linhas a cada 1 m (finas) e a cada 5 m (mais escuras)
- **Réguas métricas**: régua horizontal (inferior) e vertical (esquerda) fixas na tela
- **Imagem de fundo**: planta baixa carregada pelo usuário
- **Estruturas**: paredes, vidros, portas, paletes, colunas
- **APs**: pontos de acesso omnidirecionais ou direcionais
- **Heatmap**: mapa de calor semi-transparente sobreposto

### 2.4 Legenda (inferior)

```
dBm: ■ -40  ■ -50  ■ -60  ■ -70  ■ -80  ■ -90
      verm   laran  amar   verde  azul   cinza
      (forte)                      (fraco)
```

| Cor | Nível de sinal |
|-----|---------------|
| Vermelho | Sinal forte (–40 dBm ou mais) |
| Laranja | –50 dBm |
| Amarelo | –60 dBm |
| Verde | –70 dBm |
| Azul | –80 dBm |
| Cinza | Sinal fraco (–90 dBm ou menos) |

As cores fazem transição suave (degradê) entre cada faixa de 10 dBm.

---

## 3. Navegação no Canvas

### Pan (mover a vista)

1. Segure a tecla **Espaço**
2. O cursor muda para `⚟`
3. Arraste o mouse para mover o canvas
4. Solte Espaço para voltar ao modo normal

### Zoom

- Role o **scroll do mouse** para aumentar/diminuir o zoom
- O zoom é centrado na posição do mouse
- Limites: 0.1× a 10×
- O canvas é sempre limitado à área de 50 m × 50 m (não é possível ver fora)

---

## 4. Ferramentas de Desenho

### Paredes, Vidros, Portas

1. Selecione a ferramenta (atalhos: W, G, D)
2. Clique no ponto inicial
3. Arraste até o ponto final
4. Solte o mouse para criar a linha

### Paletes

1. Selecione a ferramenta (R)
2. Clique e arraste para definir o retângulo
3. O palete é criado com centro no ponto inicial

### Colunas

1. Selecione a ferramenta (C)
2. Clique para definir o centro
3. Arraste para definir o raio
4. A coluna é criada como um círculo

### Materiais e Atenuação

| Material | 2.4 GHz | 5 GHz |
|----------|---------|-------|
| Parede externa | 8 dB | 12 dB |
| Parede interna | 5 dB | 8 dB |
| Vidro | 3 dB | 5 dB |
| Porta | 4 dB | 6 dB |
| Palete | 2 dB | 3 dB |
| Coluna | 6 dB | 9 dB |

---

## 5. Pontos de Acesso (APs)

### AP Omnidirecional

1. Selecione a ferramenta (O)
2. Clique em qualquer lugar do canvas
3. O AP é criado com potência de 20 dBm

### AP Direcional

1. Selecione a ferramenta (X)
2. Clique no ponto de origem
3. Arraste na direção desejada
4. Solte para criar o AP com abertura de 60°

### Mover

1. Selecione a ferramenta **Selecionar** (V)
2. Clique e arraste o AP para a nova posição
3. A posição é salva automaticamente

### Remover

- Use a ferramenta **Borracha** (E) e clique sobre o AP

---

## 6. Imagem de Fundo

### Upload

1. No painel direito, clique em `Selecionar Imagem...`
2. Escolha uma imagem (planta baixa, foto, etc.)
3. A imagem é posicionada centralizada, mantendo a proporção, dentro dos 50 m × 50 m

### Ajustar (redimensionar, rotacionar, reposicionar)

Com a ferramenta **Selecionar** (V) ativa, clique sobre a imagem:

- **Arrastar pelo corpo** → reposiciona a imagem
- **Arrastar quadradinhos nos cantos/bordas** → redimensiona (Shift + arrasto mantém proporção)
- **Arrastar círculo no topo** → rotaciona a imagem
- **Clicar fora** → as alças desaparecem e a posição é salva

### Remover

- Clique em `Remover Fundo` no painel direito

---

## 7. Simulação

### Motor de Propagação

O cálculo do RSSI segue o modelo log-distance:

```
RSSI = TxPower + Ganho - PL(d₀) - 10·n·log₁₀(d) - A
```

Onde:
- **TxPower**: potência do AP (20 dBm)
- **Ganho**: ganho da antena (0 dB omni, +10 dB direcional na frente)
- **PL(d₀)**: perda no espaço livre a 1 m de referência
- **n**: expoente de perda de percurso (2.8 para 2.4 GHz, 3.2 para 5 GHz)
- **d**: distância em metros
- **A**: atenuação acumulada dos obstáculos no caminho

### Frequências

| Parâmetro | 2.4 GHz | 5 GHz |
|-----------|---------|-------|
| PL a 1 m | 40 dB | 46 dB |
| Expoente n | 2.8 | 3.2 |
| Alcance típico | Maior | Menor |

### Quando o cálculo é executado

O heatmap é recalculado automaticamente após 300 ms de inatividade quando:

- Um AP é adicionado, movido ou removido
- Uma estrutura é adicionada ou removida
- A frequência é alterada
- A resolução é alterada

### Resolução

| Resolução | Tempo | Precisão |
|-----------|-------|----------|
| 100 × 100 | Rápido | Menor |
| 200 × 200 | Médio (padrão) | Boa |
| 400 × 400 | Lento | Maior |

---

## 8. Arquivos

### Salvar (Ctrl+S)

Exporta o projeto completo (estruturas, APs, imagem de fundo, transformações,
frequência, grid) em formato `.wifisim` (JSON).

### Carregar (Ctrl+O)

Importa um arquivo `.wifisim` previamente salvo.

### Limpar Tudo

Remove todos os APs, estruturas e imagem de fundo, resetando o projeto.

---

## 9. Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| V | Ferramenta Selecionar |
| W | Ferramenta Parede |
| G | Ferramenta Vidro |
| D | Ferramenta Porta |
| R | Ferramenta Palete |
| C | Ferramenta Coluna |
| O | AP Omnidirecional |
| X | AP Direcional |
| E | Borracha |
| H | Liga/desliga heatmap |
| Espaço | Pan (segurar + arrastar) |
| Delete / Backspace | Remover selecionado |
| Ctrl + Z | Desfazer |
| Ctrl + Shift + Z | Refazer |
| Ctrl + Y | Refazer |
| Ctrl + S | Salvar |
| Ctrl + O | Carregar |
| Scroll | Zoom |

---

## 10. Dicas Rápidas

1. **Planta baixa**: carregue uma imagem e ajuste com as alças para alinhar com o grid de 1 m
2. **Escala**: as réguas mostram metros — 1 quadrado do grid = 1 m
3. **AP perto de parede**: o sinal atravessa a parede com atenuação; afaste o AP para melhor cobertura
4. **2.4 vs 5 GHz**: 2.4 GHz propaga mais longe; 5 GHz tem mais banda mas menos alcance
5. **Direcional**: aponte o AP direcional para a área que precisa de cobertura (ganho de +10 dB na frente)
6. **Desfazer**: uso intenso de Ctrl+Z para experimentar posições de APs
7. **Sinal desligado**: pressione H para ver a planta sem o heatmap sobreposto
