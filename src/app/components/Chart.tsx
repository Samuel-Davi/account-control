import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { getCookie } from 'cookies-next';
import { Transaction } from '../models/Transaction';
import { Decimal } from '@prisma/client/runtime/library';

type userDataSchema = {
    label: string;
    value: number;
}

type DataType = {
    data: userDataSchema[];
    valueFormatter: (item: { value: number; }) => string;
}

export default function PieArcLabel() {

  const valueFormatter = (item: { value: number }) => `${item.value} R$`;

    const fixedData: userDataSchema[] = [
        { label: "Alimentos", value: 50 },
        { label: "Saúde", value: 25 },
        { label: "Transporte", value: 50 },
        { label: "Lazer", value: 25 },
    ]

    const [saveData, setSaveData] = useState<Array<Transaction>>()
    const [data, setData] = useState<DataType>({
      data: fixedData,
      valueFormatter,
    });
    const [total, setTotal] = useState(1)

    const categories: { [key: number]: string } = {
        1: "Alimentos",
        2: "Saúde",
        3: "Transporte",
        4: "Lazer",
        5: "Despesas Fixas",
        6: "Ganhos"
    }

    useEffect(() => {
        const categoryMap = new Map<string, number>();

        saveData?.forEach(({ category_id, amount}) => {
            const numericAmount:Decimal = amount;
            categoryMap.set(categories[category_id], (categoryMap.get(categories[category_id]) || 0) + Number.parseInt(numericAmount.toString()))
        })

        categoryMap.delete("Ganhos")

        setTotal(Array.from(categoryMap.values()).reduce((sum, value) => sum + value, 0))

        const groupedData: userDataSchema[] = Array.from(categoryMap, ([label, value]) => ({
            label,
            value,
        }));

        const object = {
          data: groupedData,
          valueFormatter
        }
          
        setData(object);
    }, [saveData])

    useEffect(() => {
      fetch(`${api}/getTransactions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${getCookie("account_token")}`,
            "Content-Type": "application/json"
          },
      })
          .then(response => response.json())
          .then(data => {
              setSaveData(data.transactions);
          })
          .catch(error => console.error('Error:', error));
    }, [])

    return (
      <div className='h-2/4 flex flex-col justify-center items-center'>
        <h1 className='text-3xl'>Seus Gastos:</h1>
        <PieChart
          series={[
            {
              arcLabel: (item) => `${((item.value/total)*100).toFixed(2)}%`,
              arcLabelMinAngle: 25,
              data : data.data,
              valueFormatter: data.valueFormatter,
              innerRadius: 30,
              outerRadius: 120,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -45,
              cx: 190,
              cy: 75,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: 'bold',
              fontFamily: 'monospace',
              fontSize: '12px',
            },
          }}
          {...size}
          slotProps={{
            legend: { 
            direction: 'row',
            position: {
              vertical: 'bottom',
              horizontal: 'middle'
            } }
          }}
        />
      </div>
    );
  }
  
const size = {
    width: 390,
    height: 300,
};