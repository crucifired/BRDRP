const { SlashCommandBuilder } = require('discord.js');

// Роли, которые не должны показываться (в нижнем регистре)
const EXCLUDED = [
  'verbal warning', 'warning 1', 'warning 2', 'warning 3',
  'strike 1', 'strike 2', 'strike 3', 'terminated', 'blacklist'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff-promotion')
    .setDescription('Показать роли для повышения персонала (скрывает warning/strike/terminated/blacklist и роли с префиксом ⚠️)'),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'Эта команда доступна только на сервере.', ephemeral: true });
    }

    try {
      // Берём все роли сервера, исключаем управлямые роли и @everyone
      const roles = interaction.guild.roles.cache
        .filter(r => !r.managed && r.id !== interaction.guild.id);

      // Фильтруем исключённые по имени (без учёта регистра) и роли, начинающиеся с ⚠ (эмодзи предупреждения)
      const filtered = roles.filter(r => {
        const raw = (r.name || '').trim();
        const name = raw.toLowerCase();

        // Исключаем точные совпадения по имени
        if (EXCLUDED.includes(name)) return false;

        // Исключаем роли, которые начинаются с символа предупреждения ⚠ или ⚠️ (с пробелом или без)
        // Регулярное выражение проверяет optional leading whitespace + warning sign
        if (/^\s*⚠/u.test(raw)) return false;

        return true;
      });

      // Сортируем по позиции (высшая сверху)
      const sorted = filtered.sort((a, b) => b.position - a.position);

      if (!sorted.size) {
        return interaction.reply({ content: 'Не найдено ролей для отображения.', ephemeral: true });
      }

      // Формируем текст — покажем имя и упоминание роли
      const lines = sorted.map(r => `**${r.name}** — <@&${r.id}>`);

      // Разбиваем на блоки по 2000 символов, если нужно
      const chunks = [];
      let cur = '';
      for (const line of lines) {
        if ((cur + '\n' + line).length > 1900) {
          chunks.push(cur);
          cur = line;
        } else {
          cur = cur ? cur + '\n' + line : line;
        }
      }
      if (cur) chunks.push(cur);

      // Отправляем первый ответ, потом followUp для остальных
      await interaction.reply({ content: chunks[0], ephemeral: false });
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i] });
      }

    } catch (err) {
      console.error('staff-promotion command error:', err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Произошла ошибка при выполнении команды.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Произошла ошибка при выполнении команды.', ephemeral: true });
      }
    }
  }
};
