import { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CoreValue, Kudo } from 'domain/models';
import { SPACING, COLORS, BORDER_RADIUS, FONT_WEIGHT } from 'presentation/theme/designSystem';

interface CoreValuesChartProps {
  kudos: Kudo[];
  coreValues: CoreValue[];
}

export const CoreValuesChart = ({ kudos, coreValues }: CoreValuesChartProps) => {
  const chartData = useMemo(() => {
    const counts = new Map<string, number>();
    kudos.forEach((kudo) => {
      if (kudo.core_value_id) {
        counts.set(kudo.core_value_id, (counts.get(kudo.core_value_id) || 0) + 1);
      }
    });
    return coreValues.map((coreValue) => ({
      name: coreValue.name ?? '',
      emoji: coreValue.emoji ?? '',
      count: counts.get(coreValue.id!) || 0,
    }));
  }, [kudos, coreValues]);

  const mostPopular = useMemo(() => {
    const sorted = [...chartData].filter((d) => d.count > 0).sort((a, b) => b.count - a.count);
    return sorted[0];
  }, [chartData]);

  const totalWithValues = chartData.reduce((s, d) => s + d.count, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: SPACING.MEDIUM,
        borderRadius: BORDER_RADIUS.LG,
        border: `1px solid ${COLORS.GRAY[200]}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: SPACING.SMALL, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD }}>
          Core values
        </Typography>
        {mostPopular && mostPopular.count > 0 && (
          <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY }}>
            Top: {mostPopular.emoji} {mostPopular.name} ({mostPopular.count})
          </Typography>
        )}
      </Box>

      {totalWithValues === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY }}>
            No kudos with core values yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.GRAY[200]} vertical={false} />
              <XAxis
                dataKey="name"
                tickFormatter={(name, i) => (chartData[i]?.emoji ? `${chartData[i].emoji} ${name}` : name)}
                angle={-35}
                textAnchor="end"
                height={56}
                tick={{ fontSize: 12, fill: COLORS.TEXT.SECONDARY }}
              />
              <YAxis width={28} tick={{ fontSize: 11, fill: COLORS.TEXT.SECONDARY }} />
              <Tooltip
                formatter={(value: number | undefined) => [value ?? 0, 'Kudos']}
                contentStyle={{ borderRadius: BORDER_RADIUS.BASE, border: `1px solid ${COLORS.GRAY[200]}` }}
              />
              <Bar dataKey="count" fill={COLORS.PRIMARY.MAIN} radius={[4, 4, 0, 0]} name="Kudos" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
