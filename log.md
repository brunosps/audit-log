# Abordagens para registro log

1. Soluções baseadas em callbacks
    - Prós:
        - Fácil de começar.
        - Personalização disponível.
    - Contras:
        - Confiabilidade e precisão limitadas.
        - Desempenho impactado (aumento de consultas no banco de dados).
        - Problemas de escalabilidade com tabelas de auditoria grandes.

2. Soluções baseadas em triggers
    - Prós:
        - Melhor desempenho.
    - Contras:
        - Não rastreia exclusões.
        - Estrutura de dados complexa e difícil de consultar.
        - Maior complexidade na implementação e manutenção.

3. Soluções baseadas em log de replicação
    - Prós:
        - Alta confiabilidade e precisão.
        - Baixo impacto no desempenho.
    - Contras:
        - Complexidade na infraestrutura.
        - Problemas de escalabilidade.

4. Rastreamento manual
    - Prós:
        - Versatilidade para eventos customizados.
    - Contras:
        - Trabalho manual e aumento da complexidade do código.
        - Flexibilidade limitada para registrar todas as atividades do sistema.

5. Registro personalizado
    - Prós:
        - Alta flexibilidade.
    - Contras:
        - Consumo e gerenciamento de logs de texto não estruturados pode ser desafiador.