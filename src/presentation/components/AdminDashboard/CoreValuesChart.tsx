import { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Kudo } from 'domain/models';
import { MOCK_CORE_VALUES } from 'shared/mocks';
import { SPACING, COLORS } from 'presentation/theme/designSystem';

interface CoreValuesChartProps {
  kudos: Kudo[];
}

export const CoreValuesChart = ({ kudos }: CoreValuesChartProps) => {
  const chartData = useMemo(() => {
    // Count kudos per core value
    const counts = new Map<string, number>();
    
    kudos.forEach((kudo) => {
      if (kudo.core_value_id) {
        counts.set(kudo.core_value_id, (counts.get(kudo.core_value_id) || 0) + 1);
      }
    });

    // Transform to chart data
    return MOCK_CORE_VALUES.map((coreValue) => ({
      name: `${coreValue.emoji} ${coreValue.name}`,
      count: counts.get(coreValue.id!) || 0,
    }));
  }, [kudos]);

  const mostPopular = useMemo(() => {
    const sorted = [...chartData].sort((a, b) => b.count - a.count);
    return sorted[0];
  }, [chartData]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: SPACING.LARGE,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: SPACING.SMALL }}>
        Core Values Popularity
      </Typography>
      
      {mostPopular && mostPopular.count > 0 && (
        <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY, mb: SPACING.MEDIUM }}>
          Most popular: <strong>{mostPopular.name}</strong> ({mostPopular.count} kudos)
        </Typography>
      )}

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={COLORS.PRIMARY.MAIN} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
