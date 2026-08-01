#The Tennis String Manager

**Alex Pretti Tennis — Qualidade · Precisão · Performance**

PWA para controle completo de encordoamento de raquetes de tênis: jogadores,
raquetes, cordas, tensões, avaliações, estoque e lucratividade.

## O diferencial: Prontuário da Raquete

- 📈 Gráfico de evolução da tensão ao longo do tempo
- 🎾 Histórico de todas as cordas usadas na raquete
- 📊 Radar de desempenho (controle, potência, spin, conforto, durabilidade) avaliado pelo jogador
- 🧠 Sugestão inteligente da próxima tensão com base no histórico e nas avaliações
- 📱 QR Code para colar na raquete — escaneou, abriu o prontuário
- 🏆 Perfil do jogador (nível, estilo, frequência, quadra, bola)
- 🧵 Custo automático por serviço (custo do rolo ÷ metragem × metros usados)
- 📦 Estoque com baixa automática de metros e alerta de fim de rolo
- ⏰ Alerta de troca: a cada 3–4 meses ou 15–20 h de jogo (ajustado pela frequência do jogador)
- 🔬 Banco de cordas real da **TWU** (Tennis Warehouse University): ~750 cordas com rigidez,
  perda de tensão, retorno de energia e potencial de spin medidos em laboratório
- ⭐ Marcação das cordas que você oferece — viram atalho no formulário e tabela comparativa nos PDFs
- 📄 Exportação em **PDF** para enviar ao cliente (WhatsApp/e-mail): prontuário completo (A4)
  e comprovante do serviço (A5), com a marca, os dados TWU e a recomendação de troca

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No celular (mesma rede Wi-Fi), use o IP da máquina
(ex.: `http://192.168.x.x:3000`) e instale como app:
**iPhone** Safari → Compartilhar → Adicionar à Tela de Início ·
**Android** Chrome → ⋮ → Instalar aplicativo.

## Arquitetura

- **Next.js 15 (App Router) + Tailwind 4 + Recharts + qrcode.react + @react-pdf/renderer**
- **Local-first**: dados em `localStorage` via `src/lib/store.ts` (funciona 100% offline;
  backup por exportar/importar JSON em Configurações)
- **Supabase pronto**: schema completo com RLS em `supabase/schema.sql` — para sincronizar
  na nuvem/multiusuário, basta criar o projeto no Supabase e trocar a camada `store.ts`
- `src/lib/twu-data.ts` — banco de cordas extraído da
  [TWU String Performance Database](https://twu.tennis-warehouse.com/learning_center/reporter2.php)
  na condição de referência (51 lbs, swing médio), com busca por nome/material
- `src/lib/logic.ts` — sugestão de tensão, alertas de troca e estatísticas.
  A sugestão cruza as avaliações do jogador com os dados TWU da corda
  (ex.: desconforto + rigidez > 220 lb/pol → recomenda corda mais macia)
- `src/lib/pdf.tsx` — geração dos PDFs; usa a Web Share API no celular
  (abre o menu de compartilhar direto no WhatsApp) e cai para download no desktop

## Deploy

Repositório: [github.com/gstirma/strung](https://github.com/gstirma/strung) (privado).

Hospedado na **Vercel**, conectada a este repositório — todo `git push` na `main`
publica a nova versão automaticamente. O Next.js é detectado sozinho, sem nenhuma
configuração (nada de `vercel.json`, variáveis de ambiente ou build command).

Para publicar uma alteração:

```bash
git add -A && git commit -m "descrição" && git push
```

> **Atenção aos QR Codes:** eles são gerados a partir da URL em que o app está aberto.
> Defina a URL definitiva (ou um domínio próprio) **antes** de imprimir e colar os QR
> nas raquetes — se a URL mudar depois, os códigos já colados param de abrir o prontuário.

> **Dados por dispositivo:** como tudo fica no `localStorage`, cada aparelho/URL tem sua
> própria base. Ao migrar de `localhost` para a URL publicada, use
> Configurações → Exportar/Importar para levar os dados.
