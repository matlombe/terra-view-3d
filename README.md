# Terra 3D Live — PWA

## O que está incluído
- Globo terrestre 3D interactivo, rotação, zoom, atmosfera e marcadores de cidades moçambicanas.
- Meteorologia actual para Maputo via Open-Meteo (temperatura, sensação térmica, humidade, vento, precipitação e código de tempo).
- Lista de eventos naturais globais activos consultados no feed NASA EONET.
- Relógio UTC, interface adaptável a telemóvel e computador.
- Manifesto PWA e service worker para instalação e cache dos ficheiros principais.

## Distinção fundamental: tempo real vs. imagens
**Não é uma transmissão de satélite ao vivo.** A textura azul da Terra, o relevo e o céu são imagens estáticas descarregadas de um CDN. O relógio UTC actualiza-se localmente a cada segundo. A meteorologia é obtida online da API Open-Meteo e volta a ser consultada a cada 10 minutos; a frequência e latência real dependem do fornecedor. Os eventos ambientais vêm da API NASA EONET e são consultados a cada 30 minutos; não são necessariamente alertas oficiais nem exclusivos de Moçambique.

Esta versão **não inclui** imagens de nuvens de satélite em directo, fogo activo em tempo real, rastreio de satélites artificiais, nem alertas oficiais nacionais. Essas funções exigem fontes dedicadas, com cobertura, frequência, limites e eventualmente chaves/API específicas.

## Testar no computador
É necessário Python 3 instalado.
1. Extraia o ZIP.
2. Abra a linha de comandos/Terminal dentro da pasta `Terra3D_Live_Final`.
3. Execute: `python -m http.server 8000`
4. Abra `http://localhost:8000` no navegador.

Não abra apenas `index.html` por duplo clique: service workers e algumas funcionalidades PWA exigem HTTP/HTTPS.

## Publicar gratuitamente com GitHub Pages
1. Crie ou entre na sua conta GitHub.
2. Crie um repositório público, por exemplo `terra-3d-live`.
3. Carregue todos os ficheiros desta pasta para a raiz do repositório (não carregue apenas o ZIP).
4. Em **Settings → Pages**, escolha **Deploy from a branch**, seleccione `main` e `/ (root)`, e guarde.
5. Aguarde a publicação e abra o endereço HTTPS que o GitHub mostrar.

Alternativa: Netlify — crie um site novo e carregue a pasta extraída (ou ligue o repositório GitHub). Use sempre HTTPS.

## Instalar no Android
1. Abra o endereço HTTPS publicado no Chrome.
2. Aguarde o carregamento inicial com internet.
3. Abra o menu ⋮ do Chrome e escolha **Instalar aplicação** ou **Adicionar ao ecrã inicial**.
4. Confirme. O ícone Terra 3D Live aparecerá no ecrã inicial.
5. Abra a aplicação a partir do ícone.

## Funcionamento offline: o que esperar
O service worker guarda os ficheiros principais da aplicação depois de a abrir online. Porém, o globo depende de bibliotecas e imagens de terceiros e os painéis de meteorologia/eventos dependem de APIs online. Sem internet, pode abrir a estrutura básica, mas não há actualização de dados e algumas partes visuais podem falhar. Para offline mais completo seria preciso alojar localmente as bibliotecas/texturas e desenhar uma estratégia de cache para os dados.

## Fontes de dados
- Globo e texturas: `globe.gl` / `three-globe` examples, carregados de CDN.
- Meteorologia: Open-Meteo API, coordenadas de Maputo (-25.9692, 32.5732), fuso Africa/Maputo.
- Eventos naturais: NASA EONET API v3, feed global de eventos abertos.

## Segurança e privacidade
A aplicação não pede conta nem envia a localização do utilizador automaticamente. A versão inicial apenas mostra Maputo e cidades pré-definidas; a geolocalização do utilizador não está activa nesta edição.
