# Painel de Atendimento - PROCON Itumbiara

Sistema de painel de TV para exibição de chamadas de atendimento em tempo real no PROCON Itumbiara. A aplicação exibe informações sobre clientes chamados, incluindo nome e guichê, com suporte a notificações sonoras e síntese de voz.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Conectar](#como-conectar)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Este é um painel de TV desenvolvido para exibir chamadas de atendimento em tempo real. O sistema recebe informações via WebSocket de um servidor de chamadas e as exibe em uma interface otimizada para telas grandes, com notificações sonoras e síntese de voz para anunciar as chamadas.

## ✨ Funcionalidades

### Principais

- **Exibição de Chamadas em Tempo Real**: Recebe e exibe chamadas através de WebSocket
- **Notificações Sonoras**: Toca alertas sonoros (três tons ascendentes) quando uma nova chamada é recebida
- **Síntese de Voz**: Anuncia automaticamente o nome do cliente e o guichê usando a Web Speech API
- **Histórico de Chamadas**: Mantém um registro das últimas 5 chamadas exibidas no painel lateral
- **Relógio em Tempo Real**: Exibe data e hora atualizadas a cada segundo
- **Layout Responsivo**: Interface otimizada para telas grandes (TVs)
- **Reconexão Automática**: Tenta reconectar automaticamente ao WebSocket em caso de desconexão
- **Suporte a Tizen TV**: Compatível com TVs Samsung Tizen (fecha com tecla RETURN)

### Interface

- **Painel Principal**: Exibe o nome do cliente e o guichê em destaque
- **Painel Lateral**: Contém o logo do PROCON, histórico de últimas chamadas e relógio
- **Rodapé**: Mensagem em marquee (texto rolante) com informações para os atendidos

## 📦 Requisitos

- **Node.js**: Versão 12 ou superior
- **Navegador Moderno**: Suporte a WebSocket e Web Speech API
- **Servidor WebSocket**: Servidor de chamadas configurado e rodando

## 🚀 Instalação

1. **Clone ou baixe o repositório**

2. **Instale as dependências** (se necessário):
```bash
npm install
```

**Nota**: O servidor atual (`server.js`) utiliza apenas módulos nativos do Node.js e não requer dependências externas. As dependências listadas no `package.json` podem ser para uso futuro ou outros componentes.

## ⚙️ Configuração

### Configuração do Servidor WebSocket

O painel se conecta a um servidor WebSocket que deve estar configurado para enviar mensagens no formato:

```json
{
  "type": "chamada-cliente",
  "data": {
    "nome": "Nome do Cliente",
    "guiche": "Guichê 01",
    "chamadoEm": "2024-01-01T12:00:00.000Z"
  }
}
```

Ou como array de múltiplas chamadas:

```json
{
  "type": "chamada-cliente",
  "data": [
    {
      "nome": "Cliente 1",
      "guiche": "Guichê 01",
      "chamadoEm": "2024-01-01T12:00:00.000Z"
    },
    {
      "nome": "Cliente 2",
      "guiche": "Guichê 02",
      "chamadoEm": "2024-01-01T11:55:00.000Z"
    }
  ]
}
```

### Variáveis de Ambiente

O servidor suporta configuração via variáveis de ambiente:

- `WS_HOST`: Endereço do servidor WebSocket (padrão: `localhost`)
- `WS_PORT`: Porta do servidor WebSocket (padrão: `8080`)

**Exemplo de uso**:

```bash
# Windows (PowerShell)
$env:WS_HOST="192.168.1.100"; $env:WS_PORT="8080"; node server.js

# Windows (CMD)
set WS_HOST=192.168.1.100
set WS_PORT=8080
node server.js

# Linux/Mac
WS_HOST=192.168.1.100 WS_PORT=8080 node server.js
```

## 🔌 Como Conectar

### 1. Iniciar o Servidor HTTP

Execute o servidor que irá servir os arquivos do painel:

```bash
node server.js
```

O servidor irá:
- Iniciar na porta **3002**
- Exibir o endereço local e IP da rede
- Mostrar as configurações do WebSocket

**Saída esperada**:
```
Servidor rodando em http://localhost:3002
Acesse também via IP: http://192.168.1.50:3002
WebSocket configurado: ws://localhost:8080
Para alterar: WS_HOST=localhost WS_PORT=8080
```

### 2. Acessar o Painel

Abra um navegador e acesse:

- **Local**: `http://localhost:3002`
- **Rede**: `http://[IP-DA-MAQUINA]:3002` (use o IP exibido no console)

### 3. Conectar ao Servidor WebSocket

O painel tentará conectar automaticamente ao WebSocket usando as configurações definidas. Ao conectar, ele se identifica como um painel:

```javascript
{
  type: "identify",
  clientType: "panel"
}
```

### 4. Configurar o Servidor de Chamadas

Certifique-se de que o servidor WebSocket está configurado para:

1. **Aceitar conexões** na porta configurada (padrão: 8080)
2. **Enviar mensagens** no formato JSON descrito acima
3. **Identificar clientes** do tipo "panel" para enviar as chamadas corretas

### Exemplo de Conexão

```
┌─────────────────┐         WebSocket        ┌──────────────────┐
│  Painel TV      │ <──────────────────────> │ Servidor de      │
│  (Porta 3002)   │    ws://host:8080        │ Chamadas         │
│                 │                           │ (Porta 8080)     │
└─────────────────┘                           └──────────────────┘
```

## 💻 Uso

### Iniciando o Sistema

1. **Configure as variáveis de ambiente** (se necessário):
   ```bash
   WS_HOST=192.168.1.100 WS_PORT=8080 node server.js
   ```

2. **Inicie o servidor**:
   ```bash
   node server.js
   ```

3. **Acesse o painel** no navegador ou TV:
   - Abra o navegador em modo tela cheia (F11)
   - Acesse `http://[IP]:3002`

4. **Verifique a conexão WebSocket**:
   - Abra o console do navegador (F12)
   - Deve aparecer: "Conectado ao servidor WebSocket!"

### Recebendo Chamadas

Quando o servidor WebSocket envia uma chamada:

1. O painel principal exibe o nome e guichê
2. Um beep é tocado (três tons ascendentes)
3. A síntese de voz anuncia: "[Nome], [Guichê]"
4. A chamada é adicionada ao histórico lateral

### Recursos Interativos

- **Tecla RETURN** (Tizen TV): Fecha o aplicativo em TVs Samsung Tizen
- **Reconexão Automática**: Se o WebSocket desconectar, o painel tenta reconectar após 3 segundos

## 📁 Estrutura do Projeto

```
service-panel-tv/
├── server.js              # Servidor HTTP que serve os arquivos estáticos
├── app/
│   ├── index.html        # Estrutura HTML do painel
│   ├── script.js         # Lógica JavaScript (WebSocket, exibição, voz)
│   ├── style.css         # Estilos CSS da interface
│   ├── Logo.svg          # Logo do PROCON
│   └── package.json      # Configurações npm (opcional)
└── README.md             # Este arquivo
```

## 🏗️ Arquitetura

### Fluxo de Dados

```
Servidor de Chamadas
       ↓
   WebSocket (ws://host:port)
       ↓
  script.js (onmessage)
       ↓
  Atualização da UI
       ↓
  Notificação Sonora + Voz
```

### Componentes Principais

1. **server.js**: Servidor HTTP simples que:
   - Serve arquivos estáticos da pasta `app`
   - Injeta configurações do WebSocket no HTML
   - Detecta e exibe IPs da rede local

2. **script.js**: Lógica do cliente:
   - Conexão e gerenciamento de WebSocket
   - Processamento de mensagens de chamadas
   - Atualização da interface
   - Síntese de voz e notificações sonoras
   - Gerenciamento do relógio

3. **index.html**: Estrutura da interface:
   - Painel principal (nome e guichê)
   - Painel lateral (logo, histórico, relógio)
   - Rodapé com marquee

4. **style.css**: Estilização completa:
   - Layout responsivo para TV
   - Cores e tipografia do PROCON
   - Animações (marquee)

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|---------|
| `WS_HOST` | Endereço IP ou hostname do servidor WebSocket | `localhost` | `192.168.1.100` |
| `WS_PORT` | Porta do servidor WebSocket | `8080` | `3000` |

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. WebSocket não conecta

**Sintoma**: Console mostra "Erro na conexão WebSocket"

**Soluções**:
- Verifique se o servidor WebSocket está rodando
- Confirme o host e porta corretos (variáveis de ambiente)
- Verifique firewall/antivírus bloqueando conexões
- Teste a conectividade: `telnet [WS_HOST] [WS_PORT]`

#### 2. Chamadas não aparecem

**Sintoma**: Painel conecta mas não exibe chamadas

**Soluções**:
- Verifique o formato das mensagens JSON no servidor
- Confirme que o tipo da mensagem é `"chamada-cliente"`
- Abra o console (F12) e verifique erros
- Verifique se os campos `nome` e `guiche` estão presentes

#### 3. Voz não funciona

**Sintoma**: Beep toca mas não há anúncio de voz

**Soluções**:
- Verifique se o navegador suporta Web Speech API
- Teste em Chrome/Edge (melhor suporte)
- Verifique permissões de áudio do navegador
- Confirme que há vozes pt-BR instaladas no sistema

#### 4. IP não aparece no console

**Sintoma**: Apenas "localhost" aparece

**Soluções**:
- Verifique se há conexão de rede ativa
- Confirme que há interfaces de rede configuradas
- Use o IP manualmente se necessário

#### 5. Painel não carrega

**Sintoma**: Erro 404 ou página em branco

**Soluções**:
- Verifique se está executando `node server.js` na pasta raiz
- Confirme que a pasta `app/` existe com os arquivos
- Verifique permissões de leitura dos arquivos
- Confirme que a porta 3002 não está em uso

### Logs e Debug

Para depuração, abra o console do navegador (F12) e verifique:

- Mensagens de conexão WebSocket
- Dados recebidos do servidor
- Erros de JavaScript
- Status da conexão

## 📝 Notas Adicionais

- O painel é otimizado para telas grandes (TVs)
- Recomenda-se usar navegadores modernos (Chrome, Edge, Firefox)
- Para TVs Tizen, é possível empacotar como aplicativo nativo
- O sistema suporta múltiplos painéis conectados simultaneamente
- As chamadas são exibidas em ordem de recebimento (mais recente primeiro)

## 📄 Licença

Este projeto foi desenvolvido para o PROCON Itumbiara.

---

**Desenvolvido para PROCON Itumbiara** 🏛️

