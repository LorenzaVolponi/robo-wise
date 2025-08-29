# Gerenciamento de Sessão de Avaliação de Risco

Este documento descreve como a avaliação de risco persiste e recupera o progresso do usuário.

## Persistência
- O progresso e as respostas são salvos em `localStorage` sob a chave `risk-assessment-state`.
- Um log de interações é mantido em `localStorage` na chave `risk-assessment-log` com timestamps e ações executadas.
- A sessão é restaurada automaticamente ao recarregar a página.

## Onboarding
- O passo atual, perfil calculado e status de conclusão são mantidos em `localStorage` com a chave `onboarding-state`.
- A função `resetOnboarding` limpa esse estado e permite reiniciar o fluxo do começo.

## Funções Disponíveis
- **answerQuestion**: registra a resposta do usuário e atualiza o log.
- **nextQuestion / previousQuestion**: navega entre as etapas e grava a ação no log.
- **resetSession**: limpa o progresso e o log, permitindo iniciar uma nova sessão.

## Acessibilidade
- Indicadores de progresso utilizam `role="status"` e `aria-live="polite"` para informar leitores de tela.

Este fluxo garante que o usuário possa retomar a avaliação de risco de onde parou e fornece traços mínimos para auditoria e suporte.
