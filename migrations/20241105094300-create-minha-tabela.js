'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('minha_tabela', {
            com_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            com_id_lote: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: true,
            },
            // lin_status: {
            //     type: Sequelize.BLOB('tiny'), // Ajuste para dado binário de tamanho pequeno
            //     allowNull: false,
            // },
            pes_migrado: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            vou_cpf: {
                type: Sequelize.CHAR(14),
                allowNull: true,
            },
            data: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            dataInicio: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            dataFim: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            primeiraParcela: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            ultimaParcela: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            tipo: {
                type: Sequelize.ENUM('CONSORCIO', 'SEGURO'),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('ATIVO', 'INATIVO'),
                allowNull: false,
            },
            codigoUnidadeNegocio: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            contrato_informacoes: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            dados_anexo: {
                type: Sequelize.TEXT('medium'),
                allowNull: true,
            },
            men_status: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                defaultValue: 1,
            },
            payload: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            log_data_adicionado: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            men_data_adicionado: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            sincronizado: {
                type: Sequelize.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            nome: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('minha_tabela');
    }
};
