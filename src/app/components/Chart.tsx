import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { Box } from '@mui/material';
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
    const [saveData, setSaveData] = useState<Array<Transaction>>()
    const [data, setData] = useState<DataType>()
    const [total, setTotal] = useState(1)
    const [comData, setComData] = useState(false)

    const categories: { [key: number]: string } = {
        1: "Alimentos",
        2: "Saúde",
        3: "Transporte",
        4: "Lazer",
        5: "Despesas Fixas",
        6: "Ganhos",
        7: "Outros"
    }

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
      if(data?.data.length != 0){
        setComData(true);
      }else{
        setComData(false);
      }
    }, [data, setData])

    return (
      <div className='h-3/4 flex flex-col justify-center items-center'>
        <h1 className='text-3xl'>Seus Gastos:</h1>
        <Box sx={{ width: "100%", height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {!comData && (
            <h1>Sem Gastos até o Momento...</h1>
          )}
          {comData && (
            <PieChart
            series={[
              {
                arcLabel: (item) => `${((item.value/total)*100).toFixed(2)}%`,
                arcLabelMinAngle: 25,
                data : data?.data ?? [],
                valueFormatter: valueFormatter,
                innerRadius: 30,
                outerRadius: 120,
                paddingAngle: 2,
                cornerRadius: 5,
                startAngle: -45,
                cx: 190,
                cy: 150,
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
          )}
        </Box>
      </div>
    );
  }
  
const size = {
    width: 400,
    height: 400,
};