import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

const userData = [
    {
        label: 'Alimentos',
        value: 9.5,
    },
    {
        label: 'Lazer',
        value: 25.5,
    },
    {
        label: 'Saúde',
        value: 10,
    },
    {
        label: 'Transporte',
        value: 25,
    },
    {
        label: 'Despesas Fixas',
        value: 30,
    }
]

export default function PieArcLabel() {
    return (
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: '60%',
            ...data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
            fontFamily: 'monospace'
          },
        }}
        {...size}
      />
    );
  }
  
const size = {
    width: 400,
    height: 200,
};
  
const data = {
    data: userData,
};